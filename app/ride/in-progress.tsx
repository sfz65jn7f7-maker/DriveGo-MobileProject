import { useCallback, useEffect } from 'react';
import { Linking, Share, StyleSheet, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { RideMap } from '@/components/ride/RideMap';
import { RideStatusSheet } from '@/components/ride/RideStatusSheet';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { notify } from '@/features/notifications';
import { useRouteSimulation } from '@/features/ride';
import { useSettingsStore } from '@/features/settings/settings.store';
import { useBlockBack } from '@/hooks/useBlockBack';
import { rideService } from '@/services/ride.service';
import { useRideStore } from '@/store/ride.store';
import { ROUTES } from '@/constants/routes';
import { radius, spacing, useTheme } from '@/theme';
import { ask, notify as showMessage } from '@/utils/dialog';
import { estimateMinutes, roadDistanceKm } from '@/utils/geo';

/** Durée simulée du trajet (accélérée pour la démo). */
const RIDE_MS = 30_000;
/** Numéro de la police au Maroc. */
const POLICE = '19';

export default function InProgressScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const rideId = useRideStore((s) => s.activeRideId);
  const pickup = useRideStore((s) => s.pickup);
  const destination = useRideStore((s) => s.destination);
  const offer = useRideStore((s) => s.acceptedOffer);
  const contacts = useSettingsStore((s) => s.emergencyContacts);

  const { position, progress, done } = useRouteSimulation(pickup?.coords, destination?.coords, RIDE_MS);

  useEffect(() => {
    if (!done || !rideId) return;
    void rideService.setStatus(rideId, 'completed').then(() => router.replace(ROUTES.ride.completed));
  }, [done, rideId, router]);

  const almost = progress >= 0.85;
  const destinationTitle = destination?.title ?? '';
  useEffect(() => {
    if (!almost) return;
    void notify({ kind: 'ride', title: t('alerts.almostTitle'), body: t('alerts.almostBody', { place: destinationTitle }), url: ROUTES.ride.inProgress });
  }, [almost, destinationTitle, t]);

  // Pas d'annulation possible une fois à bord : le retour Android affiche juste un message
  const onBack = useCallback(() => showMessage(t('ride.inProgressBack')), [t]);
  useBlockBack(onBack);

  if (!rideId || !pickup || !destination) return <Redirect href={ROUTES.passenger.home} />;

  const totalMin = estimateMinutes(roadDistanceKm(pickup.coords, destination.coords));
  const remaining = Math.max(1, Math.ceil(totalMin * (1 - progress)));

  const shareTrip = () =>
    void Share.share({
      message: t('ride.shareMessage', {
        driver: offer?.driver.name ?? '',
        plate: offer?.driver.vehicle.plate ?? '',
        destination: destination.title,
        minutes: remaining,
      }),
    });

  const sos = async () => {
    const contact = contacts[0];
    const ok = await ask(
      t('ride.sosTitle'),
      contact ? t('ride.sosContact', { name: contact.name }) : t('ride.sosPolice'),
      t('ride.sosCall'),
      t('common.cancel'),
    );
    if (ok) void Linking.openURL(`tel:${contact?.phone ?? POLICE}`);
  };

  return (
    <View style={styles.flex}>
      <RideMap pickup={pickup.coords} destination={destination.coords} driver={position} showRoute />

      <View style={styles.sosBox}>
        <IconButton icon="shield-checkmark" variant="floating" color="danger" accessibilityLabel={t('ride.sosTitle')} onPress={sos} />
      </View>

      <RideStatusSheet title={t('ride.onTheWay', { place: destination.title })} subtitle={t('ride.arrivalIn', { minutes: remaining })}>
        <View style={[styles.progress, { backgroundColor: colors.border }]}>
          <View style={[styles.bar, { backgroundColor: colors.primary, width: `${Math.round(progress * 100)}%` }]} />
        </View>
        <RouteSummary from={pickup.title} to={destination.title} compact />
        {offer ? (
          <AppText variant="caption" color="textSecondary">
            {offer.driver.name} · {offer.driver.vehicle.brand} {offer.driver.vehicle.model} · {offer.driver.vehicle.plate}
          </AppText>
        ) : null}
        <View style={styles.actions}>
          <View style={styles.flex}>
            <Button label={t('ride.shareTrip')} icon="share-social-outline" variant="secondary" onPress={shareTrip} />
          </View>
          <IconButton
            icon="chatbubble-ellipses-outline"
            variant="floating"
            color="primary"
            accessibilityLabel={t('ride.message')}
            onPress={() => router.push(ROUTES.chat(rideId, offer?.driver.name))}
          />
        </View>
      </RideStatusSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  sosBox: { position: 'absolute', top: 60, end: 20 },
  progress: { height: 4, borderRadius: radius.pill, overflow: 'hidden' },
  bar: { height: 4, borderRadius: radius.pill },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
