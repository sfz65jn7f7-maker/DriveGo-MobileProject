import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RatingStars } from '@/components/ui/RatingStars';
import { ErrorView } from '@/components/common/ErrorView';
import { Loader } from '@/components/common/Loader';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { DriverCard } from '@/components/ride/DriverCard';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { useRide } from '@/features/ride';
import { useRideStore } from '@/store/ride.store';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import { formatDateTime, formatDistance, formatDuration, formatPrice } from '@/utils/format';

export default function RideDetailScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: ride, isLoading, isError, refetch } = useRide(id);
  const setPickup = useRideStore((s) => s.setPickup);
  const setDestination = useRideStore((s) => s.setDestination);

  const rebook = () => {
    if (!ride) return;
    setPickup(ride.pickup);
    setDestination(ride.destination);
    router.push(ROUTES.ride.setPrice);
  };

  return (
    <Screen scroll>
      <ScreenHeader title={t('screens.rideDetail')} />
      {isLoading ? (
        <Loader />
      ) : isError || !ride ? (
        <ErrorView onRetry={refetch} />
      ) : (
        <View style={styles.content}>
          <View style={styles.row}>
            <AppText color="textSecondary">{formatDateTime(ride.createdAt, i18n.language)}</AppText>
            <Badge
              label={t(`rideStatus.${ride.status}`)}
              tone={ride.status === 'completed' ? 'success' : ride.status === 'cancelled' ? 'danger' : 'primary'}
            />
          </View>

          <Card>
            <RouteSummary from={ride.pickup.title} fromDetail={ride.pickup.address} to={ride.destination.title} toDetail={ride.destination.address} />
          </Card>

          <Card>
            <View style={styles.line}>
              <AppText color="textSecondary">{t('ride.price')}</AppText>
              <AppText variant="subheading">{formatPrice(ride.price)}</AppText>
            </View>
            {ride.distanceKm ? (
              <View style={[styles.line, styles.border, { borderTopColor: colors.border }]}>
                <AppText color="textSecondary">{t('ride.distance')}</AppText>
                <AppText>{formatDistance(ride.distanceKm)} · {formatDuration(ride.durationMinutes ?? 0)}</AppText>
              </View>
            ) : null}
          </Card>

          {ride.driver ? (
            <Card>
              <DriverCard driver={ride.driver} />
              {ride.rating ? (
                <View style={[styles.rating, { borderTopColor: colors.border }]}>
                  <AppText variant="caption" color="textSecondary">{t('ride.yourRating')}</AppText>
                  <RatingStars value={ride.rating} size={20} />
                </View>
              ) : null}
            </Card>
          ) : null}

          <Button label={t('ride.rebook')} icon="refresh" onPress={rebook} />
          <Button label={t('ride.reportProblem')} icon="help-buoy-outline" variant="ghost" onPress={() => router.push(ROUTES.help)} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.xl },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xs },
  border: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: spacing.sm, paddingTop: spacing.sm },
  rating: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.xs, alignItems: 'flex-start' },
});
