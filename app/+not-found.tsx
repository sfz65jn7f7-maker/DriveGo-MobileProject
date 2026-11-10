import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Screen } from '@/components/common/Screen';
import { EmptyState } from '@/components/common/EmptyState';

export default function NotFound() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen>
      <EmptyState
        icon="compass-outline"
        title={t('common.notFoundTitle')}
        message={t('common.notFoundMessage')}
        actionLabel={t('common.goHome')}
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}
