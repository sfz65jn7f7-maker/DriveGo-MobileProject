import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { useTheme, radius, spacing, shadows } from '@/theme';

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  selected?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, onPress, elevated = false, selected = false, accessibilityLabel, style }: Props) {
  const { colors } = useTheme();
  const base = [
    styles.card,
    {
      backgroundColor: elevated ? colors.surfaceElevated : colors.surface,
      borderColor: selected ? colors.primary : colors.border,
      borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
    },
    elevated && shadows.md,
    style,
  ];

  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [base, { opacity: pressed ? 0.85 : 1 }]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, borderRadius: radius.lg },
});
