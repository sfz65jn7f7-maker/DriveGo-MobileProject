import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SettingsRow, SettingsSection } from '@/features/settings/components';
import { useSettingsStore } from '@/features/settings/settings.store';
import { LANGUAGES } from '@/i18n';
import { spacing } from '@/theme';

export default function LanguageScreen() {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <Screen scroll>
      <ScreenHeader title={t('settings.language')} />
      <SettingsSection>
        {LANGUAGES.map((l) => (
          <SettingsRow key={l.code} label={l.label} selected={language === l.code} onPress={() => setLanguage(l.code)} />
        ))}
      </SettingsSection>
      <AppText variant="caption" color="textSecondary" style={{ marginTop: spacing.md }}>
        {t('settings.languageRtlNote')}
      </AppText>
    </Screen>
  );
}
