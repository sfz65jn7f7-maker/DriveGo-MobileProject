import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/ui/AppText';
import { useTheme, layout, radius, spacing, shadows } from '@/theme';

type Props = { title: string; subtitle?: string; children?: React.ReactNode };

/**
 * Panneau d'état de course affiché en bas de la carte.
 * Évolution possible : @gorhom/bottom-sheet avec snap points (25 % / 50 % / 90 %).
 */
export function RideStatusSheet({ title, subtitle, children }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.sheet,
        { backgroundColor: colors.surfaceElevated, paddingBottom: insets.bottom + spacing.lg },
        shadows.lg,
      ]}
    >
      <View style={[styles.handle, { backgroundColor: colors.border }]} />
      <AppText variant="subheading">{title}</AppText>
      {subtitle ? <AppText color="textSecondary">{subtitle}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: 0,
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing.sm,
    gap: spacing.md,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: spacing.xs },
});
