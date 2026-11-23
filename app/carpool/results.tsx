import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { ChipGroup } from '@/components/ui/Chip';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorView } from '@/components/common/ErrorView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { TripCard } from '@/components/carpool/TripCard';
import { useCarpoolSearch } from '@/features/carpool';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';

type Sort = 'time' | 'price' | 'rating';

export default function CarpoolResultsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ from?: string; to?: string; date?: string; seats?: string }>();
  const seats = Number(params.seats) || 1;
  const { data, isLoading, isError, refetch, isRefetching } = useCarpoolSearch({
    from: params.from,
    to: params.to,
    date: params.date || undefined,
    seats,
  });
  const [sort, setSort] = useState<Sort>('time');

  const sorted = useMemo(() => {
    const list = [...(data ?? [])];
    if (sort === 'price') list.sort((a, b) => a.pricePerSeat - b.pricePerSeat);
    if (sort === 'rating') list.sort((a, b) => b.driver.rating - a.driver.rating);
    return list;
  }, [data, sort]);

  return (
    <Screen>
      <ScreenHeader title={`${params.from ?? ''} → ${params.to ?? ''}`} />
      <ChipGroup
        value={sort}
        onChange={setSort}
        options={[
          { value: 'time', label: t('carpool.sortTime') },
          { value: 'price', label: t('carpool.sortPrice') },
          { value: 'rating', label: t('carpool.sortRating') },
        ]}
      />
      {isLoading ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorView onRetry={refetch} />
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(trip) => trip.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={colors.primary} />}
          ListHeaderComponent={
            sorted.length ? <AppText color="textSecondary">{t('carpool.resultsCount', { count: sorted.length })}</AppText> : undefined
          }
          ListEmptyComponent={
            <EmptyState
              icon="car-outline"
              title={t('carpool.noResults')}
              message={t('carpool.noResultsHint')}
              actionLabel={t('carpool.editSearch')}
              onAction={() => router.back()}
            />
          }
          renderItem={({ item }) => (
            <TripCard trip={item} onPress={() => router.push({ pathname: ROUTES.carpool.detailPath, params: { id: item.id, seats: String(seats) } })} />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, paddingVertical: spacing.md, flexGrow: 1 },
});
