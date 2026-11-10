import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/common/Screen';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useAuthStore } from '@/features/auth/auth.store';
import { useLogout } from '@/features/auth/useLogout';
import { useDriverGate } from '@/features/driver/useDriverGate';
import { spacing, useTheme } from '@/theme';

/** Affiché tant que le dossier chauffeur n'est pas validé. Le layout racine gère l'accès. */
export default function PendingValidation() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { status } = useDriverGate();
  const updateUser = useAuthStore((s) => s.updateUser);
  const { confirmLogout } = useLogout();

  const key = status === 'rejected' ? 'rejected' : status === 'suspended' ? 'suspended' : 'pending';
  const icon = key === 'pending' ? 'hourglass-outline' : 'alert-circle-outline';

  return (
    <Screen>
      <View style={styles.top}>
        <ThemeToggle />
      </View>
      <View style={styles.center}>
        <Ionicons name={icon} size={72} color={key === 'pending' ? colors.warning : colors.danger} />
        <AppText variant="heading" style={styles.text}>
          {t(`driverStatus.${key}Title`)}
        </AppText>
        <AppText color="textSecondary" style={styles.text}>
          {t(`driverStatus.${key}Message`)}
        </AppText>
      </View>
      <View style={styles.footer}>
        {__DEV__ ? (
          <Button
            label={t('driverStatus.simulateApproval')}
            variant="secondary"
            onPress={() => void updateUser({ driverStatus: 'approved' })}
          />
        ) : null}
        <Button label={t('common.logout')} variant="ghost" onPress={confirmLogout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xl },
  text: { textAlign: 'center' },
  footer: { gap: spacing.sm, paddingBottom: spacing.lg },
});