import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Segmented } from '@/components/ui/Chip';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TripCard } from '@/components/carpool/TripCard';
import { useCancelBooking, useMyBookings, useMyPublishedTrips } from '@/features/carpool';
import { useAuthStore } from '@/features/auth/auth.store';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import { ask } from '@/utils/dialog';

type Tab = 'bookings' | 'published';

export default function MyTripsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const isDriver = useAuthStore((s) => s.activeRole === 'driver');
  const [tab, setTab] = useState<Tab>(isDriver ? 'published' : 'bookings');
  const bookings = useMyBookings();
  const published = useMyPublishedTrips();
  const cancel = useCancelBooking();
  const query = tab === 'bookings' ? bookings : published;

  const confirmCancel = async (id: string) => {
    const ok = await ask(t('carpool.cancelBooking'), t('carpool.cancelBookingMessage'), t('carpool.cancelBooking'), t('common.no'));
    if (ok) cancel.mutate(id);
  };

  const refresh = <RefreshControl refreshing={query.isRefetching} onRefresh={() => void query.refetch()} tintColor={colors.primary} />;

  return (
    <Screen>
      <ScreenHeader title={t('screens.myTrips')} />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'bookings', label: t('carpool.myBookings') },
          { value: 'published', label: t('carpool.myPublished') },
        ]}
      />

      {query.isLoading ? (
        <ListSkeleton />
      ) : tab === 'bookings' ? (
        <FlatList
          data={bookings.data}
          keyExtractor={(b) => b.id}
          refreshControl={refresh}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="bookmark-outline"
              title={t('carpool.noBookings')}
              actionLabel={t('carpoolTab.search')}
              onAction={() => router.push(ROUTES.carpool.search)}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.row}>
                <Badge label={t(`carpool.booking.${item.status}`)} tone={item.status === 'confirmed' ? 'success' : 'danger'} />
                <Badge label={t('carpool.seatsCount', { count: item.seats })} />
              </View>
              <TripCard trip={item.trip} onPress={() => router.push(ROUTES.carpool.detail(item.trip.id))} />
              {item.status === 'confirmed' ? (
                <Button label={t('carpool.cancelBooking')} variant="ghost" onPress={() => confirmCancel(item.id)} />
              ) : null}
            </View>
          )}
        />
      ) : (
        <FlatList
          data={published.data}
          keyExtractor={(trip) => trip.id}
          refreshControl={refresh}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="add-circle-outline"
              title={t('carpool.noPublished')}
              message={t('carpool.noPublishedHint')}
              actionLabel={t('carpoolTab.publish')}
              onAction={() => router.push(ROUTES.carpool.publish)}
            />
          }
          renderItem={({ item }) => <TripCard trip={item} onPress={() => router.push(ROUTES.carpool.detail(item.id))} />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg, paddingVertical: spacing.md, flexGrow: 1 },
  item: { gap: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
});
