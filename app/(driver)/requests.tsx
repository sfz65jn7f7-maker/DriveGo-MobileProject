import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { AppModal } from '@/components/ui/AppModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorView } from '@/components/common/ErrorView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { PriceInput } from '@/components/ride/PriceInput';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { Avatar } from '@/components/ui/Avatar';
import { useAcceptRequest, useCounterOffer, useDeclineRequest, useDriverStore, useIncomingRequests } from '@/features/driver';
import { driverService } from '@/services/driver.service';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import type { RideRequest } from '@/types';
import { formatDistance, formatPrice } from '@/utils/format';

export default function RequestsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const online = useDriverStore((s) => s.online);
  const setOnline = useDriverStore((s) => s.setOnline);
  const setActiveRequest = useDriverStore((s) => s.setActiveRequest);
  const { data, isLoading, isError, refetch, isRefetching } = useIncomingRequests();
  const accept = useAcceptRequest();
  const counter = useCounterOffer();
  const decline = useDeclineRequest();
  const [countering, setCountering] = useState<RideRequest | null>(null);
  const [counterPrice, setCounterPrice] = useState(0);

  const start = (request: RideRequest) => {
    setActiveRequest(request);
    router.push(ROUTES.driver.ride);
  };

  const onAccept = async (r: RideRequest) => start(await accept.mutateAsync(r.id));

  const onCounter = async () => {
    if (!countering) return;
    const updated = await counter.mutateAsync({ id: countering.id, price: counterPrice });
    setCountering(null);
    start(updated);
  };

  const refresh = async () => {
    if (!data?.length) await driverService.resetRequests();
    await refetch();
  };

  if (!online) {
    return (
      <Screen edges={['top', 'left', 'right']}>
        <ScreenHeader title={t('screens.requests')} showBack={false} showAvatar />
        <EmptyState
          icon="moon-outline"
          title={t('driver.offline')}
          message={t('driver.offlineHint')}
          actionLabel={t('driver.goOnline')}
          onAction={() => setOnline(true)}
        />
      </Screen>
    );
  }

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title={t('screens.requests')} showBack={false} showAvatar />
      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorView onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refresh} tintColor={colors.primary} />}
          ListEmptyComponent={
            <EmptyState
              icon="hourglass-outline"
              title={t('requests.empty')}
              message={t('requests.emptyHint')}
              actionLabel={t('requests.refresh')}
              onAction={refresh}
            />
          }
          renderItem={({ item }) => (
            <Card>
              <View style={styles.head}>
                <Avatar name={item.passengerName} size={40} />
                <View style={styles.flex}>
                  <AppText variant="subheading">{item.passengerName}</AppText>
                  <AppText variant="caption" color="textSecondary">{formatDistance(item.distanceKm)}</AppText>
                </View>
                <AppText variant="heading" color="primary">{formatPrice(item.proposedPrice)}</AppText>
              </View>
              <RouteSummary from={item.pickup.title} to={item.destination.title} compact />
              <View style={styles.actions}>
                <Button label={t('ride.accept')} onPress={() => onAccept(item)} loading={accept.isPending && accept.variables === item.id} />
                <View style={styles.row}>
                  <View style={styles.flex}>
                    <Button
                      label={t('requests.counter')}
                      variant="secondary"
                      onPress={() => {
                        setCounterPrice(item.proposedPrice + 5);
                        setCountering(item);
                      }}
                    />
                  </View>
                  <View style={styles.flex}>
                    <Button label={t('requests.decline')} variant="ghost" onPress={() => decline.mutate(item.id)} />
                  </View>
                </View>
              </View>
            </Card>
          )}
        />
      )}

      <AppModal
        visible={!!countering}
        onClose={() => setCountering(null)}
        title={t('requests.counterTitle')}
        actions={[
          { label: counter.isPending ? t('common.loading') : t('requests.sendCounter'), onPress: () => void onCounter() },
          { label: t('common.cancel'), variant: 'ghost', onPress: () => setCountering(null) },
        ]}
      >
        {countering ? (
          <View style={styles.modal}>
            <AppText color="textSecondary">
              {t('requests.passengerOffers', { name: countering.passengerName, price: formatPrice(countering.proposedPrice) })}
            </AppText>
            <PriceInput value={counterPrice} onChange={setCounterPrice} min={countering.proposedPrice} />
          </View>
        ) : null}
      </AppModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { gap: spacing.md, paddingVertical: spacing.md, flexGrow: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm },
  modal: { gap: spacing.lg, marginTop: spacing.md },
});
