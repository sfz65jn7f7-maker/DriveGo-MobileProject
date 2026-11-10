import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { spacing } from '@/theme';
import { formatDateTime, formatPrice } from '@/utils/format';
import type { CarpoolTrip } from '@/types';

type Props = { trip: CarpoolTrip; onPress?: () => void };

export function TripCard({ trip, onPress }: Props) {
  return (
    <Card onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.info}>
          <AppText variant="subheading">
            {trip.from} → {trip.to}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            {formatDateTime(trip.departureAt)} · {trip.driver.name}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            {trip.seatsAvailable} ✓
          </AppText>
        </View>
        <AppText variant="heading" color="primary">
          {formatPrice(trip.pricePerSeat)}
        </AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1, gap: spacing.xs },
});
