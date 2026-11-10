import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Switch, View } from 'react-native';
import type MapView from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { HeaderAvatar } from '@/components/common/HeaderAvatar';
import { AppMap } from '@/components/map/AppMap';
import { useLocation } from '@/features/location/useLocation';
import { useWatchLocation } from '@/features/location/useWatchLocation';
import { layout, radius, shadows, spacing, useTheme } from '@/theme';

export default function DriverDashboard() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [online, setOnline] = useState(false);
  const { status, coords: firstFix, request, refresh, openSettings } = useLocation();
  // Suivi continu uniquement quand le chauffeur est en ligne (économie de batterie)
  const live = useWatchLocation(online);
  const position = live ?? firstFix;
  const recenter = async () => {
    let target = position;
    if (Platform.OS === 'web') {
      if (status === 'blocked' || status === 'servicesDisabled') {
        void openSettings();
        return;
      }
      if (status === 'granted') {
        target = (await refresh()) ?? position;
      } else if ((await request()) === 'granted') {
        target = (await refresh()) ?? position;
      }
    }
    if (target) {
      mapRef.current?.animateToRegion(
        { ...target, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        400,
      );
    } else if (Platform.OS !== 'web' && (status === 'blocked' || status === 'servicesDisabled')) {
      void openSettings();
    } else if (Platform.OS !== 'web' && status === 'granted') {
      void refresh();
    } else if (Platform.OS !== 'web') {
      void request();
    }
  };
  // Recentre la carte une seule fois, dès que la première position est connue
  const centered = useRef(false);
  useEffect(() => {
    if (!position || centered.current) return;
    centered.current = true;
    mapRef.current?.animateToRegion(
      { ...position, latitudeDelta: 0.01, longitudeDelta: 0.01 },
      400,
    );
  }, [position]);

  return (
    <View style={styles.flex}>
      <AppMap ref={mapRef} />

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
        <Card elevated style={styles.card}>
          <View style={styles.row}>
            <View style={styles.text}>
              <Badge label={online ? t('driver.online') : t('driver.offline')} tone={online ? 'success' : 'neutral'} />
              <AppText color="textSecondary" style={styles.hint}>
                {online ? t('driver.onlineHint') : t('driver.offlineHint')}
              </AppText>
              {online && position ? (
                <AppText variant="caption" color="textSecondary">
                  {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
                </AppText>
              ) : null}
            </View>
            <Switch
              value={online}
              onValueChange={setOnline}
              accessibilityLabel={online ? t('driver.goOffline') : t('driver.goOnline')}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={colors.surfaceElevated}
            />
          </View>
        </Card>
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
  card: { borderRadius: radius.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: spacing.xs },
  hint: { marginTop: spacing.xs },
});