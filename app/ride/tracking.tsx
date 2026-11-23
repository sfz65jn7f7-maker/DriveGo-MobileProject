import { useCallback, useEffect, useMemo } from 'react';
import { notify } from '@/features/notifications';
import { Linking, StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { DriverCard } from '@/components/ride/DriverCard';
import { RideMap } from '@/components/ride/RideMap';
import { RideStatusSheet } from '@/components/ride/RideStatusSheet';
import { useCancelRide, useRouteSimulation } from '@/features/ride';
import { useBlockBack } from '@/hooks/useBlockBack';
import { rideService } from '@/services/ride.service';
import { useRideStore } from '@/store/ride.store';
import { ROUTES } from '@/constants/routes';
import { radius, spacing, useTheme } from '@/theme';
import { ask } from '@/utils/dialog';
import { formatPrice } from '@/utils/format';
import { offset } from '@/utils/geo';

/** Durée simulée de l'approche du chauffeur (à remplacer par le temps réel du backend). */
const APPROACH_MS = 20_000;

export default function TrackingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const rideId = useRideStore((s) => s.activeRideId);
  const pickup = useRideStore((s) => s.pickup);
  const destination = useRideStore((s) => s.destination);
  const offer = useRideStore((s) => s.acceptedOffer);
  const reset = useRideStore((s) => s.reset);
  const cancel = useCancelRide();

  const start = useMemo(() => (pickup ? offset(pickup.coords) : null), [pickup]);
  const { position, progress, done } = useRouteSimulation(start, pickup?.coords, APPROACH_MS, !!offer);

  useEffect(() => {
    if (rideId) void rideService.setStatus(rideId, done ? 'arriving' : 'driver_assigned');
  }, [rideId, done]);

  // Alertes : « arrive dans 1 min » puis « est arrivé » (une seule fois chacune)
  const near = progress >= 0.75;
  const driverName = offer?.driver.name ?? '';
  const plate = offer?.driver.vehicle.plate ?? '';
  useEffect(() => {
    if (!near || done) return;
    void notify({ kind: 'ride', title: t('alerts.driverNearTitle'), body: t('alerts.driverNearBody', { name: driverName }), url: ROUTES.ride.tracking });
  }, [near, done, driverName, t]);
  useEffect(() => {
    if (!done) return;
    void notify({ kind: 'ride', title: t('alerts.driverArrivedTitle'), body: t('alerts.driverArrivedBody', { name: driverName, plate }), url: ROUTES.ride.tracking });
  }, [done, driverName, plate, t]);

  const confirmCancel = useCallback(async () => {
    const ok = await ask(t('ride.cancelTitle'), t('ride.cancelDriverMessage'), t('ride.cancelRide'), t('common.no'));
    if (!ok || !rideId) return;
    await cancel.mutateAsync(rideId);
    reset();
    router.dismissTo(ROUTES.passenger.home);
  }, [t, rideId, cancel, reset, router]);

  useBlockBack(confirmCancel);

  if (!rideId || !pickup || !destination || !offer) return <Redirect href={ROUTES.passenger.home} />;

  const eta = Math.max(1, Math.ceil(offer.etaMinutes * (1 - progress)));

  const startRide = async () => {
    await rideService.setStatus(rideId, 'in_progress');
    router.replace(ROUTES.ride.inProgress);
  };

  return (
    <View style={styles.flex}>
      <RideMap pickup={pickup.coords} driver={position} />

      <RideStatusSheet
        title={done ? t('ride.driverArrived') : t('ride.driverComing', { minutes: eta })}
        subtitle={done ? t('ride.driverArrivedHint') : pickup.title}
      >
        <View style={[styles.progress, { backgroundColor: colors.border }]}>
          <View style={[styles.bar, { backgroundColor: colors.primary, width: `${Math.round(progress * 100)}%` }]} />
        </View>

        <DriverCard
          driver={offer.driver}
          right={<AppText variant="heading" color="primary">{formatPrice(offer.price)}</AppText>}
        />

        <View style={styles.actions}>
          <IconButton
            icon="call-outline"
            variant="floating"
            color="primary"
            accessibilityLabel={t('ride.call')}
            onPress={() => void Linking.openURL('tel:0600000000')}
          />
          <IconButton
            icon="chatbubble-ellipses-outline"
            variant="floating"
            color="primary"
            accessibilityLabel={t('ride.message')}
            onPress={() => router.push(ROUTES.chat(rideId, offer.driver.name))}
          />
          <View style={styles.flex}>
            {done ? (
              <Button label={t('ride.startRide')} icon="play" onPress={startRide} />
            ) : (
              <Button label={t('ride.cancelRide')} variant="secondary" onPress={confirmCancel} loading={cancel.isPending} />
            )}
          </View>
        </View>
      </RideStatusSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progress: { height: 4, borderRadius: radius.pill, overflow: 'hidden' },
  bar: { height: 4, borderRadius: radius.pill },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
