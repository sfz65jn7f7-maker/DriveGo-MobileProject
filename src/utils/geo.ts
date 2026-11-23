import type { Coords } from '@/types';

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Distance à vol d'oiseau en km (formule de Haversine). */
export function distanceKm(a: Coords, b: Coords): number {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance routière approximative (≈ 1,3 × vol d'oiseau). */
export const roadDistanceKm = (a: Coords, b: Coords) => distanceKm(a, b) * 1.3;

/** Durée estimée en ville (≈ 25 km/h de moyenne), minimum 3 min. */
export const estimateMinutes = (km: number) => Math.max(3, Math.round((km / 25) * 60));

/** Prix conseillé : prise en charge + prix au km, arrondi à 5 MAD. */
export const suggestedPrice = (km: number) => Math.max(15, Math.round((10 + km * 4) / 5) * 5);

/** Point intermédiaire entre a et b (t entre 0 et 1). */
export function interpolate(a: Coords, b: Coords, t: number): Coords {
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  };
}

/** Point décalé de quelques centaines de mètres (position de départ simulée d'un chauffeur). */
export const offset = (c: Coords, dLat = 0.012, dLon = -0.01): Coords => ({
  latitude: c.latitude + dLat,
  longitude: c.longitude + dLon,
});

/** Région qui englobe tous les points, avec une marge. */
export function regionFor(points: Coords[]) {
  const lats = points.map((p) => p.latitude);
  const lons = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.max(0.01, (maxLat - minLat) * 1.8),
    longitudeDelta: Math.max(0.01, (maxLon - minLon) * 1.8),
  };
}
