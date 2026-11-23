import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme, radius, spacing } from '@/theme';

type ChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
};

/** Pastille sélectionnable (filtres, choix de date, règles…). */
export function Chip({ label, selected = false, onPress, icon }: ChipProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon ? <Ionicons name={icon} size={16} color={selected ? colors.onPrimary : colors.textSecondary} /> : null}
      <AppText variant="label" color={selected ? 'onPrimary' : 'text'} maxFontSizeMultiplier={1.3}>
        {label}
      </AppText>
    </Pressable>
  );
}

type Option<T extends string> = { value: T; label: string };

/** Rangée de pastilles à choix unique, défilable horizontalement. */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.noGrow} contentContainerStyle={styles.row}>
      {options.map((o) => (
        <Chip key={o.value} label={o.label} selected={o.value === value} onPress={() => onChange(o.value)} />
      ))}
    </ScrollView>
  );
}

/** Onglets segmentés (ex. « Courses / Covoiturage »). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.surface, borderColor: colors.border }]} accessibilityRole="tablist">
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            style={[styles.segment, selected && { backgroundColor: colors.surfaceElevated }]}
          >
            <AppText variant="label" color={selected ? 'primary' : 'textSecondary'} style={styles.segmentLabel}>
              {o.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  noGrow: { flexGrow: 0, flexShrink: 0 },
  row: { gap: spacing.sm, paddingVertical: spacing.xs, alignItems: 'center' },
  segmented: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segment: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  segmentLabel: { fontWeight: '600' },
});
