import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { Platform } from 'react-native';
import type MapView from 'react-native-maps';
import type { useLocation } from './useLocation';
import type { Coords } from '@/types';

type LocationApi = Pick<ReturnType<typeof useLocation>, 'status' | 'request' | 'refresh' | 'openSettings'>;

const zoom = (c: Coords) => ({ ...c, latitudeDelta: 0.01, longitudeDelta: 0.01 });

/**
 * Bouton « recentrer » commun à l'accueil passager et au tableau de bord chauffeur.
 * - centre la carte UNE seule fois quand la première position arrive (évite la boucle refresh → coords → refresh) ;
 * - gère les cas permission refusée / GPS coupé.
 */
export function useRecenterMap(mapRef: RefObject<MapView | null>, position: Coords | null, location: LocationApi) {
  const { status, request, refresh, openSettings } = location;

  const recenter = useCallback(async () => {
    const blocked = status === 'blocked' || status === 'servicesDisabled';
    const animate = (c: Coords) => mapRef.current?.animateToRegion(zoom(c), 400);
    let target = position;

    // Web : la position n'est pas suivie en continu, on la redemande à chaque clic.
    if (Platform.OS === 'web') {
      if (blocked) {
        void openSettings();
        return;
      }
      if (status === 'granted' || (await request()) === 'granted') target = (await refresh()) ?? position;
    }
    if (target) {
      animate(target);
      return;
    }
    // Mobile sans position connue : on demande la permission ou on ouvre les réglages.
    if (blocked) void openSettings();
    else if (status === 'granted' || (await request()) === 'granted') {
      const next = await refresh();
      if (next) animate(next);
    }
  }, [mapRef, position, status, request, refresh, openSettings]);

  const centered = useRef(false);
  useEffect(() => {
    if (!position || centered.current) return;
    centered.current = true;
    mapRef.current?.animateToRegion(zoom(position), 400);
  }, [mapRef, position]);

  return recenter;
}
