import { I18nManager, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '@/components/ui/AppText';
import { useTheme, layout, spacing } from '@/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  icon?: IconName;
  label: string;
  value?: string;
  onPress?: () => void;
  /** Affiche une coche (listes à choix unique) */
  selected?: boolean;
  destructive?: boolean;
  /** Élément personnalisé à droite (ex. interrupteur) */
  right?: React.ReactNode;
};

export function SettingsRow({ icon, label, value, onPress, selected, destructive, right }: Props) {
  const { colors } = useTheme();
  const tint = destructive ? colors.danger : colors.text;
  const chevron = I18nManager.isRTL ? 'chevron-back' : 'chevron-forward';

  const content = (
    <View style={styles.row}>
      {icon ? <Ionicons name={icon} size={22} color={destructive ? colors.danger : colors.primary} /> : null}
      <AppText style={[styles.label, { color: tint }]} numberOfLines={2}>
        {label}
      </AppText>
      {value ? (
        <AppText variant="label" color="textSecondary" numberOfLines={1} style={styles.value}>
          {value}
        </AppText>
      ) : null}
      {selected ? <Ionicons name="checkmark" size={22} color={colors.primary} /> : null}
      {right}
      {onPress && !destructive && !selected && !right ? (
        <Ionicons name={chevron} size={18} color={colors.textSecondary} />
      ) : null}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: layout.touchTarget + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  label: { flex: 1 },
  value: { maxWidth: '40%' },
});
