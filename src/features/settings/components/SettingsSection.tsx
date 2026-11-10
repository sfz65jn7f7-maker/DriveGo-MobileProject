import { Children } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useTheme, radius, spacing } from '@/theme';

type Props = { title?: string; children: React.ReactNode };

/** Petit titre gris + groupe de lignes séparées par un filet. */
export function SettingsSection({ title, children }: Props) {
  const { colors } = useTheme();
  const items = Children.toArray(children);
  return (
    <View style={styles.section}>
      {title ? (
        <AppText variant="label" color="textSecondary" style={styles.title}>
          {title}
        </AppText>
      ) : null}
      <View style={[styles.group, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {items.map((child, index) => (
          <View key={index}>
            {index > 0 ? <View style={[styles.divider, { backgroundColor: colors.border }]} /> : null}
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.xl },
  title: { marginBottom: spacing.sm, marginHorizontal: spacing.xs },
  group: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  divider: { height: StyleSheet.hairlineWidth, marginStart: spacing.lg },
});
