import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme, radius, spacing } from '@/theme';
import type { Colors } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  fullWidth?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  accessibilityLabel,
  style,
}: Props) {
  const { colors } = useTheme();
  const palette: Record<Variant, { bg: string; fg: keyof Colors; border: string }> = {
    primary: { bg: colors.primary, fg: 'onPrimary', border: colors.primary },
    secondary: { bg: colors.surface, fg: 'text', border: colors.border },
    ghost: { bg: 'transparent', fg: 'primary', border: 'transparent' },
    danger: { bg: colors.danger, fg: 'onDanger', border: colors.danger },
  };
  const p = palette[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: p.bg,
          borderColor: p.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        fullWidth && styles.full,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors[p.fg]} />
      ) : (
        <View style={styles.content}>
          {icon ? <Ionicons name={icon} size={20} color={colors[p.fg]} /> : null}
          <AppText
            variant="subheading"
            color={p.fg}
            maxFontSizeMultiplier={1.3}
            style={styles.label}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: { alignSelf: 'stretch' },
  content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontSize: 16 },
});
