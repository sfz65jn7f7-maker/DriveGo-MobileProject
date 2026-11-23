import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type MapView from 'react-native-maps';
import { AppMap } from '@/components/map/AppMap';
import { DriverMarker } from '@/components/map/DriverMarker';
import { PlaceMarker } from '@/components/map/PlaceMarker';
import { RoutePolyline } from '@/components/map/RoutePolyline';
import type { Coords } from '@/types';
import { regionFor } from '@/utils/geo';

type Props = {
  pickup: Coords;
  destination?: Coords;
  driver?: Coords | null;
  /** Trace la ligne départ → arrivée */
  showRoute?: boolean;
};

/** Carte d'une course : départ, arrivée, chauffeur. Cadre tous les points une fois à l'ouverture. */
export const RideMap = forwardRef<MapView | null, Props>(function RideMap(
  { pickup, destination, driver, showRoute = false },
  ref,
) {
  const mapRef = useRef<MapView>(null);
  useImperativeHandle(ref, () => mapRef.current as MapView);

  useEffect(() => {
    const points = [pickup, destination, driver].filter(Boolean) as Coords[];
    // Petit délai : la carte native doit être montée avant d'animer
    const id = setTimeout(() => mapRef.current?.animateToRegion(regionFor(points), 500), 300);
    return () => clearTimeout(id);
    // Cadrage initial uniquement : on ne suit pas chaque déplacement du chauffeur
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppMap ref={mapRef} initialRegion={regionFor([pickup, ...(destination ? [destination] : [])])}>
      <PlaceMarker coordinate={pickup} kind="pickup" />
      {destination ? <PlaceMarker coordinate={destination} kind="destination" /> : null}
      {showRoute && destination ? <RoutePolyline coordinates={[pickup, destination]} /> : null}
      {driver ? <DriverMarker coordinate={driver} /> : null}
    </AppMap>
  );
});
