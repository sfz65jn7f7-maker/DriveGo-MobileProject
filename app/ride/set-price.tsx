import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { PriceInput } from '@/components/ride/PriceInput';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { useCreateRide } from '@/features/ride';
import { useSettingsStore } from '@/features/settings/settings.store';
import { useRideStore } from '@/store/ride.store';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import { formatDistance, formatDuration, formatPrice } from '@/utils/format';
import { estimateMinutes, roadDistanceKm, suggestedPrice } from '@/utils/geo';

export default function SetPriceScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const pickup = useRideStore((s) => s.pickup);
  const destination = useRideStore((s) => s.destination);
  const setProposedPrice = useRideStore((s) => s.setProposedPrice);
  const setActiveRideId = useRideStore((s) => s.setActiveRideId);
  const setAcceptedOffer = useRideStore((s) => s.setAcceptedOffer);
  const payment = useSettingsStore((s) => s.defaultPayment);
  const setPayment = useSettingsStore((s) => s.setDefaultPayment);
  const createRide = useCreateRide();

  const estimate = useMemo(() => {
    if (!pickup || !destination) return null;
    const km = roadDistanceKm(pickup.coords, destination.coords);
    return { km, minutes: estimateMinutes(km), price: suggestedPrice(km) };
  }, [pickup, destination]);

  const [price, setPrice] = useState(estimate?.price ?? 30);

  if (!pickup || !destination || !estimate) return <Redirect href={ROUTES.ride.searchDestination} />;

  const tooLow = price < estimate.price * 0.8;

  const submit = async () => {
    const ride = await createRide.mutateAsync({ pickup, destination, price });
    setProposedPrice(price);
    setAcceptedOffer(null);
    setActiveRideId(ride.id);
    router.push(ROUTES.ride.offers);
  };

  return (
    <Screen scroll>
      <ScreenHeader title={t('screens.setPrice')} />

      <Card>
        <RouteSummary from={pickup.title} fromDetail={pickup.address} to={destination.title} toDetail={destination.address} compact />
        <View style={[styles.meta, { borderTopColor: colors.border }]}>
          <AppText variant="caption" color="textSecondary">
            {formatDistance(estimate.km)} · ≈ {formatDuration(estimate.minutes)}
          </AppText>
        </View>
      </Card>

      <View style={styles.priceBlock}>
        <AppText color="textSecondary" style={styles.center}>{t('ride.offerYourPrice')}</AppText>
        <PriceInput value={price} onChange={setPrice} />
        <AppText variant="caption" color="textSecondary" style={styles.center}>
          {t('ride.suggested', { price: formatPrice(estimate.price) })}
        </AppText>
        {tooLow ? (
          <View style={[styles.warning, { backgroundColor: `${colors.warning}22` }]}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
            <AppText variant="caption" style={styles.flex}>{t('ride.lowPriceWarning')}</AppText>
          </View>
        ) : null}
      </View>

      <AppText variant="label" color="textSecondary" style={styles.label}>{t('settings.defaultPayment')}</AppText>
      <View style={styles.payments}>
        <Chip icon="cash-outline" label={t('settings.paymentCash')} selected={payment === 'cash'} onPress={() => setPayment('cash')} />
        <Chip icon="card-outline" label={t('settings.paymentCard')} selected={payment === 'card'} onPress={() => setPayment('card')} />
      </View>

      <View style={styles.flex} />
      <Button label={t('ride.findDriver')} icon="search" onPress={submit} loading={createRide.isPending} style={styles.submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  meta: { marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth },
  priceBlock: { gap: spacing.sm, marginVertical: spacing.xl },
  warning: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: 12 },
  label: { marginBottom: spacing.sm },
  payments: { flexDirection: 'row', gap: spacing.sm },
  submit: { marginVertical: spacing.lg },
});
