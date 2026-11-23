import { Stack } from 'expo-router';

/**
 * Parcours de course : pas de barre d'onglets (écrans plein écran).
 * Les écrans « course engagée » bloquent le geste retour (annulation via un bouton avec confirmation).
 */
export default function RideLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search-destination" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="offers" options={{ gestureEnabled: false }} />
      <Stack.Screen name="tracking" options={{ gestureEnabled: false }} />
      <Stack.Screen name="in-progress" options={{ gestureEnabled: false }} />
      <Stack.Screen name="completed" options={{ gestureEnabled: false, animation: 'fade' }} />
    </Stack>
  );
}
