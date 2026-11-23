import { useCallback, useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { RideMap } from '@/components/ride/RideMap';
import { RideStatusSheet } from '@/components/ride/RideStatusSheet';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { useDriverStore } from '@/features/driver';
import { useRouteSimulation } from '@/features/ride';
import { useSettingsStore } from '@/features/settings/settings.store';
import { useBlockBack } from '@/hooks/useBlockBack';
import { ROUTES } from '@/constants/routes';
import { radius, spacing, useTheme } from '@/theme';
import { ask } from '@/utils/dialog';
import { formatPrice } from '@/utils/format';
import { offset } from '@/utils/geo';

type Phase = 'toPickup' | 'atPickup' | 'onTrip' | 'done';

const TO_PICKUP_MS = 15_000;
const TRIP_MS = 25_000;

/** Course côté chauffeur : aller chercher le passager → course → encaissement. */
export default function DriverRideScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const request = useDriverStore((s) => s.activeRequest);
  const setActiveRequest = useDriverStore((s) => s.setActiveRequest);
  const navApp = useSettingsStore((s) => s.driverPrefs.navigationApp);
  // Seule action manuelle : « passager à bord ». Les autres étapes découlent de la simulation.
  const [boarded, setBoarded] = useState(false);

  const start = useMemo(() => (request ? offset(request.pickup.coords, -0.01, 0.008) : null), [request]);
  const approach = useRouteSimulation(start, request?.pickup.coords, TO_PICKUP_MS, !boarded);
  const trip = useRouteSimulation(request?.pickup.coords, request?.destination.coords, TRIP_MS, boarded);

  const phase: Phase = !boarded ? (approach.done ? 'atPickup' : 'toPickup') : trip.done ? 'done' : 'onTrip';

  const cancel = useCallback(async () => {
    if (phase === 'onTrip') return;
    const ok = await ask(t('ride.cancelTitle'), t('driverRide.cancelMessage'), t('ride.cancelRide'), t('common.no'));
    if (!ok) return;
    setActiveRequest(null);
    router.dismissTo(ROUTES.driver.dashboard);
  }, [phase, t, setActiveRequest, router]);
  useBlockBack(cancel, phase !== 'done');

  if (!request) return <Redirect href={ROUTES.driver.dashboard} />;

  const target = phase === 'toPickup' || phase === 'atPickup' ? request.pickup : request.destination;
  const openNavigation = () => {
    const { latitude, longitude } = target.coords;
    const url =
      navApp === 'waze'
        ? `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    void Linking.openURL(url);
  };

  const finish = () => {
    setActiveRequest(null);
    router.dismissTo(ROUTES.driver.dashboard);
  };

  const driverPos = phase === 'toPickup' ? approach.position : phase === 'onTrip' ? trip.position : phase === 'atPickup' ? request.pickup.coords : request.destination.coords;
  const progress = phase === 'toPickup' ? approach.progress : phase === 'onTrip' ? trip.progress : 1;

  const titles: Record<Phase, string> = {
    toPickup: t('driverRide.toPickup', { name: request.passengerName }),
    atPickup: t('driverRide.atPickup'),
    onTrip: t('ride.onTheWay', { place: request.destination.title }),
    done: t('driverRide.done'),
  };

  return (
    <View style={styles.flex}>
      <RideMap pickup={request.pickup.coords} destination={request.destination.coords} driver={driverPos} showRoute={phase !== 'toPickup'} />

      <RideStatusSheet title={titles[phase]} subtitle={phase === 'done' ? undefined : target.title}>
        {phase !== 'done' ? (
          <View style={[styles.progress, { backgroundColor: colors.border }]}>
            <View style={[styles.bar, { backgroundColor: colors.primary, width: `${Math.round(progress * 100)}%` }]} />
          </View>
        ) : null}

        <View style={styles.passenger}>
          <Avatar name={request.passengerName} size={44} />
          <View style={styles.flex}>
            <AppText variant="subheading">{request.passengerName}</AppText>
            <AppText variant="caption" color="textSecondary">{t('roles.passenger')}</AppText>
          </View>
          <AppText variant="heading" color="primary">{formatPrice(request.proposedPrice)}</AppText>
        </View>

        {phase === 'done' ? (
          <>
            <RouteSummary from={request.pickup.title} to={request.destination.title} compact />
            <AppText color="textSecondary">{t('driverRide.collectCash', { price: formatPrice(request.proposedPrice) })}</AppText>
            <Button label={t('driverRide.finish')} icon="checkmark-circle-outline" onPress={finish} />
          </>
        ) : (
          <View style={styles.actions}>
            <IconButton icon="call-outline" variant="floating" color="primary" accessibilityLabel={t('ride.call')} onPress={() => void Linking.openURL('tel:0600000000')} />
            <IconButton
              icon="chatbubble-ellipses-outline"
              variant="floating"
              color="primary"
              accessibilityLabel={t('ride.message')}
              onPress={() => router.push(ROUTES.chat(request.id, request.passengerName))}
            />
            <IconButton icon="navigate-outline" variant="floating" color="primary" accessibilityLabel={t('driverRide.navigate')} onPress={openNavigation} />
            <View style={styles.flex}>
              {phase === 'atPickup' ? (
                <Button label={t('driverRide.passengerOnBoard')} icon="play" onPress={() => setBoarded(true)} />
              ) : phase === 'toPickup' ? (
                <Button label={t('ride.cancelRide')} variant="secondary" onPress={cancel} />
              ) : null}
            </View>
          </View>
        )}
      </RideStatusSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  progress: { height: 4, borderRadius: radius.pill, overflow: 'hidden' },
  bar: { height: 4, borderRadius: radius.pill },
  passenger: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
