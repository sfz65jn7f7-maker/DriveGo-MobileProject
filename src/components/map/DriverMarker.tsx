import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, shadows } from '@/theme';
import type { Coords } from '@/types';

type Props = { coordinate: Coords; title?: string };

/** Marqueur mémorisé : pas de re-render inutile de la carte. */
export const DriverMarker = memo(function DriverMarker({ coordinate, title }: Props) {
  const { colors } = useTheme();
  return (
    <Marker coordinate={coordinate} title={title} tracksViewChanges={false} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={[styles.bubble, { backgroundColor: colors.primary }, shadows.sm]}>
        <Ionicons name="car" size={18} color={colors.onPrimary} />
      </View>
    </Marker>
  );
});

const styles = StyleSheet.create({
  bubble: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
});
