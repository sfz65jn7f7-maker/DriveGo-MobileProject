import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useLogout } from '@/features/auth/useLogout';
import { SettingsRow, SettingsSection, SettingsSwitch } from '@/features/settings/components';
import { useSettingsStore } from '@/features/settings/settings.store';
import { spacing } from '@/theme';
import { notify } from '@/utils/dialog';

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const privacy = useSettingsStore((s) => s.privacy);
  const setPrivacy = useSettingsStore((s) => s.setPrivacy);
  const { confirmDelete } = useLogout();

  return (
    <Screen scroll>
      <ScreenHeader title={t('screens.privacy')} />
      <AppText color="textSecondary">{t('privacy.intro')}</AppText>

      <SettingsSection title={t('privacy.sharing')}>
        <SettingsSwitch
          icon="navigate-outline"
          label={t('privacy.locationDuringRide')}
          value={privacy.shareLocationDuringRide}
          onValueChange={(v) => setPrivacy('shareLocationDuringRide', v)}
        />
        <SettingsSwitch
          icon="image-outline"
          label={t('privacy.profilePhoto')}
          value={privacy.showProfilePhoto}
          onValueChange={(v) => setPrivacy('showProfilePhoto', v)}
        />
        <SettingsSwitch
          icon="analytics-outline"
          label={t('privacy.analytics')}
          value={privacy.analytics}
          onValueChange={(v) => setPrivacy('analytics', v)}
        />
      </SettingsSection>

      <SettingsSection title={t('privacy.yourData')}>
        <SettingsRow icon="download-outline" label={t('privacy.export')} onPress={() => notify(t('privacy.exportTitle'), t('privacy.exportMessage'))} />
        <SettingsRow icon="document-lock-outline" label={t('privacy.policy')} onPress={() => notify(t('privacy.policy'), t('common.comingSoon'))} />
        <SettingsRow icon="trash-outline" label={t('settings.deleteAccount')} destructive onPress={confirmDelete} />
      </SettingsSection>
      <View style={{ height: spacing.xxl }} />
    </Screen>
  );
}
