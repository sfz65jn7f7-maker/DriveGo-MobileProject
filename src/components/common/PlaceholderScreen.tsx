import { useTranslation } from 'react-i18next';
import { Screen } from './Screen';
import { ScreenHeader } from './ScreenHeader';
import { EmptyState } from './EmptyState';

/** Écran provisoire : titre + message « bientôt disponible ». À remplacer écran par écran. */
export function PlaceholderScreen({ titleKey, back = true }: { titleKey: string; back?: boolean }) {
  const { t } = useTranslation();
  return (
    <Screen edges={back ? ['top', 'bottom', 'left', 'right'] : ['top', 'left', 'right']}>
      <ScreenHeader title={t(titleKey)} showBack={back} showAvatar={!back} />
      <EmptyState icon="construct-outline" title={t(titleKey)} message={t('common.comingSoon')} />
    </Screen>
  );
}
