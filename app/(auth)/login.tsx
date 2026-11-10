import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/common/Screen';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Logo } from '@/components/brand/Logo';
import { useAuthStore } from '@/features/auth/auth.store';
import { loginSchema } from '@/features/auth/schemas';
import type { LoginForm } from '@/features/auth/schemas';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { layout, spacing } from '@/theme';

export default function Login() {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' },
  });

  const open = async (promise: Promise<{ user: Parameters<typeof login>[0]; token: string }>) => {
    setLoading(true);
    setError(null);
    try {
      const session = await promise;
      await login(session.user, session.token);
      router.replace(ROUTES.index);
    } catch {
      setError(t('auth.errors.generic'));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = handleSubmit((values) => open(authService.login(values.phone, values.password)));

  return (
    <Screen scroll keyboard>
      <View style={styles.top}>
        <Logo size={44} />
        <ThemeToggle />
      </View>

      <AppText variant="title">{t('auth.loginTitle')}</AppText>
      <AppText color="textSecondary" style={styles.subtitle}>
        {t('auth.loginSubtitle')}
      </AppText>

      <Controller
        control={control}
        name="phone"
        render={({ field, fieldState }) => (
          <Input
            label={t('auth.phone')}
            leftIcon="call-outline"
            keyboardType="phone-pad"
            placeholder={t('auth.phonePlaceholder')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState }) => (
          <Input
            label={t('auth.password')}
            leftIcon="lock-closed-outline"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message ? t(fieldState.error.message) : undefined}
          />
        )}
      />

      {error ? <AppText color="danger" style={styles.error}>{error}</AppText> : null}

      <Button
        label={t('auth.forgotPassword')}
        variant="ghost"
        fullWidth={false}
        style={styles.forgot}
        onPress={() => router.push(ROUTES.auth.forgotPassword)}
      />
      <Button label={t('auth.loginButton')} onPress={onSubmit} loading={loading || formState.isSubmitting} />

      <View style={styles.register}>
        <AppText color="textSecondary">{t('auth.noAccount')}</AppText>
        <Button label={t('auth.registerLink')} variant="ghost" fullWidth={false} onPress={() => router.push(ROUTES.auth.register)} />
      </View>

      {__DEV__ ? (
        <View style={styles.dev}>
          <AppText variant="caption" color="textSecondary">{t('auth.devLogin')}</AppText>
          <Button label={t('auth.devPassenger')} variant="secondary" onPress={() => open(authService.loginAs('u_passenger_1'))} />
          <Button label={t('auth.devDriver')} variant="secondary" onPress={() => open(authService.loginAs('u_driver_1'))} />
          <Button label={t('auth.devDriverPending')} variant="secondary" onPress={() => open(authService.loginAs('u_driver_2'))} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: layout.headerHeight, marginBottom: spacing.xl },
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.xl },
  error: { marginBottom: spacing.md },
  forgot: { alignSelf: 'flex-end', marginBottom: spacing.sm },
  register: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  dev: { gap: spacing.sm, marginTop: spacing.xl, paddingBottom: spacing.xl },
});
