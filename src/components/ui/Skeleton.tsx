import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { DimensionValue } from 'react-native';
import { useTheme, radius, spacing } from '@/theme';

/** Bloc gris qui « respire » pendant le chargement. */
export function Skeleton({ width = '100%', height = 16, rounded = radius.sm }: { width?: DimensionValue; height?: number; rounded?: number }) {
  const { colors } = useTheme();
  const [opacity] = useState(() => new Animated.Value(0.5));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={{ width, height, borderRadius: rounded, backgroundColor: colors.border, opacity }} />;
}

/** Liste de cartes fantômes : remplace le spinner sur les listes. */
export function ListSkeleton({ count = 3 }: { count?: number }) {
  const { colors } = useTheme();
  return (
    <View style={styles.list} accessibilityRole="progressbar">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Skeleton width={44} height={44} rounded={22} />
          <View style={styles.lines}>
            <Skeleton width="70%" />
            <Skeleton width="45%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, paddingTop: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  lines: { flex: 1, gap: spacing.sm },
});
