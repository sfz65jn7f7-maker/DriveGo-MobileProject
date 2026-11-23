import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { useTheme, spacing } from '@/theme';

type Props = { from: string; to: string; fromDetail?: string; toDetail?: string; compact?: boolean };

/** Départ → arrivée avec la petite ligne verticale entre les deux points. */
export function RouteSummary({ from, to, fromDetail, toDetail, compact = false }: Props) {
  const { colors } = useTheme();
  const variant = compact ? 'body' : 'subheading';
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <View style={[styles.dot, styles.square, { backgroundColor: colors.text }]} />
      </View>
      <View style={styles.texts}>
        <View>
          <AppText variant={variant} numberOfLines={1}>{from}</AppText>
          {fromDetail ? <AppText variant="caption" color="textSecondary" numberOfLines={1}>{fromDetail}</AppText> : null}
        </View>
        <View>
          <AppText variant={variant} numberOfLines={1}>{to}</AppText>
          {toDetail ? <AppText variant="caption" color="textSecondary" numberOfLines={1}>{toDetail}</AppText> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  rail: { alignItems: 'center', paddingVertical: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  square: { borderRadius: 2 },
  line: { width: 2, flex: 1, marginVertical: 4 },
  texts: { flex: 1, gap: spacing.md },
});
