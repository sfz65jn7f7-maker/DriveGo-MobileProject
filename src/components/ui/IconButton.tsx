import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, layout, shadows } from '@/theme';
import type { Colors } from '@/theme';

type Props = {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  accessibilityLabel: string;
  /** "floating" : bouton rond sur fond surface avec ombre (par-dessus la carte) */
  variant?: 'plain' | 'floating';
  size?: number;
  color?: keyof Colors;
  style?: StyleProp<ViewStyle>;
};

/** Zone tactile de 44×44 minimum, même si l'icône est plus petite. */
export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'plain',
  size = 24,
  color = 'text',
  style,
}: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [styles.touch, { opacity: pressed ? 0.7 : 1 }, style]}
    >
      <View
        style={[
          variant === 'floating' && [
            styles.floating,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadows.sm,
          ],
        ]}
      >
        <Ionicons name={icon} size={size} color={colors[color]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  touch: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floating: {
    width: layout.touchTarget,
    height: layout.touchTarget,
    borderRadius: layout.touchTarget / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
