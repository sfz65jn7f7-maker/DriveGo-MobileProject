import { useTranslation } from 'react-i18next';
import { EmptyState } from './EmptyState';

/** Erreur réseau / serveur avec bouton « Réessayer ». */
export function ErrorView({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title={t('common.errorTitle')}
      message={message ?? t('common.errorMessage')}
      actionLabel={onRetry ? t('common.retry') : undefined}
      onAction={onRetry}
    />
  );
}
