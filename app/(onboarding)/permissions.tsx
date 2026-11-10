import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { requestForegroundPermission } from '@/features/location/location.permissions';
import { useSettingsStore } from '@/features/settings/settings.store';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';

export default function Permissions() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const setOnboardingDone = useSettingsStore((s) => s.setOnboardingDone);
  const [locationOk, setLocationOk] = useState(false);
  const [notifOk, setNotifOk] = useState(false);

  const askLocation = async () => setLocationOk((await requestForegroundPermission()) === 'granted');
  const askNotifications = async () => {
    try {
      const res = await Notifications.requestPermissionsAsync();
      setNotifOk(res.granted);
    } catch {
      setNotifOk(false);
    }
  };
  const finish = () => {
    setOnboardingDone(true);
    router.replace(ROUTES.auth.login);
  };

  return (
    <Screen scroll>
      <ScreenHeader />
      <View style={styles.intro}>
        <AppText variant="title">{t('permissions.title')}</AppText>
        <AppText color="textSecondary">{t('permissions.subtitle')}</AppText>
      </View>

      <Card style={styles.card}>
        <Ionicons name="location-outline" size={32} color={colors.primary} />
        <AppText variant="subheading">{t('permissions.locationTitle')}</AppText>
        <AppText color="textSecondary">{t('permissions.locationDesc')}</AppText>
        <Button
          label={locationOk ? t('permissions.allowed') : t('permissions.allow')}
          variant={locationOk ? 'secondary' : 'primary'}
          disabled={locationOk}
          onPress={askLocation}
        />
      </Card>

      <Card style={styles.card}>
        <Ionicons name="notifications-outline" size={32} color={colors.primary} />
        <AppText variant="subheading">{t('permissions.notificationsTitle')}</AppText>
        <AppText color="textSecondary">{t('permissions.notificationsDesc')}</AppText>
        <Button
          label={notifOk ? t('permissions.allowed') : t('permissions.allow')}
          variant={notifOk ? 'secondary' : 'primary'}
          disabled={notifOk}
          onPress={askNotifications}
        />
      </Card>

      <View style={styles.footer}>
        <Button label={t('common.continue')} onPress={finish} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing.xl },
  card: { gap: spacing.sm, marginBottom: spacing.lg },
  footer: { marginTop: 'auto', paddingVertical: spacing.lg },
});
