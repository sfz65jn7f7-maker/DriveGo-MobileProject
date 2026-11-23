import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorView } from '@/components/common/ErrorView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useMarkAllRead, useMarkRead, useNotifications } from '@/features/notifications';
import { radius, spacing, useTheme } from '@/theme';
import type { AppNotification } from '@/types';
import { isSameDay } from '@/utils/date';
import { formatDateTime } from '@/utils/format';

const ICONS: Record<AppNotification['type'], React.ComponentProps<typeof Ionicons>['name']> = {
  ride: 'car-outline',
  carpool: 'people-outline',
  promo: 'pricetag-outline',
  system: 'information-circle-outline',
};

/** Libellé relatif : « il y a 5 min », « il y a 3 h », sinon la date. */
function useRelative() {
  const { t, i18n } = useTranslation();
  return (iso: string) => {
    const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
    if (minutes < 1) return t('notifications.now');
    if (minutes < 60) return t('notifications.minutesAgo', { count: minutes });
    if (isSameDay(new Date(iso), new Date())) return t('notifications.hoursAgo', { count: Math.round(minutes / 60) });
    return formatDateTime(iso, i18n.language);
  };
}

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const relative = useRelative();
  const { data, isLoading, isError, refetch, isRefetching } = useNotifications();
  const markRead = useMarkRead();
  const markAll = useMarkAllRead();
  const hasUnread = data?.some((n) => !n.read);

  return (
    <Screen>
      <ScreenHeader
        title={t('screens.notifications')}
        right={hasUnread ? <Button label={t('notifications.markAll')} variant="ghost" fullWidth={false} onPress={() => markAll.mutate()} /> : undefined}
      />
      {isLoading ? (
        <ListSkeleton count={4} />
      ) : isError ? (
        <ErrorView onRetry={refetch} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(n) => n.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={colors.primary} />}
          ListEmptyComponent={<EmptyState icon="notifications-off-outline" title={t('notifications.empty')} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => !item.read && markRead.mutate(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`${item.read ? '' : t('notifications.unread') + ', '}${item.title}. ${item.body}`}
              style={({ pressed }) => [
                styles.item,
                {
                  backgroundColor: item.read ? colors.surface : `${colors.primary}14`,
                  borderColor: item.read ? colors.border : `${colors.primary}55`,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: colors.background }]}>
                <Ionicons name={ICONS[item.type]} size={20} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <View style={styles.head}>
                  <AppText variant="subheading" style={styles.flex} numberOfLines={1}>{item.title}</AppText>
                  {!item.read ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}
                </View>
                <AppText color="textSecondary">{item.body}</AppText>
                <AppText variant="caption" color="textSecondary" style={styles.time}>{relative(item.createdAt)}</AppText>
              </View>
            </Pressable>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { gap: spacing.sm, paddingVertical: spacing.md, flexGrow: 1 },
  item: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  time: { marginTop: spacing.xs },
});
