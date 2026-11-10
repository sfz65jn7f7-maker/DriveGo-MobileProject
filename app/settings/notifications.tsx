import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SettingsSection, SettingsSwitch } from '@/features/settings/components';
import { useSettingsStore } from '@/features/settings/settings.store';

export default function NotificationSettings() {
  const { t } = useTranslation();
  const n = useSettingsStore((s) => s.notifications);
  const set = useSettingsStore((s) => s.setNotification);

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
    </Screen>
  );
}
