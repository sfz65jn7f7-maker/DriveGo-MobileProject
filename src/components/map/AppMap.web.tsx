import { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { DEFAULT_REGION } from '@/constants/config';
import { useTheme } from '@/theme';

type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };

type Props = {
  initialRegion?: Region;
  showsUserLocation?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** Version web de la carte (OpenStreetMap). Le mobile garde AppMap.tsx. */
export const AppMap = forwardRef<unknown, Props>(function AppMap(
  { initialRegion = DEFAULT_REGION, style },
  ref,
) {
  const { isDark } = useTheme();
  const [region, setRegion] = useState<Region>(initialRegion);
  const [hasFix, setHasFix] = useState(false);
  const [mapRevision, setMapRevision] = useState(0);

  // Même méthode que la carte mobile : le bouton « recentrer » continue de fonctionner
  useImperativeHandle(
    ref,
    () => ({
      animateToRegion: (next: Region) => {
        setRegion(next);
        setHasFix(true);
        setMapRevision((revision) => revision + 1);
      },
    }),
    [],
  );

  const { latitude, longitude, latitudeDelta, longitudeDelta } = region;
  const bbox = [
    longitude - longitudeDelta / 2,
    latitude - latitudeDelta / 2,
    longitude + longitudeDelta / 2,
    latitude + latitudeDelta / 2,
  ].join(',');
  const marker = hasFix ? `&marker=${latitude},${longitude}` : '';
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik${marker}`;

  return (
    <View style={[styles.fill, style]}>
      <iframe
        key={mapRevision}
        title="Carte"
        src={src}
        style={{
          border: 0,
          width: '100%',
          height: '100%',
          filter: isDark ? 'invert(0.92) hue-rotate(180deg)' : 'none',
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});