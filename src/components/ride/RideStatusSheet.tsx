import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useTheme, radius, spacing, shadows } from '@/theme';

type Props = { title: string; subtitle?: string; children?: React.ReactNode };

/**
 * Panneau d'état de course affiché en bas de la carte.
 * À remplacer plus tard par un @gorhom/bottom-sheet avec snap points en pourcentage.
 */
export function RideStatusSheet({ title, subtitle, children }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.sheet, { backgroundColor: colors.surfaceElevated }, shadows.lg]}>
      <AppText variant="subheading">{title}</AppText>
      {subtitle ? <AppText color="textSecondary">{subtitle}</AppText> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    padding: spacing.xl,
    gap: spacing.sm,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
});
