import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Chip';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorView } from '@/components/common/ErrorView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { useEarnings } from '@/features/driver';
import { radius, spacing, useTheme } from '@/theme';
import { formatWeekday } from '@/utils/date';
import { formatPrice } from '@/utils/format';

type Period = 'today' | 'week' | 'month';
const CHART_HEIGHT = 140;

export default function EarningsScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { data, isLoading, isError, refetch, isRefetching } = useEarnings();
  const [period, setPeriod] = useState<Period>('week');
  const [selected, setSelected] = useState<number | null>(null);

  const max = data ? Math.max(...data.daily.map((d) => d.amount), 1) : 1;
  const avgPerTrip = data && data.trips ? data.month / data.trips : 0;

  return (
    <Screen edges={['top', 'left', 'right']} padded={false}>
      <View style={styles.padded}>
        <ScreenHeader title={t('screens.earnings')} showBack={false} showAvatar />
      </View>
      {isError ? (
        <ErrorView onRetry={refetch} />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.padded, styles.content]}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={colors.primary} />}
        >
          <Segmented
            value={period}
            onChange={setPeriod}
            options={[
              { value: 'today', label: t('earnings.today') },
              { value: 'week', label: t('earnings.week') },
              { value: 'month', label: t('earnings.month') },
            ]}
          />

          <Card elevated style={styles.total}>
            <AppText color="textSecondary">{t('earnings.total')}</AppText>
            {isLoading || !data ? (
              <Skeleton width={160} height={40} />
            ) : (
              <AppText variant="title" color="primary">{formatPrice(data[period])}</AppText>
            )}
          </Card>

          <View style={styles.stats}>
            <Card style={styles.stat}>
              <AppText variant="caption" color="textSecondary">{t('earnings.trips')}</AppText>
              <AppText variant="heading">{data?.trips ?? '—'}</AppText>
            </Card>
            <Card style={styles.stat}>
              <AppText variant="caption" color="textSecondary">{t('earnings.average')}</AppText>
              <AppText variant="heading">{data ? formatPrice(avgPerTrip) : '—'}</AppText>
            </Card>
          </View>

          <Card>
            <View style={styles.chartHead}>
              <AppText variant="subheading">{t('earnings.last7Days')}</AppText>
              {data && selected !== null ? (
                <AppText variant="label" color="primary">{formatPrice(data.daily[selected].amount)}</AppText>
              ) : null}
            </View>
            <View style={styles.chart} accessibilityRole="image" accessibilityLabel={t('earnings.last7Days')}>
              {(data?.daily ?? Array.from({ length: 7 }, () => ({ date: '', amount: 0 }))).map((d, i) => {
                const isToday = i === 6;
                const active = selected === i;
                return (
                  <View key={i} style={styles.barCol}>
                    <View
                      onTouchEnd={() => setSelected(active ? null : i)}
                      style={[
                        styles.bar,
                        {
                          height: Math.max(4, (d.amount / max) * CHART_HEIGHT),
                          backgroundColor: active || isToday ? colors.primary : `${colors.primary}55`,
                        },
                      ]}
                    />
                    <AppText variant="caption" color={isToday ? 'primary' : 'textSecondary'} numberOfLines={1}>
                      {d.date ? formatWeekday(d.date, i18n.language) : ''}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </Card>

          <AppText variant="caption" color="textSecondary" style={styles.note}>{t('earnings.payoutNote')}</AppText>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  padded: { paddingHorizontal: 20 },
  content: { gap: spacing.md, paddingBottom: spacing.xxl },
  total: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: { flex: 1, gap: spacing.xs },
  chartHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, height: CHART_HEIGHT + 24 },
  barCol: { flex: 1, alignItems: 'center', gap: spacing.xs },
  bar: { width: '70%', borderRadius: radius.sm },
  note: { textAlign: 'center' },
});
