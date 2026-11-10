import { forwardRef } from 'react';
import { Platform, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import type { Region } from 'react-native-maps';
import { DEFAULT_REGION } from '@/constants/config';
import { darkMapStyle, useTheme } from '@/theme';

type Props = {
  initialRegion?: Region;
  showsUserLocation?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/** Carte unique de l'appli : style sombre automatique en mode sombre. */
export const AppMap = forwardRef<MapView, Props>(function AppMap(
  { initialRegion = DEFAULT_REGION, showsUserLocation = true, style, children },
  ref,
) {
  const { isDark } = useTheme();
  return (
    <MapView
      ref={ref}
      style={[styles.map, style]}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      customMapStyle={isDark ? darkMapStyle : undefined}
      initialRegion={initialRegion}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
      toolbarEnabled={false}
    >
      {children}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});