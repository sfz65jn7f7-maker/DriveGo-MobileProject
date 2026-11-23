import { useCallback, useEffect, useState } from 'react';
import { Animated, FlatList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { AppText } from '@/components/ui/AppText';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorView } from '@/components/common/ErrorView';
import { Screen } from '@/components/common/Screen';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { OfferCard } from '@/components/ride/OfferCard';
import { useAcceptOffer, useCancelRide, useRideOffers } from '@/features/ride';
import { notify } from '@/features/notifications';
import { useBlockBack } from '@/hooks/useBlockBack';
import { useRideStore } from '@/store/ride.store';
import { ROUTES } from '@/constants/routes';
import { spacing, useTheme } from '@/theme';
import type { DriverOffer } from '@/types';
import { ask } from '@/utils/dialog';
import { formatPrice } from '@/utils/format';

/** Cercle qui pulse pendant la recherche de chauffeurs. */
function SearchingPulse() {
  const { colors } = useTheme();
  const [scale] = useState(() => new Animated.Value(0.6));
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.6, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale]);
  return (
    <View style={styles.pulseBox}>
      <Animated.View style={[styles.pulse, { backgroundColor: `${colors.primary}33`, transform: [{ scale }] }]} />
      <View style={[styles.pulseCore, { backgroundColor: colors.primary }]}>
        <Ionicons name="car-sport" size={28} color={colors.onPrimary} />
      </View>
    </View>
  );
}

export default function OffersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const rideId = useRideStore((s) => s.activeRideId);
  const proposedPrice = useRideStore((s) => s.proposedPrice);
  const setAcceptedOffer = useRideStore((s) => s.setAcceptedOffer);
  const reset = useRideStore((s) => s.reset);
  const { data: offers, isLoading, isError, refetch, isRefetching } = useRideOffers(rideId ?? '');
  const accept = useAcceptOffer();
  const cancel = useCancelRide();

  const confirmCancel = useCallback(async () => {
    const ok = await ask(t('ride.cancelTitle'), t('ride.cancelMessage'), t('ride.cancelRide'), t('common.no'));
    if (!ok || !rideId) return;
    await cancel.mutateAsync(rideId);
    reset();
    router.dismissTo(ROUTES.passenger.home);
  }, [t, rideId, cancel, reset, router]);

  useBlockBack(confirmCancel);

  // Alerte sonore dès que les premières offres arrivent
  const offersCount = offers?.length ?? 0;
  useEffect(() => {
    if (!offersCount) return;
    void notify({
      kind: 'ride',
      title: t('alerts.offersTitle'),
      body: t('ride.offersCount', { count: offersCount }),
      url: ROUTES.ride.offers,
    });
  }, [offersCount, t]);

  if (!rideId) return <Redirect href={ROUTES.passenger.home} />;

  const onAccept = async (offer: DriverOffer) => {
    await accept.mutateAsync({ rideId, offer });
    setAcceptedOffer(offer);
    router.replace(ROUTES.ride.tracking);
  };

  const cheapest = offers?.length ? Math.min(...offers.map((o) => o.price)) : null;

  return (
    <Screen>
      <ScreenHeader title={t('screens.offers')} showBack={false} />

      {isError ? (
        <ErrorView onRetry={refetch} />
      ) : isLoading || isRefetching ? (
        <View style={styles.searching}>
          <SearchingPulse />
          <AppText variant="subheading">{t('ride.searchingDrivers')}</AppText>
          <AppText color="textSecondary" style={styles.center}>
            {t('ride.yourPrice', { price: formatPrice(proposedPrice ?? 0) })}
          </AppText>
        </View>
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <AppText color="textSecondary">{t('ride.offersCount', { count: offers?.length ?? 0 })}</AppText>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.price === cheapest ? <Badge label={t('ride.bestPrice')} tone="success" /> : null}
              <OfferCard offer={item} acceptLabel={t('ride.accept')} onAccept={() => onAccept(item)} />
            </View>
          )}
        />
      )}

      <View style={styles.footer}>
        {!isLoading ? (
          <Button label={t('ride.changePrice')} variant="secondary" icon="pricetag-outline" onPress={() => router.back()} />
        ) : null}
        <Button label={t('ride.cancelRide')} variant="ghost" onPress={confirmCancel} loading={cancel.isPending || accept.isPending} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  searching: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  pulseBox: { width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  pulse: { position: 'absolute', width: 140, height: 140, borderRadius: 70 },
  pulseCore: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  list: { gap: spacing.md, paddingBottom: spacing.lg },
  item: { gap: spacing.xs },
  footer: { gap: spacing.xs, paddingVertical: spacing.md },
});
