import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { useTheme, radius, spacing } from '@/theme';
import type { DriverSummary } from '@/types';

/** Chauffeur + véhicule + plaque (bien visible pour reconnaître la voiture). */
export function DriverCard({ driver, right }: { driver: DriverSummary; right?: React.ReactNode }) {
  const { colors } = useTheme();
  const { vehicle } = driver;
  return (
    <View style={styles.row}>
      <Avatar name={driver.name} uri={driver.avatarUrl} size={52} />
      <View style={styles.info}>
        <AppText variant="subheading" numberOfLines={1}>{driver.name}</AppText>
        <AppText variant="caption" color="textSecondary" numberOfLines={1}>
          ★ {driver.rating.toFixed(1)} · {vehicle.brand} {vehicle.model} · {vehicle.color}
        </AppText>
        {vehicle.plate ? (
          <View style={[styles.plate, { borderColor: colors.border, backgroundColor: colors.surface }]}>
            <AppText variant="label" style={styles.plateText}>{vehicle.plate}</AppText>
          </View>
        ) : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, gap: 2 },
  plate: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  plateText: { fontWeight: '700', letterSpacing: 1 },
});
