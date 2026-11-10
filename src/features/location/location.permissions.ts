import * as Location from 'expo-location';

export type LocationStatus =
  | 'undetermined'
  | 'granted'
  | 'denied' // refusée mais on peut redemander
  | 'blocked' // refus définitif : ouvrir les réglages du téléphone
  | 'servicesDisabled'; // GPS éteint

type Permission = Location.LocationPermissionResponse;

function toStatus(p: Permission): LocationStatus {
  if (p.granted) return 'granted';
  if (p.status === Location.PermissionStatus.UNDETERMINED) return 'undetermined';
  return p.canAskAgain ? 'denied' : 'blocked';
}

export async function readPermissionStatus(): Promise<LocationStatus> {
  return toStatus(await Location.getForegroundPermissionsAsync());
}

export async function requestForegroundPermission(): Promise<LocationStatus> {
  return toStatus(await Location.requestForegroundPermissionsAsync());
}

export const isLocationServiceEnabled = () => Location.hasServicesEnabledAsync();
