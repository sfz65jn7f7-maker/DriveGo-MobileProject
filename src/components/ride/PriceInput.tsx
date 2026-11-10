import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { spacing } from '@/theme';
import { formatPrice } from '@/utils/format';

type Props = { value: number; onChange: (value: number) => void; step?: number; min?: number };

/** Saisie du prix proposé (style inDrive) : boutons − / +. */
export function PriceInput({ value, onChange, step = 5, min = 10 }: Props) {
  return (
    <View style={styles.row}>
      <IconButton
        icon="remove-circle-outline"
        size={36}
        color="primary"
        accessibilityLabel="−"
        onPress={() => onChange(Math.max(min, value - step))}
      />
      <AppText variant="title" style={styles.value}>
        {formatPrice(value)}
      </AppText>
      <IconButton
        icon="add-circle-outline"
        size={36}
        color="primary"
        accessibilityLabel="+"
        onPress={() => onChange(value + step)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  value: { minWidth: 120, textAlign: 'center' },
});
