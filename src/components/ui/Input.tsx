import { forwardRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { I18nManager, Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { useTheme, radius, spacing, fontSize } from '@/theme';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ComponentProps<typeof Ionicons>['name'];
};

export const Input = forwardRef<ComponentRef<typeof TextInput>, Props>(
  function Input(
    { label, error, leftIcon, secureTextEntry, style, onFocus, onBlur, ...rest }, 
    ref,
  ) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText variant="label" color="textSecondary" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={[styles.field, { backgroundColor: colors.surface, borderColor }]}>
        {leftIcon ? <Ionicons name={leftIcon} size={20} color={colors.textSecondary} /> : null}
        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={hidden}
          maxFontSizeMultiplier={1.5}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            { color: colors.text, textAlign: I18nManager.isRTL ? 'right' : 'left' },
            style,
          ]}
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Afficher le mot de passe' : 'Masquer le mot de passe'}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color="danger" style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { alignSelf: 'stretch', marginBottom: spacing.lg },
  label: { marginBottom: spacing.xs },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: fontSize.md, paddingVertical: spacing.md },
  error: { marginTop: spacing.xs },
});
