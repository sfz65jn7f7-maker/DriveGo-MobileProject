import { Stack } from 'expo-router';

/** Parcours de course : pas de barre d'onglets (écrans plein écran). */
export default function RideLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tracking" options={{ gestureEnabled: false }} />
      <Stack.Screen name="in-progress" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
