import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { RouteSummary } from '@/components/ride/RouteSummary';
import { spacing, useTheme } from '@/theme';
import { formatTime } from '@/utils/date';
import { formatDateTime, formatPrice } from '@/utils/format';
import type { CarpoolTrip } from '@/types';

type Props = { trip: CarpoolTrip; onPress?: () => void };

export function TripCard({ trip, onPress }: Props) {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const full = trip.seatsAvailable === 0;
  return (
    <Card onPress={onPress} accessibilityLabel={`${trip.from} → ${trip.to}, ${formatDateTime(trip.departureAt, i18n.language)}`}>
      <View style={styles.row}>
        <AppText variant="subheading">{formatTime(trip.departureAt, i18n.language)}</AppText>
        <AppText variant="caption" color="textSecondary" style={styles.flex}>
          {formatDateTime(trip.departureAt, i18n.language)}
        </AppText>
        <AppText variant="heading" color="primary">{formatPrice(trip.pricePerSeat)}</AppText>
      </View>
      <View style={styles.route}>
        <RouteSummary from={trip.from} to={trip.to} compact />
      </View>
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Avatar name={trip.driver.name} uri={trip.driver.avatarUrl} size={28} />
        <AppText variant="caption" style={styles.flex}>
          {trip.driver.name} · ★ {trip.driver.rating.toFixed(1)}
        </AppText>
        <Ionicons name="person-outline" size={14} color={full ? colors.danger : colors.textSecondary} />
        <AppText variant="caption" color={full ? 'danger' : 'textSecondary'}>
          {full ? t('carpool.full') : t('carpool.seatsLeft', { count: trip.seatsAvailable })}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  route: { marginTop: spacing.md },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
