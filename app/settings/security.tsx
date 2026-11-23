import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/form/FormField';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { changePasswordSchema } from '@/features/auth/schemas';
import type { ChangePasswordForm } from '@/features/auth/schemas';
import { SettingsRow, SettingsSection } from '@/features/settings/components';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { spacing } from '@/theme';
import { notify } from '@/utils/dialog';

export default function SecurityScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { control, handleSubmit, formState, reset } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current: '', password: '', confirm: '' },
  });

  const submit = handleSubmit(async ({ current, password }) => {
    setError(null);
    try {
      await authService.changePassword({ current, next: password });
      reset();
      notify(t('security.changed'));
      router.back();
    } catch {
      setError(t('security.wrongPassword'));
    }
  });

  return (
    <Screen scroll keyboard>
      <ScreenHeader title={t('screens.security')} />
      <AppText variant="subheading" style={styles.title}>{t('settings.changePassword')}</AppText>
      <FormField control={control} name="current" label={t('security.current')} leftIcon="lock-closed-outline" secureTextEntry />
      <FormField control={control} name="password" label={t('forgot.newPassword')} leftIcon="key-outline" secureTextEntry />
      <FormField control={control} name="confirm" label={t('forgot.confirmPassword')} leftIcon="key-outline" secureTextEntry />
      <AppText variant="caption" color="textSecondary" style={styles.hint}>{t('security.hint')}</AppText>
      {error ? <AppText color="danger" style={styles.hint}>{error}</AppText> : null}
      <Button label={t('common.save')} onPress={submit} loading={formState.isSubmitting} />

      <SettingsSection title={t('security.more')}>
        <SettingsRow icon="phone-portrait-outline" label={t('security.devices')} value={t('security.thisDevice')} />
        <SettingsRow icon="alert-circle-outline" label={t('settings.emergencyContacts')} onPress={() => router.push(ROUTES.settings.emergencyContacts)} />
      </SettingsSection>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.lg },
  hint: { marginTop: -spacing.sm, marginBottom: spacing.lg },
});
