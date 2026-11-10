import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { spacing } from '@/theme';
import { formatDistance, formatDuration, formatPrice } from '@/utils/format';
import type { DriverOffer } from '@/types';

type Props = { offer: DriverOffer; acceptLabel: string; onAccept: () => void };

export function OfferCard({ offer, acceptLabel, onAccept }: Props) {
  const { driver } = offer;
  return (
    <Card>
      <View style={styles.header}>
        <Avatar name={driver.name} uri={driver.avatarUrl} size={48} />
        <View style={styles.info}>
          <AppText variant="subheading">{driver.name}</AppText>
          <AppText variant="caption" color="textSecondary">
            ★ {driver.rating.toFixed(1)} · {driver.vehicle.brand} {driver.vehicle.model} · {driver.vehicle.color}
          </AppText>
          <AppText variant="caption" color="textSecondary">
            {formatDuration(offer.etaMinutes)} · {formatDistance(offer.distanceKm)}
          </AppText>
        </View>
        <AppText variant="heading" color="primary">
          {formatPrice(offer.price)}
        </AppText>
      </View>
      <View style={styles.action}>
        <Button label={acceptLabel} onPress={onAccept} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1 },
  action: { marginTop: spacing.md },
});
