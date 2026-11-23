import { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { useAlertStore } from '@/features/notifications/alert.store';
import { layout, radius, shadows, spacing, useTheme } from '@/theme';

const ICONS = { ride: 'car-sport', request: 'flash', message: 'chatbubble-ellipses' } as const;
const DURATION_MS = 4500;

/** Bannière qui descend du haut de l'écran (style notification iOS), fermeture auto ou au toucher. */
export function InAppAlert() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const alert = useAlertStore((s) => s.current);
  const hide = useAlertStore((s) => s.hide);
  const [y] = useState(() => new Animated.Value(-200));

  useEffect(() => {
    if (!alert) return;
    Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 6 }).start();
    const id = setTimeout(() => {
      Animated.timing(y, { toValue: -200, duration: 250, useNativeDriver: true }).start(() => hide());
    }, DURATION_MS);
    return () => clearTimeout(id);
  }, [alert, y, hide]);

  if (!alert) return null;

  const tint = alert.kind === 'request' ? colors.accent : colors.primary;
  const onPress = () => {
    hide();
    if (alert.url) router.push(alert.url as never);
  };

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrapper, { top: insets.top + spacing.sm, transform: [{ translateY: y }] }]}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="alert"
        accessibilityLabel={`${alert.title}. ${alert.body}`}
        style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }, shadows.lg]}
      >
        <View style={[styles.icon, { backgroundColor: `${tint}22` }]}>
          <Ionicons name={ICONS[alert.kind]} size={22} color={tint} />
        </View>
        <View style={styles.texts}>
          <AppText variant="subheading" numberOfLines={1}>{alert.title}</AppText>
          <AppText color="textSecondary" numberOfLines={2}>{alert.body}</AppText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', start: layout.screenPadding / 2, end: layout.screenPadding / 2, zIndex: 1000, elevation: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1 },
});
