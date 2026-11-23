import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { useUnreadCount } from '@/features/notifications';
import { ROUTES } from '@/constants/routes';
import { useTheme } from '@/theme';

/** Cloche flottante avec pastille du nombre de notifications non lues. */
export function NotificationBell() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const unread = useUnreadCount();
  return (
    <View>
      <IconButton
        icon="notifications-outline"
        variant="floating"
        accessibilityLabel={unread ? t('notifications.unreadA11y', { count: unread }) : t('screens.notifications')}
        onPress={() => router.push(ROUTES.notifications)}
      />
      {unread > 0 ? (
        <View style={[styles.badge, { backgroundColor: colors.danger, borderColor: colors.surface }]} pointerEvents="none">
          <AppText variant="caption" color="onDanger" style={styles.count} maxFontSizeMultiplier={1}>
            {unread > 9 ? '9+' : unread}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 0,
    end: 0,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: { fontSize: 10, lineHeight: 12, fontWeight: '700' },
});
