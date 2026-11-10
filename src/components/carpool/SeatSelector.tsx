import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { spacing } from '@/theme';

type Props = { value: number; max?: number; onChange: (value: number) => void };

export function SeatSelector({ value, max = 4, onChange }: Props) {
  return (
    <View style={styles.row}>
      <IconButton icon="remove-circle-outline" size={32} color="primary" accessibilityLabel="−" onPress={() => onChange(Math.max(1, value - 1))} />
      <AppText variant="heading">{value}</AppText>
      <IconButton icon="add-circle-outline" size={32} color="primary" accessibilityLabel="+" onPress={() => onChange(Math.min(max, value + 1))} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
});
