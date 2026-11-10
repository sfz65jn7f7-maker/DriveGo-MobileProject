import { Text } from 'react-native';
import type { TextProps } from 'react-native';
import { useTheme, typography } from '@/theme';
import type { Colors, TypographyVariant } from '@/theme';

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: keyof Colors;
};

export function AppText({
  variant = 'body',
  color = 'text',
  style,
  maxFontSizeMultiplier = 1.5,
  ...rest
}: Props) {
  const { colors } = useTheme();
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[typography[variant], { color: colors[color] }, style]}
      {...rest}
    />
  );
}
