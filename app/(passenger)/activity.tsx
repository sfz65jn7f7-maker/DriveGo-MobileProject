import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Chip';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorView } from '@/components/common/ErrorView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { useMyBookings } from '@/features/carpool';
import { useRideHistory } from '@/features/ride';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import { formatDateTime, formatPrice } from '@/utils/format';

type Tab = 'rides' | 'carpool';

export default function ActivityScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const [tab, setTab] = useState<Tab>('rides');
  const rides = useRideHistory();
  const bookings = useMyBookings();
  const query = tab === 'rides' ? rides : bookings;

  const refresh = <RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} tintColor={colors.primary} />;

  return (
    <Screen edges={['top', 'left', 'right']}>
      <ScreenHeader title={t('screens.activity')} showBack={false} showAvatar />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'rides', label: t('activity.rides') },
          { value: 'carpool', label: t('tabs.carpool') },
        ]}
      />

      {query.isLoading ? (
        <ListSkeleton />
      ) : query.isError ? (
        <ErrorView onRetry={query.refetch} />
      ) : tab === 'rides' ? (
        <FlatList
          data={rides.data}
          keyExtractor={(r) => r.id}
          refreshControl={refresh}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="car-outline"
              title={t('activity.noRides')}
              message={t('activity.noRidesHint')}
              actionLabel={t('activity.bookRide')}
              onAction={() => router.push(ROUTES.ride.searchDestination)}
            />
          }
          renderItem={({ item }) => (
            <Card onPress={() => router.push(ROUTES.ride.detail(item.id))} accessibilityLabel={`${item.pickup.title} → ${item.destination.title}`}>
              <View style={styles.head}>
                <AppText variant="caption" color="textSecondary">{formatDateTime(item.createdAt, i18n.language)}</AppText>
                <Badge label={t(`rideStatus.${item.status}`)} tone={item.status === 'completed' ? 'success' : 'danger'} />
              </View>
              <RouteSummary from={item.pickup.title} to={item.destination.title} compact />
              <View style={[styles.foot, { borderTopColor: colors.border }]}>
                <AppText variant="caption" color="textSecondary">{item.driverName ?? '—'}</AppText>
                <AppText variant="subheading">{formatPrice(item.price)}</AppText>
              </View>
            </Card>
          )}
        />
      ) : (
        <FlatList
          data={bookings.data}
          keyExtractor={(b) => b.id}
          refreshControl={refresh}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="people-outline"
              title={t('activity.noCarpool')}
              actionLabel={t('carpoolTab.search')}
              onAction={() => router.push(ROUTES.carpool.search)}
            />
          }
          renderItem={({ item }) => (
            <Card onPress={() => router.push(ROUTES.carpool.detail(item.trip.id))}>
              <View style={styles.head}>
                <AppText variant="caption" color="textSecondary">{formatDateTime(item.trip.departureAt, i18n.language)}</AppText>
                <Badge label={t(`carpool.booking.${item.status}`)} tone={item.status === 'confirmed' ? 'success' : 'danger'} />
              </View>
              <RouteSummary from={item.trip.from} to={item.trip.to} compact />
              <View style={[styles.foot, { borderTopColor: colors.border }]}>
                <AppText variant="caption" color="textSecondary">
                  {item.trip.driver.name} · {t('carpool.seatsCount', { count: item.seats })}
                </AppText>
                <AppText variant="subheading">{formatPrice(item.trip.pricePerSeat * item.seats)}</AppText>
              </View>
            </Card>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, paddingVertical: spacing.md, flexGrow: 1 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  foot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
