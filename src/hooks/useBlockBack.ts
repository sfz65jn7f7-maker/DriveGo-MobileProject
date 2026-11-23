import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Bloque le bouton retour Android (course en cours…).
 * `onBack` est appelé à la place, par exemple pour proposer d'annuler.
 */
export function useBlockBack(onBack?: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack?.();
      return true;
    });
    return () => sub.remove();
  }, [onBack, enabled]);
}
