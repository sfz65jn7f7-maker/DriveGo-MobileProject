import { Image, Pressable, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme, layout } from '@/theme';
import { getInitials } from '@/utils/initials';

type Props = {
  name: string;
  uri?: string;
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Cercle avec photo ou initiales. Zone tactile ≥ 44 px même si le cercle est plus petit. */
export function Avatar({ name, uri, size = 40, onPress, accessibilityLabel }: Props) {
  const { colors } = useTheme();
  const slop = Math.max(0, (layout.touchTarget - size) / 2);

  const circle = uri ? (
    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
  ) : (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primary },
      ]}
    >
      <AppText
        color="onPrimary"
        maxFontSizeMultiplier={1.2}
        style={{ fontSize: size * 0.4, fontWeight: '700', lineHeight: size * 0.5 }}
      >
        {getInitials(name)}
      </AppText>
    </View>
  );

  if (!onPress) return circle;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={slop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
    >
      {circle}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
});
