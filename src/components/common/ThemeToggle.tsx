import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/ui/IconButton';
import { useTheme } from '@/theme';

/** Bouton soleil / croissant : relié au même themeMode que Paramètres → Apparence. */
export function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const { t } = useTranslation();
  return (
    <IconButton
      icon={isDark ? 'sunny-outline' : 'moon-outline'}
      onPress={toggle}
      accessibilityLabel={isDark ? t('settings.switchToLight') : t('settings.switchToDark')}
    />
  );
}
