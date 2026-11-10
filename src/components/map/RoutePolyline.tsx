import { Polyline } from 'react-native-maps';
import { useTheme } from '@/theme';
import type { Coords } from '@/types';

export function RoutePolyline({ coordinates }: { coordinates: Coords[] }) {
  const { colors } = useTheme();
  return <Polyline coordinates={coordinates} strokeColor={colors.primary} strokeWidth={5} />;
}
