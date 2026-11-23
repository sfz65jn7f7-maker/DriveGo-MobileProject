import { useEffect, useRef, useState } from 'react';
import type { ComponentRef } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorView } from '@/components/common/ErrorView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { usePlaceSearch, useReverseGeocode } from '@/features/ride';
import { useLocation } from '@/features/location/useLocation';
import { useDebounce } from '@/hooks/useDebounce';
import { usePlacesStore } from '@/store/places.store';
import { useRideStore } from '@/store/ride.store';
import { ROUTES } from '@/constants/routes';
import { fontSize, layout, radius, spacing, useTheme } from '@/theme';
import type { Coords, Place } from '@/types';
import { formatDistance } from '@/utils/format';
import { distanceKm } from '@/utils/geo';

type Field = 'pickup' | 'destination';

const CURRENT_ID = 'current';

export default function SearchDestinationScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const { coords, status, request } = useLocation();
  const pickup = useRideStore((s) => s.pickup);
  const setPickup = useRideStore((s) => s.setPickup);
  const setDestination = useRideStore((s) => s.setDestination);
  const destination = useRideStore((s) => s.destination);
  const recent = usePlacesStore((s) => s.recent);
  const addRecent = usePlacesStore((s) => s.addRecent);

  const [field, setField] = useState<Field>('destination');
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const destinationRef = useRef<ComponentRef<typeof TextInput>>(null);
  const pickupRef = useRef<ComponentRef<typeof TextInput>>(null);

  // Recherche « en fonction de la carte » : autour du départ choisi, sinon de la position GPS.
  const near: Coords | null =
    field === 'destination' && pickup && pickup.id !== CURRENT_ID ? pickup.coords : (coords ?? null);
  const search = usePlaceSearch(debounced, near, i18n.language);
  const { data: here } = useReverseGeocode(coords, i18n.language);

  // Départ par défaut : la position GPS réelle (jamais une ville supposée).
  // Sans GPS, l'utilisateur choisit son départ lui-même.
  const currentPlace: Place | null = coords
    ? {
        id: CURRENT_ID,
        title: t('ride.currentLocation'),
        address: here ? [here.title, here.address].filter(Boolean).join(', ') : '',
        coords,
      }
    : null;
  useEffect(() => {
    if (!pickup || pickup.id === CURRENT_ID) setPickup(currentPlace);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude, here?.id]);

  const select = (place: Place) => {
    if (place.id !== CURRENT_ID) addRecent(place);
    if (field === 'pickup') {
      setPickup(place);
      setQuery('');
      // Destination déjà choisie (cas « départ manquant ») : on continue directement
      if (destination) {
        router.push(ROUTES.ride.setPrice);
        return;
      }
      setField('destination');
      destinationRef.current?.focus();
      return;
    }
    setDestination(place);
    if (!pickup) {
      // Pas de position GPS ni de départ : on demande le point de départ
      setField('pickup');
      setQuery('');
      pickupRef.current?.focus();
      return;
    }
    router.push(ROUTES.ride.setPrice);
  };

  const fieldStyle = (active: boolean) => [
    styles.field,
    { backgroundColor: colors.surface, borderColor: active ? colors.primary : colors.border },
  ];

  const typing = debounced.trim().length >= 2;
  const list = typing ? (search.data ?? []) : recent;

  const renderPlace = ({ item }: { item: Place }) => {
    const km = near ? distanceKm(near, item.coords) : null;
    return (
      <Pressable
        onPress={() => select(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.address}`}
        style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
      >
        <View style={[styles.icon, { backgroundColor: colors.surface }]}>
          <Ionicons name={typing ? 'location-outline' : 'time-outline'} size={20} color={colors.textSecondary} />
        </View>
        <View style={styles.flex}>
          <AppText variant="subheading" numberOfLines={1}>{item.title}</AppText>
          {item.address ? <AppText variant="caption" color="textSecondary" numberOfLines={1}>{item.address}</AppText> : null}
        </View>
        {km !== null ? <AppText variant="caption" color="textSecondary">{formatDistance(km)}</AppText> : null}
      </Pressable>
    );
  };

  return (
    <Screen keyboard>
      <ScreenHeader title={t('screens.searchDestination')} />

      <View style={styles.fields}>
        <View style={fieldStyle(field === 'pickup')}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <TextInput
            ref={pickupRef}
            value={field === 'pickup' ? query : (pickup?.title ?? '')}
            onFocus={() => {
              setField('pickup');
              setQuery('');
            }}
            onChangeText={setQuery}
            placeholder={t('ride.pickupPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel={t('ride.pickup')}
            style={[styles.input, { color: colors.text }]}
          />
        </View>
        <View style={fieldStyle(field === 'destination')}>
          <View style={[styles.dot, styles.square, { backgroundColor: colors.text }]} />
          <TextInput
            ref={destinationRef}
            autoFocus
            value={field === 'destination' ? query : ''}
            onFocus={() => {
              setField('destination');
              setQuery('');
            }}
            onChangeText={setQuery}
            placeholder={t('ride.searchPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel={t('ride.destination')}
            returnKeyType="search"
            style={[styles.input, { color: colors.text }]}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityRole="button" accessibilityLabel={t('common.clear')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {!coords && status !== 'granted' ? (
        <Pressable
          onPress={() => void request()}
          accessibilityRole="button"
          style={[styles.notice, { backgroundColor: `${colors.warning}1F` }]}
        >
          <Ionicons name="locate-outline" size={18} color={colors.warning} />
          <AppText variant="caption" style={styles.flex}>{t('ride.locationForNearby')}</AppText>
          <AppText variant="label" color="primary">{t('ride.enable')}</AppText>
        </Pressable>
      ) : null}
      {field === 'pickup' && destination && !pickup ? (
        <AppText variant="label" color="primary" style={styles.section}>
          {t('ride.choosePickup', { place: destination.title })}
        </AppText>
      ) : null}

      {field === 'pickup' && !typing && currentPlace ? (
        <Pressable onPress={() => select(currentPlace)} style={styles.row} accessibilityRole="button">
          <View style={[styles.icon, { backgroundColor: colors.surface }]}>
            <Ionicons name="locate" size={20} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <AppText variant="subheading">{t('ride.currentLocation')}</AppText>
            {currentPlace.address ? (
              <AppText variant="caption" color="textSecondary" numberOfLines={1}>{currentPlace.address}</AppText>
            ) : null}
          </View>
        </Pressable>
      ) : null}

      {typing && search.isLoading ? (
        <ListSkeleton count={4} />
      ) : typing && search.isError ? (
        <ErrorView message={t('ride.searchError')} onRetry={() => void search.refetch()} />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(p) => p.id}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            list.length ? (
              <AppText variant="label" color="textSecondary" style={styles.section}>
                {typing ? (near ? t('ride.resultsNearby') : t('ride.results')) : t('ride.recent')}
              </AppText>
            ) : undefined
          }
          ListEmptyComponent={
            typing ? (
              <EmptyState icon="location-outline" title={t('ride.noPlaces')} message={t('ride.noPlacesHint')} />
            ) : (
              <View style={styles.hint}>
                <Ionicons name="search" size={28} color={colors.textSecondary} />
                <AppText color="textSecondary" style={styles.center}>{t('ride.searchHint')}</AppText>
              </View>
            )
          }
          renderItem={renderPlace}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
          ListFooterComponent={
            typing && list.length ? (
              <AppText variant="caption" color="textSecondary" style={styles.attribution}>© OpenStreetMap</AppText>
            ) : undefined
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { textAlign: 'center' },
  fields: { gap: spacing.sm, marginBottom: spacing.md },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  square: { borderRadius: 2 },
  input: { flex: 1, fontSize: fontSize.md, paddingVertical: spacing.md },
  notice: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.sm },
  section: { marginVertical: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: layout.touchTarget + 16, paddingVertical: spacing.sm },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  separator: { height: StyleSheet.hairlineWidth, marginStart: 52 },
  hint: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  attribution: { textAlign: 'center', marginVertical: spacing.md },
});
