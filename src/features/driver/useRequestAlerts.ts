import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { notify } from '@/features/notifications';
import { ROUTES } from '@/constants/routes';
import { formatPrice } from '@/utils/format';
import { useIncomingRequests } from './driver.queries';
import { useDriverStore } from './driver.store';

/**
 * Chauffeur en ligne : surveille les demandes entrantes et sonne à chaque nouvelle demande.
 * Monté dans le layout chauffeur → actif quel que soit l'onglet affiché.
 */
export function useRequestAlerts() {
  const { t } = useTranslation();
  const online = useDriverStore((s) => s.online);
  const busy = useDriverStore((s) => !!s.activeRequest);
  const { data } = useIncomingRequests(online && !busy);
  const known = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!data) return;
    // Premier chargement : on mémorise les demandes existantes sans sonner
    if (!known.current) {
      known.current = new Set(data.map((r) => r.id));
      return;
    }
    const fresh = data.filter((r) => !known.current!.has(r.id));
    fresh.forEach((r) => known.current!.add(r.id));
    if (!online || busy || !fresh.length) return;
    const r = fresh[0];
    void notify({
      kind: 'request',
      title: t('alerts.newRequestTitle'),
      body: t('alerts.newRequestBody', { name: r.passengerName, price: formatPrice(r.proposedPrice), place: r.pickup.title }),
      url: ROUTES.driver.requests,
    });
  }, [data, online, busy, t]);
}
