import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { ErrorView } from '@/components/common/ErrorView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useDocuments, useUploadDocument } from '@/features/driver';
import { useAuthStore } from '@/features/auth/auth.store';
import { layout, spacing, useTheme } from '@/theme';
import type { DocumentStatus, DocumentType } from '@/types';
import { notify } from '@/utils/dialog';
import { formatDateTime } from '@/utils/format';

const ICONS: Record<DocumentType, React.ComponentProps<typeof Ionicons>['name']> = {
  license: 'card-outline',
  registration: 'document-text-outline',
  insurance: 'shield-checkmark-outline',
  idCard: 'person-circle-outline',
};

const TONES: Record<DocumentStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
  missing: 'neutral',
};

export default function DocumentsScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const vehicle = useAuthStore((s) => s.user?.vehicle);
  const { data, isLoading, isError, refetch } = useDocuments();
  const upload = useUploadDocument();

  const done = data?.filter((d) => d.status === 'approved').length ?? 0;
  const total = data?.length ?? 4;

  // Mock : l'envoi est simulé. En production : expo-image-picker / expo-document-picker puis envoi au backend.
  const onUpload = async (type: DocumentType) => {
    await upload.mutateAsync(type);
    notify(t('documents.sentTitle'), t('documents.sentMessage'));
  };

  return (
    <Screen padded={false}>
      <View style={styles.padded}>
        <ScreenHeader title={t('screens.documents')} />
      </View>
      <ScrollView contentContainerStyle={[styles.padded, styles.content]}>
        <Card elevated>
          <AppText variant="subheading">{t('documents.progress', { done, total })}</AppText>
          <View style={[styles.track, { backgroundColor: colors.border }]}>
            <View style={[styles.fill, { width: `${(done / total) * 100}%`, backgroundColor: colors.success }]} />
          </View>
          <AppText variant="caption" color="textSecondary">{t('documents.progressHint')}</AppText>
        </Card>

        {isLoading ? (
          <ListSkeleton count={4} />
        ) : isError ? (
          <ErrorView onRetry={refetch} />
        ) : (
          data?.map((doc) => (
            <Card key={doc.type}>
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: colors.background }]}>
                  <Ionicons name={ICONS[doc.type]} size={22} color={colors.primary} />
                </View>
                <View style={styles.flex}>
                  <AppText variant="subheading">{t(`documents.types.${doc.type}`)}</AppText>
                  <AppText variant="caption" color="textSecondary">
                    {doc.updatedAt ? t('documents.updated', { date: formatDateTime(doc.updatedAt, i18n.language) }) : t('documents.notSent')}
                  </AppText>
                </View>
                <Badge label={t(`documents.status.${doc.status}`)} tone={TONES[doc.status]} />
              </View>
              {doc.status === 'missing' || doc.status === 'rejected' ? (
                <Button
                  label={t('documents.upload')}
                  icon="cloud-upload-outline"
                  variant="secondary"
                  onPress={() => onUpload(doc.type)}
                  loading={upload.isPending && upload.variables === doc.type}
                  style={styles.action}
                />
              ) : null}
            </Card>
          ))
        )}

        <AppText variant="label" color="textSecondary" style={styles.section}>{t('documents.vehicle')}</AppText>
        <Card>
          {vehicle ? (
            <>
              <AppText variant="subheading">{vehicle.brand} {vehicle.model} · {vehicle.year}</AppText>
              <AppText color="textSecondary">{vehicle.color} · {vehicle.plate}</AppText>
            </>
          ) : (
            <AppText color="textSecondary">{t('documents.noVehicle')}</AppText>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  padded: { paddingHorizontal: layout.screenPadding },
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  track: { height: 6, borderRadius: 3, overflow: 'hidden', marginVertical: spacing.sm },
  fill: { height: 6, borderRadius: 3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  action: { marginTop: spacing.md },
  section: { marginTop: spacing.md, marginHorizontal: spacing.xs },
});
