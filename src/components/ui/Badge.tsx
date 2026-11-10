import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme, radius, spacing } from '@/theme';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const { colors } = useTheme();
  const color = tone === 'neutral' ? colors.textSecondary : colors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: `${color}22` }]}>
      <AppText variant="caption" style={{ color, fontWeight: '600' }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
});
