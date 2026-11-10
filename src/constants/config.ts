export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  useMocks: (process.env.EXPO_PUBLIC_USE_MOCKS ?? 'true') === 'true',
  googleMapsKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
} as const;

/** Région affichée tant que la position de l'utilisateur est inconnue (Casablanca) */
export const DEFAULT_REGION = {
  latitude: 33.5731,
  longitude: -7.5898,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};
