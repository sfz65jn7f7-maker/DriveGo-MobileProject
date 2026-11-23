import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppModal } from '@/components/ui/AppModal';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { ListSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SettingsRow, SettingsSection } from '@/features/settings/components';
import { useSettingsStore } from '@/features/settings/settings.store';
import { useTopUp, useTransactions, useWallet } from '@/features/wallet';
import { layout, radius, spacing, useTheme } from '@/theme';
import type { TransactionType } from '@/types';
import { notify } from '@/utils/dialog';
import { formatDateTime, formatPrice } from '@/utils/format';

const AMOUNTS = [50, 100, 200, 500];
const TX_ICONS: Record<TransactionType, React.ComponentProps<typeof Ionicons>['name']> = {
  ride: 'car-outline',
  carpool: 'people-outline',
  topup: 'add-circle-outline',
  refund: 'arrow-undo-outline',
  payout: 'cash-outline',
};

export default function WalletScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const wallet = useWallet();
  const transactions = useTransactions();
  const topUp = useTopUp();
  const payment = useSettingsStore((s) => s.defaultPayment);
  const setPayment = useSettingsStore((s) => s.setDefaultPayment);
  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState(100);

  const confirmTopUp = async () => {
    await topUp.mutateAsync({ amount, label: t('wallet.topUpLabel') });
    setModal(false);
    notify(t('wallet.topUpDone', { amount: formatPrice(amount) }));
  };

  const refreshing = wallet.isRefetching || transactions.isRefetching;
  const refresh = () => {
    void wallet.refetch();
    void transactions.refetch();
  };

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader title={t('screens.wallet')} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.padded, styles.content]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
      >
        <View style={[styles.balance, { backgroundColor: colors.primary }]}>
          <AppText color="onPrimary" style={styles.muted}>{t('wallet.balance')}</AppText>
          {wallet.data ? (
            <AppText variant="title" color="onPrimary">{formatPrice(wallet.data.balance)}</AppText>
          ) : (
            <Skeleton width={140} height={40} />
          )}
          <Button label={t('wallet.topUp')} icon="add" variant="secondary" fullWidth={false} onPress={() => setModal(true)} style={styles.topUp} />
        </View>

        <SettingsSection title={t('settings.defaultPayment')}>
          <SettingsRow icon="cash-outline" label={t('settings.paymentCash')} selected={payment === 'cash'} onPress={() => setPayment('cash')} />
          <SettingsRow icon="card-outline" label={t('wallet.cardMasked')} selected={payment === 'card'} onPress={() => setPayment('card')} />
        </SettingsSection>

        <AppText variant="label" color="textSecondary" style={styles.section}>{t('wallet.history')}</AppText>
        {transactions.isLoading ? (
          <ListSkeleton count={3} />
        ) : (
          <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {transactions.data?.map((tx, i) => (
              <View key={tx.id} style={[styles.tx, i > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
                <View style={[styles.txIcon, { backgroundColor: colors.background }]}>
                  <Ionicons name={TX_ICONS[tx.type]} size={20} color={colors.primary} />
                </View>
                <View style={styles.flex}>
                  <AppText numberOfLines={1}>{tx.label}</AppText>
                  <AppText variant="caption" color="textSecondary">{formatDateTime(tx.createdAt, i18n.language)}</AppText>
                </View>
                <AppText variant="subheading" color={tx.amount > 0 ? 'success' : 'text'}>
                  {tx.amount > 0 ? '+' : '−'}{formatPrice(Math.abs(tx.amount))}
                </AppText>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <AppModal
        visible={modal}
        onClose={() => setModal(false)}
        title={t('wallet.topUp')}
        message={t('wallet.topUpHint')}
        actions={[
          { label: topUp.isPending ? t('common.loading') : t('wallet.topUpConfirm', { amount: formatPrice(amount) }), onPress: () => void confirmTopUp() },
          { label: t('common.cancel'), variant: 'ghost', onPress: () => setModal(false) },
        ]}
      >
        <View style={styles.amounts}>
          {AMOUNTS.map((a) => (
            <Chip key={a} label={formatPrice(a)} selected={a === amount} onPress={() => setAmount(a)} />
          ))}
        </View>
      </AppModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  padded: { paddingHorizontal: layout.screenPadding },
  content: { paddingBottom: spacing.xxl },
  balance: { padding: spacing.xl, borderRadius: radius.xl, gap: spacing.xs },
  muted: { opacity: 0.85 },
  topUp: { marginTop: spacing.md, alignSelf: 'flex-start' },
  section: { marginTop: spacing.xl, marginBottom: spacing.sm, marginHorizontal: spacing.xs },
  group: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  tx: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  amounts: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
});
