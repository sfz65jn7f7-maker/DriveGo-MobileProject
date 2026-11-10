import { useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
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
import { AppMap } from '@/components/map/AppMap';
import { useLocation } from '@/features/location/useLocation';
import { ROUTES } from '@/constants/routes';
import { layout, radius, shadows, spacing, useTheme } from '@/theme';

export default function PassengerHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const { status, coords, request, refresh, openSettings } = useLocation();

  const recenter = async () => {
    let target = coords;
    if (Platform.OS === 'web') {
      if (status === 'blocked' || status === 'servicesDisabled') {
        void openSettings();
        return;
      }
      if (status === 'granted') {
        target = (await refresh()) ?? coords;
      } else if ((await request()) === 'granted') {
        target = (await refresh()) ?? coords;
      }
    }
    if (target) {
      mapRef.current?.animateToRegion({ ...target, latitudeDelta: 0.01, longitudeDelta: 0.01 }, 400);
    }
  };

  // Recentre automatiquement dès que la première position est connue
  useEffect(() => {
    recenter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude]);

  const locationOff = status === 'denied' || status === 'blocked' || status === 'servicesDisabled' || status === 'undetermined';

  return (
    <View style={styles.flex}>
      <AppMap ref={mapRef} />

      {/* Avatar flottant en haut à gauche (même position partout dans l'appli) */}
      <View style={[styles.avatar, { top: insets.top + spacing.md }]}>
        <View style={[styles.avatarRing, { backgroundColor: colors.surface }, shadows.sm]}>
          <HeaderAvatar size={40} />
        </View>
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

        {locationOff ? (
          <Card elevated style={styles.permission}>
            <AppText variant="subheading">{t('home.permissionTitle')}</AppText>
            <AppText color="textSecondary">{t('home.permissionMessage')}</AppText>
            <Button
              label={status === 'blocked' || status === 'servicesDisabled' ? t('home.openSettings') : t('home.enableLocation')}
              onPress={status === 'blocked' || status === 'servicesDisabled' ? openSettings : request}
            />
          </Card>
        ) : null}

        <Pressable
          onPress={() => router.push(ROUTES.ride.searchDestination)}
          accessibilityRole="button"
          accessibilityLabel={t('home.whereTo')}
          style={[styles.whereTo, { backgroundColor: colors.surfaceElevated }, shadows.lg]}
        >
          <Ionicons name="search" size={22} color={colors.primary} />
          <AppText variant="subheading">{t('home.whereTo')}</AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  avatar: { position: 'absolute', start: layout.screenPadding },
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
  whereTo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 60,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
  },
});
