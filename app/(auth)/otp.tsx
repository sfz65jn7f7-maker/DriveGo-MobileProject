import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useRegistrationStore } from '@/features/auth/registration.store';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { spacing } from '@/theme';

export default function Otp() {
  const { t } = useTranslation();
  const router = useRouter();
  const phone = useRegistrationStore((s) => s.phone);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    setLoading(true);
    const ok = await authService.verifyOtp(code);
    setLoading(false);
    if (ok) router.push(ROUTES.auth.chooseRole);
    else setError(t('auth.errors.invalidOtp'));
  };

  return (
    <Screen scroll keyboard>
      <ScreenHeader />
      <AppText variant="title">{t('auth.otpTitle')}</AppText>
      <AppText color="textSecondary" style={styles.subtitle}>
        {t('auth.otpSubtitle', { phone })}
      </AppText>
      <Input
        label={t('auth.otpCode')}
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={(v) => {
          setCode(v);
          setError(undefined);
        }}
        error={error}
        leftIcon="keypad-outline"
      />
      <Button label={t('auth.verify')} onPress={verify} loading={loading} disabled={code.length < 6} />
      <Button label={t('auth.resend')} variant="ghost" onPress={() => undefined} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.xl },
});
