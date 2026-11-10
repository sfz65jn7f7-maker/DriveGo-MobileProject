import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { SettingsRow, SettingsSection } from '@/features/settings/components';
import { useAuthStore } from '@/features/auth/auth.store';
import { useLogout } from '@/features/auth/useLogout';
import { ROUTES } from '@/constants/routes';
import { spacing } from '@/theme';

/** Page Profil unique, utilisée par les onglets passager et chauffeur. */
export function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { confirmLogout } = useLogout();
  if (!user) return null;

  const isDriver = user.role === 'driver';

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <ScreenHeader
        title={t('profile.title')}
        showBack={false}
        right={
          <>
            <ThemeToggle />
            <IconButton
              icon="settings-outline"
              onPress={() => router.push(ROUTES.settings.index)}
              accessibilityLabel={t('profile.settings')}
            />
          </>
        }
      />

      <View style={styles.identity}>
        <Avatar name={user.name} uri={user.avatarUrl} size={80} />
        <AppText variant="heading">{user.name}</AppText>
        <AppText color="textSecondary">{user.phone}</AppText>
        <View style={styles.badges}>
          <Badge label={t(`roles.${user.role}`)} tone="primary" />
          {isDriver && user.driverStatus ? (
            <Badge
              label={t(`driverStatus.${user.driverStatus}`)}
              tone={user.driverStatus === 'approved' ? 'success' : user.driverStatus === 'pending' ? 'warning' : 'danger'}
            />
          ) : null}
        </View>
      </View>

      <SettingsSection>
        <SettingsRow icon="person-outline" label={t('profile.edit')} onPress={() => router.push(ROUTES.settings.editProfile)} />
        {isDriver ? (
          <SettingsRow icon="document-text-outline" label={t('profile.documents')} onPress={() => router.push(ROUTES.driver.documents)} />
        ) : null}
        <SettingsRow icon="wallet-outline" label={t('profile.wallet')} onPress={() => router.push(ROUTES.wallet)} />
        <SettingsRow icon="notifications-outline" label={t('profile.notifications')} onPress={() => router.push(ROUTES.notifications)} />
        <SettingsRow icon="settings-outline" label={t('profile.settings')} onPress={() => router.push(ROUTES.settings.index)} />
        <SettingsRow icon="help-circle-outline" label={t('profile.help')} onPress={() => router.push(ROUTES.help)} />
      </SettingsSection>

      <SettingsSection>
        <SettingsRow icon="log-out-outline" label={t('common.logout')} destructive onPress={confirmLogout} />
      </SettingsSection>
      <View style={styles.bottom} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.lg },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  bottom: { height: spacing.xxl },
});
