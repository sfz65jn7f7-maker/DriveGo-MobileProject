import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorView } from '@/components/common/ErrorView';
import { Loader } from '@/components/common/Loader';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SeatSelector } from '@/components/carpool/SeatSelector';
import { DriverCard } from '@/components/ride/DriverCard';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { useBookSeats, useCarpoolTrip } from '@/features/carpool';
import { useAuthStore } from '@/features/auth/auth.store';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import { notify } from '@/utils/dialog';
import { formatDateTime, formatPrice } from '@/utils/format';

const RULE_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  noSmoking: 'ban-outline',
  noPets: 'paw-outline',
  pets: 'paw',
  lightLuggage: 'briefcase-outline',
  music: 'musical-notes-outline',
};

export default function CarpoolDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ id: string; seats?: string }>();
  const { data: trip, isLoading, isError, refetch } = useCarpoolTrip(params.id);
  const book = useBookSeats();
  const userId = useAuthStore((s) => s.user?.id);
  const [seats, setSeats] = useState(Number(params.seats) || 1);

  if (isLoading) return <Screen><ScreenHeader title={t('screens.carpoolDetail')} /><Loader /></Screen>;
  if (isError || !trip) return <Screen><ScreenHeader title={t('screens.carpoolDetail')} /><ErrorView onRetry={refetch} /></Screen>;

  const isMine = trip.driver.id === userId;
  const max = Math.max(1, trip.seatsAvailable);
  const count = Math.min(seats, max);

  const onBook = async () => {
    try {
      await book.mutateAsync({ tripId: trip.id, seats: count });
      notify(t('carpool.bookedTitle'), t('carpool.bookedMessage', { from: trip.from, to: trip.to }));
      router.replace(ROUTES.carpool.myTrips);
    } catch {
      notify(t('common.errorTitle'), t('carpool.notEnoughSeats'));
    }
  };

  return (
    <Screen scroll>
      <ScreenHeader title={t('screens.carpoolDetail')} />
      <View style={styles.content}>
        <AppText variant="heading">{formatDateTime(trip.departureAt, i18n.language)}</AppText>
        <Card>
          <RouteSummary from={trip.from} to={trip.to} />
        </Card>

        <Card>
          <DriverCard driver={trip.driver} />
          <AppText variant="caption" color="textSecondary" style={styles.trips}>
            {t('carpool.driverTrips', { count: trip.driver.trips })}
          </AppText>
        </Card>

        {trip.rules.length ? (
          <Card>
            <AppText variant="label" color="textSecondary" style={styles.label}>{t('carpool.rulesTitle')}</AppText>
            {trip.rules.map((r) => (
              <View key={r} style={styles.rule}>
                <Ionicons name={RULE_ICONS[r] ?? 'information-circle-outline'} size={18} color={colors.primary} />
                <AppText>{t(`carpool.rules.${r}`, { defaultValue: r })}</AppText>
              </View>
            ))}
          </Card>
        ) : null}

        {!isMine && trip.seatsAvailable > 0 ? (
          <Card>
            <View style={styles.seatRow}>
              <View>
                <AppText variant="subheading">{t('carpool.seats')}</AppText>
                <AppText variant="caption" color="textSecondary">{t('carpool.seatsLeft', { count: trip.seatsAvailable })}</AppText>
              </View>
              <SeatSelector value={count} max={max} onChange={setSeats} />
            </View>
            <View style={[styles.total, { borderTopColor: colors.border }]}>
              <AppText color="textSecondary">{t('carpool.total')}</AppText>
              <AppText variant="heading" color="primary">{formatPrice(trip.pricePerSeat * count)}</AppText>
            </View>
          </Card>
        ) : null}

        {isMine ? (
          <AppText color="textSecondary" style={styles.center}>{t('carpool.yourTrip')}</AppText>
        ) : trip.seatsAvailable === 0 ? (
          <AppText color="danger" style={styles.center}>{t('carpool.full')}</AppText>
        ) : (
          <Button label={t('carpool.book', { count })} icon="checkmark-circle-outline" onPress={onBook} loading={book.isPending} />
        )}
        <Button
          label={t('ride.message')}
          icon="chatbubble-ellipses-outline"
          variant="ghost"
          onPress={() => router.push(ROUTES.chat(trip.id, trip.driver.name))}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  center: { textAlign: 'center' },
  trips: { marginTop: spacing.sm },
  label: { marginBottom: spacing.sm },
  rule: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs },
  seatRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
