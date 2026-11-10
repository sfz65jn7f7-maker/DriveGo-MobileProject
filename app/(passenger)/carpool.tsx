import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ROUTES } from '@/constants/routes';
import { spacing } from '@/theme';

/** Entrée du covoiturage côté passager : réserver (le chauffeur, lui, publie). */
export default function CarpoolTab() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Screen edges={['top', 'left', 'right']} style={styles.content}>
      <ScreenHeader title={t('tabs.carpool')} showBack={false} showAvatar />
      <Button label={t('carpoolTab.search')} icon="search" onPress={() => router.push(ROUTES.carpool.search)} />
      <Button label={t('carpoolTab.myTrips')} icon="bookmark-outline" variant="secondary" onPress={() => router.push(ROUTES.carpool.myTrips)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
});
