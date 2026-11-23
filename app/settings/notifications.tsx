import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { notify } from '@/features/notifications';
import { SettingsSection, SettingsSwitch } from '@/features/settings/components';
import { useSettingsStore } from '@/features/settings/settings.store';
import { spacing } from '@/theme';

export default function NotificationSettings() {
  const { t } = useTranslation();
  const n = useSettingsStore((s) => s.notifications);
  const set = useSettingsStore((s) => s.setNotification);

  const test = async () => {
    // Web : demande l'autorisation du navigateur au premier essai
    if (Platform.OS === 'web' && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    await notify({ kind: 'ride', title: t('alerts.driverArrivedTitle'), body: t('alerts.testBody') });
  };

  return (
    <Screen scroll>
      <ScreenHeader title={t('settings.sections.notifications')} />
      <SettingsSection>
        <SettingsSwitch icon="notifications-outline" label={t('settings.pushNotifications')} value={n.push} onValueChange={(v) => set('push', v)} />
      </SettingsSection>
      <SettingsSection>
        <SettingsSwitch icon="car-outline" label={t('settings.rideUpdates')} value={n.rides} onValueChange={(v) => set('rides', v)} />
        <SettingsSwitch icon="chatbubble-outline" label={t('settings.messages')} value={n.messages} onValueChange={(v) => set('messages', v)} />
        <SettingsSwitch icon="pricetag-outline" label={t('settings.promotions')} value={n.promotions} onValueChange={(v) => set('promotions', v)} />
        <SettingsSwitch icon="volume-medium-outline" label={t('settings.soundVibration')} value={n.sound} onValueChange={(v) => set('sound', v)} />
      </SettingsSection>
      <View style={styles.test}>
        <Button label={t('alerts.test')} icon="notifications-circle-outline" variant="secondary" onPress={test} />
        <AppText variant="caption" color="textSecondary" style={styles.hint}>{t('alerts.testHint')}</AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  test: { marginTop: spacing.xl, gap: spacing.sm },
  hint: { textAlign: 'center' },
});
