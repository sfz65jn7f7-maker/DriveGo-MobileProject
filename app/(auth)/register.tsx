import { StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { Logo } from '@/components/brand/Logo';
import { useRegistrationStore } from '@/features/auth/registration.store';
import { registerSchema } from '@/features/auth/schemas';
import type { RegisterForm } from '@/features/auth/schemas';
import { ROUTES } from '@/constants/routes';
import { spacing } from '@/theme';

export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const setData = useRegistrationStore((s) => s.setData);

  const { control, handleSubmit } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', phone: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    setData(values);
    router.push(ROUTES.auth.otp);
  });

  const field = (name: keyof RegisterForm, label: string, extra: object = {}) => (
    <Controller
      control={control}
      name={name}
      render={({ field: f, fieldState }) => (
        <Input
          label={label}
          value={f.value}
          onChangeText={f.onChange}
          onBlur={f.onBlur}
          error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
          {...extra}
        />
      )}
    />
  );

  return (
    <Screen scroll keyboard>
      <ScreenHeader />
      <View style={styles.logo}>
        <Logo size={64} />
      </View>
      <AppText variant="title">{t('auth.registerTitle')}</AppText>
      <AppText color="textSecondary" style={styles.subtitle}>
        {t('auth.registerSubtitle')}
      </AppText>

      {field('name', t('auth.fullName'), { leftIcon: 'person-outline', autoCapitalize: 'words' })}
      {field('phone', t('auth.phone'), { leftIcon: 'call-outline', keyboardType: 'phone-pad', placeholder: t('auth.phonePlaceholder') })}
      {field('password', t('auth.password'), { leftIcon: 'lock-closed-outline', secureTextEntry: true })}

      <Button label={t('auth.createAccount')} onPress={onSubmit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  logo: { alignItems: 'flex-start', marginBottom: spacing.xl },
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.xl },
});
