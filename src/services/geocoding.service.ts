import { Platform } from 'react-native';
import type { Coords, Place } from '@/types';

/**
 * Géocodage réel basé sur OpenStreetMap (même source que la carte web) :
 * - Photon (komoot) : recherche « au fil de la frappe », biaisée autour d'une position ;
 * - Nominatim : solution de repli si Photon ne répond pas.
 * Services gratuits à usage raisonnable : la saisie est « debouncée » et les résultats mis en cache.
 * En production : passer par votre backend (cache + clé Google Places / Mapbox).
 */
const PHOTON = 'https://photon.komoot.io';
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const TIMEOUT_MS = 8000;
const LIMIT = 10;

type PhotonProps = {
  osm_id?: number;
  osm_type?: string;
  name?: string;
  street?: string;
  housenumber?: string;
  district?: string;
  locality?: string;
  city?: string;
  county?: string;
  state?: string;
  country?: string;
};
type PhotonResponse = {
  features: { geometry: { coordinates: [number, number] }; properties: PhotonProps }[];
};
type NominatimItem = {
  place_id: number;
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
};

/** Langues prises en charge par les données OSM ; l'arabe retombe sur le nom local (souvent arabe/français). */
const apiLang = (lang: string) => (['fr', 'en', 'de'].includes(lang) ? lang : 'default');

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      // Nominatim demande d'identifier l'application (ignoré par les navigateurs)
      headers: Platform.OS === 'web' ? undefined : { 'User-Agent': 'DriveGo/1.0 (app mobile étudiante)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

const unique = (parts: (string | undefined)[]) =>
  parts.filter((p, i, all): p is string => !!p && all.indexOf(p) === i);

function fromPhoton(f: PhotonResponse['features'][number]): Place {
  const p = f.properties;
  const [longitude, latitude] = f.geometry.coordinates;
  const street = p.street ? unique([p.housenumber, p.street]).join(' ') : undefined;
  const title = p.name ?? street ?? p.city ?? p.state ?? '—';
  const address = unique([p.name ? street : undefined, p.district ?? p.locality, p.city, p.state, p.country])
    .filter((part) => part !== title)
    .join(', ');
  return { id: `${p.osm_type ?? 'X'}${p.osm_id ?? `${latitude},${longitude}`}`, title, address, coords: { latitude, longitude } };
}

function fromNominatim(item: NominatimItem): Place {
  const [first, ...rest] = item.display_name.split(', ');
  return {
    id: `N${item.place_id}`,
    title: item.name || first,
    address: rest.join(', '),
    coords: { latitude: Number(item.lat), longitude: Number(item.lon) },
  };
}

/** Supprime les doublons (même nom au même endroit), fréquents dans OSM. */
function dedupe(places: Place[]) {
  const seen = new Set<string>();
  return places.filter((p) => {
    const key = `${p.title}|${p.coords.latitude.toFixed(3)}|${p.coords.longitude.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const geocodingService = {
  /** Recherche de lieux autour de `near` (position de l'utilisateur ou centre de la carte). */
  async search(query: string, near: Coords | null, lang = 'fr', signal?: AbortSignal): Promise<Place[]> {
    const q = encodeURIComponent(query.trim());
    const bias = near ? `&lat=${near.latitude}&lon=${near.longitude}&zoom=10&location_bias_scale=0.3` : '';
    try {
      const data = await getJson<PhotonResponse>(`${PHOTON}/api/?q=${q}&limit=${LIMIT}&lang=${apiLang(lang)}${bias}`, signal);
      return dedupe(data.features.map(fromPhoton));
    } catch (error) {
      if (signal?.aborted) throw error;
      // Repli : Nominatim, avec une zone de préférence de ±1° autour de la position
      const box = near
        ? `&viewbox=${near.longitude - 1},${near.latitude + 1},${near.longitude + 1},${near.latitude - 1}`
        : '';
      const data = await getJson<NominatimItem[]>(
        `${NOMINATIM}/search?q=${q}&format=jsonv2&limit=${LIMIT}&accept-language=${lang}${box}`,
        signal,
      );
      return dedupe(data.map(fromNominatim));
    }
  },

  /** Adresse d'une position (ex. « Ma position actuelle » → « Bd Mohammed V, Oujda »). */
  async reverse(coords: Coords, lang = 'fr'): Promise<Place | null> {
    try {
      const data = await getJson<PhotonResponse>(
        `${PHOTON}/reverse?lat=${coords.latitude}&lon=${coords.longitude}&limit=1&lang=${apiLang(lang)}`,
      );
      const feature = data.features[0];
      return feature ? { ...fromPhoton(feature), coords } : null;
    } catch {
      return null;
    }
  },
};
