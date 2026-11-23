import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing } from '@/theme';

type Props = { value: number; onChange?: (value: number) => void; size?: number };

/** Note sur 5 étoiles ; interactive si `onChange` est fourni. */
export function RatingStars({ value, onChange, size = 36 }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row} accessibilityRole={onChange ? 'adjustable' : 'text'} accessibilityValue={{ now: value, min: 0, max: 5 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const icon = n <= value ? 'star' : 'star-outline';
        const star = <Ionicons name={icon} size={size} color={n <= value ? colors.accent : colors.border} />;
        if (!onChange) return <View key={n}>{star}</View>;
        return (
          <Pressable key={n} onPress={() => onChange(n)} hitSlop={6} accessibilityRole="button" accessibilityLabel={`${n}/5`}>
            {star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center' },
});
