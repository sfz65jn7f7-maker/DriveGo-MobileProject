import { useRef } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import type MapView from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { HeaderAvatar } from '@/components/common/HeaderAvatar';
import { NotificationBell } from '@/components/common/NotificationBell';
import { AppMap } from '@/components/map/AppMap';
import { useDriverStore, useEarnings, useIncomingRequests } from '@/features/driver';
import { useLocation } from '@/features/location/useLocation';
import { useRecenterMap } from '@/features/location/useRecenterMap';
import { useWatchLocation } from '@/features/location/useWatchLocation';
import { ROUTES } from '@/constants/routes';
import { layout, radius, shadows, spacing, useTheme } from '@/theme';
import { formatPrice } from '@/utils/format';

export default function DriverDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  // État « en ligne » mémorisé (store persistant) : il survit au redémarrage de l'app
  const online = useDriverStore((s) => s.online);
  const setOnline = useDriverStore((s) => s.setOnline);
  const activeRequest = useDriverStore((s) => s.activeRequest);
  const location = useLocation();
  // Suivi continu uniquement quand le chauffeur est en ligne (économie de batterie)
  const live = useWatchLocation(online);
  const position = live ?? location.coords;
  const recenter = useRecenterMap(mapRef, position, location);
  const { data: requests } = useIncomingRequests();
  const { data: earnings } = useEarnings();

  return (
    <View style={styles.flex}>
      <AppMap ref={mapRef} />

      <View style={[styles.top, { top: insets.top + spacing.md }]}>
        <View style={[styles.avatarRing, { backgroundColor: colors.surface }, shadows.sm]}>
          <HeaderAvatar size={40} />
        </View>
        <NotificationBell />
      </View>

      <View style={styles.bottom}>
        <View style={styles.recenter}>
          <IconButton icon="locate" variant="floating" accessibilityLabel={t('home.recenter')} onPress={recenter} />
        </View>

        {activeRequest ? (
          <Button label={t('driver.resumeRide')} icon="navigate" onPress={() => router.push(ROUTES.driver.ride)} />
        ) : null}

        <Card elevated style={styles.card}>
          <View style={styles.row}>
            <View style={styles.text}>
              <Badge label={online ? t('driver.online') : t('driver.offline')} tone={online ? 'success' : 'neutral'} />
              <AppText color="textSecondary" style={styles.hint}>
                {online ? t('driver.onlineHint') : t('driver.offlineHint')}
              </AppText>
            </View>
            <Switch
              value={online}
              onValueChange={setOnline}
              accessibilityLabel={online ? t('driver.goOffline') : t('driver.goOnline')}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={colors.surfaceElevated}
            />
          </View>

          <View style={[styles.stats, { borderTopColor: colors.border }]}>
            <View style={styles.stat}>
              <AppText variant="subheading" color="primary">{formatPrice(earnings?.today ?? 0)}</AppText>
              <AppText variant="caption" color="textSecondary">{t('earnings.today')}</AppText>
            </View>
            <View style={styles.stat}>
              <AppText variant="subheading">{online ? (requests?.length ?? 0) : '—'}</AppText>
              <AppText variant="caption" color="textSecondary">{t('tabs.requests')}</AppText>
            </View>
          </View>

          {online && requests?.length ? (
            <Button label={t('driver.seeRequests', { count: requests.length })} onPress={() => router.push(ROUTES.driver.requests)} />
          ) : null}
          <Button
            label={t('carpoolTab.publish')}
            icon="add-circle-outline"
            variant="secondary"
            onPress={() => router.push(ROUTES.carpool.publish)}
          />
        </Card>
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
  card: { borderRadius: radius.xl, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: spacing.xs },
  hint: { marginTop: spacing.xs },
  stats: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.md },
  stat: { flex: 1, alignItems: 'center' },
});
