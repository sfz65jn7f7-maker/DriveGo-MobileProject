import { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { HeaderAvatar } from '@/components/common/HeaderAvatar';
import { NotificationBell } from '@/components/common/NotificationBell';
import { AppMap } from '@/components/map/AppMap';
import { useLocation } from '@/features/location/useLocation';
import { useRecenterMap } from '@/features/location/useRecenterMap';
import { useRideStore } from '@/store/ride.store';
import { usePlacesStore } from '@/store/places.store';
import type { Place } from '@/types';
import { ROUTES } from '@/constants/routes';
import { layout, radius, shadows, spacing, useTheme } from '@/theme';

export default function PassengerHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const location = useLocation();
  const { status, coords, request, openSettings } = location;
  const recenter = useRecenterMap(mapRef, coords, location);

  const activeRideId = useRideStore((s) => s.activeRideId);
  const acceptedOffer = useRideStore((s) => s.acceptedOffer);
  const setDestination = useRideStore((s) => s.setDestination);
  // Raccourcis = 3 dernières destinations réellement choisies (où que soit l'utilisateur)
  const shortcuts = usePlacesStore((s) => s.recent).slice(0, 3);

  const locationOff =
    status === 'denied' ||
    status === 'blocked' ||
    status === 'servicesDisabled' ||
    status === 'undetermined';
  const blocked = status === 'blocked' || status === 'servicesDisabled';

  const goTo = (place: Place) => {
    setDestination(place);
    router.push(ROUTES.ride.setPrice);
  };

  return (
    <View style={styles.flex}>
      <AppMap ref={mapRef} />

      {/* Avatar flottant en haut à gauche, cloche à droite (même position partout dans l'appli) */}
      <View style={[styles.top, { top: insets.top + spacing.md }]}>
        <View style={[styles.avatarRing, { backgroundColor: colors.surface }, shadows.sm]}>
          <HeaderAvatar size={40} />
        </View>
        <NotificationBell />
      </View>

      <View style={styles.bottom}>
        <View style={styles.recenter}>
          <IconButton
            icon="locate"
            variant="floating"
            accessibilityLabel={t('home.recenter')}
            onPress={recenter}
          />
        </View>

        {activeRideId ? (
          <Card
            elevated
            onPress={() => router.push(acceptedOffer ? ROUTES.ride.tracking : ROUTES.ride.offers)}
            style={styles.resume}
          >
            <Ionicons name="car-sport" size={24} color={colors.primary} />
            <View style={styles.flex}>
              <AppText variant="subheading">{t('home.activeRide')}</AppText>
              <AppText variant="caption" color="textSecondary">
                {t('home.activeRideHint')}
              </AppText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </Card>
        ) : null}

        {locationOff ? (
          <Card elevated style={styles.permission}>
            <AppText variant="subheading">{t('home.permissionTitle')}</AppText>
            <AppText color="textSecondary">{t('home.permissionMessage')}</AppText>
            <Button
              label={blocked ? t('home.openSettings') : t('home.enableLocation')}
              onPress={blocked ? openSettings : request}
            />
          </Card>
        ) : null}

        <View style={[styles.panel, { backgroundColor: colors.surfaceElevated }, shadows.lg]}>
          <Pressable
            onPress={() => router.push(ROUTES.ride.searchDestination)}
            accessibilityRole="button"
            accessibilityLabel={t('home.whereTo')}
            style={[styles.whereTo, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="search" size={22} color={colors.primary} />
            <AppText variant="subheading">{t('home.whereTo')}</AppText>
          </Pressable>
          {shortcuts.length ? (
            <View style={styles.shortcuts}>
              {shortcuts.map((place) => (
                <Pressable
                  key={place.id}
                  onPress={() => goTo(place)}
                  accessibilityRole="button"
                  accessibilityLabel={place.title}
                  style={({ pressed }) => [
                    styles.shortcut,
                    { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Ionicons name="time-outline" size={18} color={colors.primary} />
                  <AppText variant="caption" numberOfLines={1} style={styles.flex}>
                    {place.title}
                  </AppText>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  top: {
    position: 'absolute',
    start: layout.screenPadding,
    end: layout.screenPadding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarRing: { borderRadius: radius.pill, padding: 2 },
  bottom: {
    position: 'absolute',
    start: layout.screenPadding,
    end: layout.screenPadding,
    bottom: spacing.lg,
    gap: spacing.md,
  },
  recenter: { alignSelf: 'flex-end' },
  permission: { gap: spacing.sm },
  resume: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  panel: { padding: spacing.md, borderRadius: radius.xl, gap: spacing.md },
  whereTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
  },
  shortcuts: { flexDirection: 'row', gap: spacing.sm },
  shortcut: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 40,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
});
