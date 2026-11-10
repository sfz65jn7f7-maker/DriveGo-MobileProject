import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { SettingsRow, SettingsSection } from '@/features/settings/components';
import { useSettingsStore } from '@/features/settings/settings.store';
import type { ThemeMode } from '@/features/settings/settings.store';

export default function Appearance() {
  const { t } = useTranslation();
  const mode = useSettingsStore((s) => s.themeMode);
  const setMode = useSettingsStore((s) => s.setThemeMode);

  const options: { value: ThemeMode; label: string; icon: 'sunny-outline' | 'moon-outline' | 'phone-portrait-outline' }[] = [
    { value: 'light', label: t('settings.themeLight'), icon: 'sunny-outline' },
    { value: 'dark', label: t('settings.themeDark'), icon: 'moon-outline' },
    { value: 'system', label: t('settings.themeSystem'), icon: 'phone-portrait-outline' },
  ];

  return (
    <Screen scroll>
      <ScreenHeader title={t('settings.sections.appearance')} />
      <SettingsSection title={t('settings.theme')}>
        {options.map((o) => (
          <SettingsRow key={o.value} icon={o.icon} label={o.label} selected={mode === o.value} onPress={() => setMode(o.value)} />
        ))}
      </SettingsSection>
    </Screen>
  );
}
