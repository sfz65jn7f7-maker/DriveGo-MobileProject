import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import type { Coords } from '@/types';

/**
 * Suivi continu (chauffeur en ligne). Mises à jour limitées à ~3 s / 10 m
 * et arrêt automatique quand `enabled` repasse à false (économie de batterie).
 */
export function useWatchLocation(enabled: boolean) {
  const [coords, setCoords] = useState<Coords | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    let subscription: Location.LocationSubscription | undefined;

    (async () => {
      const { granted } = await Location.getForegroundPermissionsAsync();
      if (!granted) return;
      const sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 3000, distanceInterval: 10 },
        (pos) => setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      );
      if (cancelled) sub.remove();
      else subscription = sub;
    })();

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [enabled]);

  return coords;
}
