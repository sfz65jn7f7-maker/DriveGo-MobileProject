import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { useTheme, shadows } from '@/theme';
import type { Coords } from '@/types';

type Props = { coordinate: Coords; kind: 'pickup' | 'destination'; title?: string };

/** Point de départ (rond) ou d'arrivée (carré), comme dans les applis VTC. */
export const PlaceMarker = memo(function PlaceMarker({ coordinate, kind, title }: Props) {
  const { colors } = useTheme();
  const color = kind === 'pickup' ? colors.primary : colors.text;
  return (
    <Marker coordinate={coordinate} title={title} tracksViewChanges={false} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={[styles.outer, { backgroundColor: colors.surfaceElevated }, shadows.sm]}>
        <View style={[styles.inner, { backgroundColor: color }, kind === 'destination' && styles.square]} />
      </View>
    </Marker>
  );
});

const styles = StyleSheet.create({
  outer: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 12, height: 12, borderRadius: 6 },
  square: { borderRadius: 2 },
});
