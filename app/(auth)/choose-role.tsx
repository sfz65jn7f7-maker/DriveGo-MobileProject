import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useAuthStore } from '@/features/auth/auth.store';
import { useRegistrationStore } from '@/features/auth/registration.store';
import { authService } from '@/services/auth.service';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import type { Role } from '@/types';

export default function ChooseRole() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const login = useAuthStore((s) => s.login);
  const { name, phone, password, clear } = useRegistrationStore();
  const [role, setRole] = useState<Role>('passenger');
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    setLoading(true);
    try {
      const session = await authService.register({ name, phone, password, role });
      await login(session.user, session.token);
      clear();
      router.replace(ROUTES.index);
    } finally {
      setLoading(false);
    }
  };

  const option = (value: Role, icon: 'person-outline' | 'car-outline', title: string, desc: string) => (
    <Card selected={role === value} onPress={() => setRole(value)} accessibilityLabel={title} style={styles.option}>
      <Ionicons name={icon} size={32} color={colors.primary} />
      <View style={styles.optionText}>
        <AppText variant="subheading">{title}</AppText>
        <AppText variant="label" color="textSecondary">{desc}</AppText>
      </View>
      {role === value ? <Ionicons name="checkmark-circle" size={24} color={colors.primary} /> : null}
    </Card>
  );

  return (
    <Screen scroll>
      <ScreenHeader />
      <AppText variant="title">{t('auth.chooseRoleTitle')}</AppText>
      <AppText color="textSecondary" style={styles.subtitle}>
        {t('auth.chooseRoleSubtitle')}
      </AppText>

      {option('passenger', 'person-outline', t('auth.iAmPassenger'), t('auth.passengerDesc'))}
      {option('driver', 'car-outline', t('auth.iAmDriver'), t('auth.driverDesc'))}

      <View style={styles.footer}>
        <Button label={t('common.continue')} onPress={confirm} loading={loading} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.xl },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  optionText: { flex: 1, gap: spacing.xs },
  footer: { marginTop: 'auto', paddingVertical: spacing.lg },
});
