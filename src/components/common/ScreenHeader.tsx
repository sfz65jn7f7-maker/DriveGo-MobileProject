import { I18nManager, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { HeaderAvatar } from './HeaderAvatar';
import { layout, spacing } from '@/theme';

type Props = {
  title?: string;
  /** Flèche de retour (écrans secondaires uniquement). */
  showBack?: boolean;
  /** Avatar en haut à droite (écrans racine à header). */
  showAvatar?: boolean;
  right?: React.ReactNode;
};

export function ScreenHeader({ title, showBack = true, showAvatar = false, right }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const rtl = I18nManager.isRTL;

  // Chevron sur iOS, flèche sur Android ; icône inversée en RTL.
  const backIcon =
    Platform.OS === 'ios'
      ? rtl ? 'chevron-forward' : 'chevron-back'
      : rtl ? 'arrow-forward' : 'arrow-back';

  return (
    <View style={styles.row}>
      {showBack ? (
        <IconButton
          icon={backIcon}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          accessibilityLabel={t('common.back')}
          style={styles.back}
        />
      ) : null}
      <AppText variant="heading" numberOfLines={1} style={styles.title}>
        {title}
      </AppText>
      <View style={styles.right}>
        {right}
        {showAvatar ? <HeaderAvatar /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  back: { marginStart: -spacing.sm },
  title: { flex: 1, fontSize: 22 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
