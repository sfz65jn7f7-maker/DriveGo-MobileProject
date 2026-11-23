import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RatingStars } from '@/components/ui/RatingStars';
import { Screen } from '@/components/common/Screen';
import { DriverCard } from '@/components/ride/DriverCard';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { useRateRide, useRide } from '@/features/ride';
import { useBlockBack } from '@/hooks/useBlockBack';
import { useRideStore } from '@/store/ride.store';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import { formatDistance, formatDuration, formatPrice } from '@/utils/format';

const LABELS = ['', 'ride.rating1', 'ride.rating2', 'ride.rating3', 'ride.rating4', 'ride.rating5'];

export default function CompletedScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const rideId = useRideStore((s) => s.activeRideId);
  const offer = useRideStore((s) => s.acceptedOffer);
  const reset = useRideStore((s) => s.reset);
  const { data: ride } = useRide(rideId ?? undefined);
  const rate = useRateRide();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const finish = () => {
    reset();
    router.dismissTo(ROUTES.passenger.home);
  };
  useBlockBack(finish);

  const submit = async () => {
    if (rideId && rating) await rate.mutateAsync({ rideId, rating, comment: comment.trim() || undefined });
    finish();
  };

  return (
    <Screen scroll keyboard>
      <View style={styles.hero}>
        <View style={[styles.check, { backgroundColor: `${colors.success}22` }]}>
          <Ionicons name="checkmark" size={44} color={colors.success} />
        </View>
        <AppText variant="heading">{t('ride.arrived')}</AppText>
        <AppText variant="title" color="primary">{formatPrice(ride?.price ?? offer?.price ?? 0)}</AppText>
        <AppText color="textSecondary">{t('ride.payDriver')}</AppText>
      </View>

      {ride ? (
        <Card>
          <RouteSummary from={ride.pickup.title} to={ride.destination.title} compact />
          {ride.distanceKm ? (
            <AppText variant="caption" color="textSecondary" style={styles.meta}>
              {formatDistance(ride.distanceKm)} · {formatDuration(ride.durationMinutes ?? 0)}
            </AppText>
          ) : null}
        </Card>
      ) : null}

      {offer ? (
        <View style={styles.rate}>
          <DriverCard driver={offer.driver} />
          <AppText variant="subheading" style={styles.center}>{t('ride.rateDriver', { name: offer.driver.name })}</AppText>
          <RatingStars value={rating} onChange={setRating} />
          <AppText color="textSecondary" style={styles.center}>{rating ? t(LABELS[rating]) : ' '}</AppText>
          {rating ? (
            <Input
              placeholder={t('ride.commentPlaceholder')}
              value={comment}
              onChangeText={setComment}
              multiline
              maxLength={300}
              leftIcon="chatbox-ellipses-outline"
            />
          ) : null}
        </View>
      ) : null}

      <View style={styles.flex} />
      <View style={styles.footer}>
        <Button label={rating ? t('ride.sendRating') : t('common.goHome')} onPress={submit} loading={rate.isPending} />
        {rating ? <Button label={t('common.skip')} variant="ghost" onPress={finish} /> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  hero: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl },
  check: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  meta: { marginTop: spacing.sm },
  rate: { gap: spacing.md, marginTop: spacing.xl },
  footer: { gap: spacing.xs, paddingVertical: spacing.lg },
});
