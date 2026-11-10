import { useCallback, useEffect, useState } from 'react';
import { Linking } from 'react-native';
import * as Location from 'expo-location';
import {
  isLocationServiceEnabled,
  readPermissionStatus,
  requestForegroundPermission,
} from './location.permissions';
import type { LocationStatus } from './location.permissions';
import type { Coords } from '@/types';

/** Permission + position ponctuelle (passager). */
export function useLocation({ autoFetch = true }: { autoFetch?: boolean } = {}) {
  const [status, setStatus] = useState<LocationStatus>('undetermined');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (): Promise<Coords | null> => {
    setLoading(true);
    try {
      if (!(await isLocationServiceEnabled())) {
        setStatus('servicesDisabled');
        return null;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const next = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setCoords(next);
      return next;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const request = useCallback(async () => {
    const next = await requestForegroundPermission();
    setStatus(next);
    if (next === 'granted') await refresh();
    return next;
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const current = await readPermissionStatus();
      if (cancelled) return;
      setStatus(current);
      if (current === 'granted' && autoFetch) await refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [autoFetch, refresh]);

  return { status, coords, loading, request, refresh, openSettings: () => Linking.openSettings() };
}
