import { useEffect, useState } from 'react';
import type { Coords } from '@/types';
import { interpolate } from '@/utils/geo';

/**
 * Simule un véhicule qui se déplace de `from` vers `to` en `durationMs`.
 * À remplacer par la position temps réel envoyée par le backend (WebSocket).
 */
export function useRouteSimulation(
  from: Coords | null | undefined,
  to: Coords | null | undefined,
  durationMs: number,
  enabled = true,
) {
  // La progression est rattachée à un « trajet » : si départ/arrivée changent, elle repart de 0.
  const key = from && to ? `${from.latitude},${from.longitude}>${to.latitude},${to.longitude}` : '';
  const [state, setState] = useState({ key: '', progress: 0 });

  useEffect(() => {
    if (!enabled || !key) return;
    const startedAt = Date.now();
    const id = setInterval(() => {
      const progress = Math.min(1, (Date.now() - startedAt) / durationMs);
      setState({ key, progress });
      if (progress >= 1) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, [enabled, key, durationMs]);

  const progress = state.key === key ? state.progress : 0;
  const position = from && to ? interpolate(from, to, progress) : null;
  return { position, progress, done: progress >= 1 };
}
