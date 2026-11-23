import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { FormField as Field } from '@/components/form/FormField';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { phoneSchema, resetPasswordSchema } from '@/features/auth/schemas';
import type { PhoneForm, ResetPasswordForm } from '@/features/auth/schemas';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';

type Step = 'phone' | 'reset' | 'done';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const phoneForm = useForm<PhoneForm>({ resolver: zodResolver(phoneSchema), defaultValues: { phone: '' } });
  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: '', password: '', confirm: '' },
  });

  const sendCode = phoneForm.handleSubmit(async ({ phone: value }) => {
    setError(null);
    await authService.requestPasswordReset(value);
    setPhone(value);
    setStep('reset');
  });

  const reset = resetForm.handleSubmit(async ({ code, password }) => {
    setError(null);
    try {
      await authService.resetPassword({ phone, code, password });
      setStep('done');
    } catch {
      setError(t('auth.errors.invalidOtp'));
    }
  });

  if (step === 'done') {
    return (
      <Screen>
        <View style={styles.center}>
          <Ionicons name="checkmark-circle" size={72} color={colors.success} />
          <AppText variant="heading" style={styles.text}>{t('forgot.doneTitle')}</AppText>
          <AppText color="textSecondary" style={styles.text}>{t('forgot.doneMessage')}</AppText>
        </View>
        <Button label={t('auth.loginButton')} onPress={() => router.replace(ROUTES.auth.login)} style={styles.footer} />
      </Screen>
    );
  }

  return (
    <Screen scroll keyboard>
      <ScreenHeader title={t('screens.forgotPassword')} />
      {step === 'phone' ? (
        <>
          <AppText color="textSecondary" style={styles.intro}>{t('forgot.phoneIntro')}</AppText>
          <Field
            control={phoneForm.control}
            name="phone"
            label={t('auth.phone')}
            leftIcon="call-outline"
            keyboardType="phone-pad"
            placeholder={t('auth.phonePlaceholder')}
          />
          <Button label={t('forgot.sendCode')} onPress={sendCode} loading={phoneForm.formState.isSubmitting} />
        </>
      ) : (
        <>
          <AppText color="textSecondary" style={styles.intro}>{t('auth.otpSubtitle', { phone })}</AppText>
          <Field control={resetForm.control} name="code" label={t('auth.otpCode')} leftIcon="keypad-outline" keyboardType="number-pad" maxLength={6} />
          <Field control={resetForm.control} name="password" label={t('forgot.newPassword')} leftIcon="lock-closed-outline" secureTextEntry />
          <Field control={resetForm.control} name="confirm" label={t('forgot.confirmPassword')} leftIcon="lock-closed-outline" secureTextEntry />
          {error ? <AppText color="danger" style={styles.error}>{error}</AppText> : null}
          <Button label={t('forgot.reset')} onPress={reset} loading={resetForm.formState.isSubmitting} />
          <Button label={t('auth.resend')} variant="ghost" onPress={() => void authService.requestPasswordReset(phone)} />
          {__DEV__ ? <AppText variant="caption" color="textSecondary" style={styles.text}>{t('forgot.devHint')}</AppText> : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { marginBottom: spacing.xl },
  error: { marginBottom: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  text: { textAlign: 'center' },
  footer: { marginBottom: spacing.lg },
});
