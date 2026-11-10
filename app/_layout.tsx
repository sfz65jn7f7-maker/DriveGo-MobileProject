import '@/i18n';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '@/theme';
import { useAuthStore } from '@/features/auth/auth.store';
import { useSettingsStore } from '@/features/settings/settings.store';
import { AppFrame } from '@/components/common/AppFrame';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

/** UNIQUE point de décision du rôle : le groupe de pages affiché dépend de l'état d'authentification. */
function RootNavigator() {
  const { isDark } = useTheme();
  const user = useAuthStore((s) => s.user);
  const activeRole = useAuthStore((s) => s.activeRole);
  const authReady = useAuthStore((s) => s.isReady);
  const settingsReady = useSettingsStore((s) => s.isHydrated);

  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  const ready = authReady && settingsReady;
  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const isLoggedOut = !user;
  const isPassenger = !!user && activeRole === 'passenger';
  const isDriver = !!user && activeRole === 'driver' && user.driverStatus === 'approved';
  const isDriverPending = !!user && activeRole === 'driver' && user.driverStatus !== 'approved';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'auto'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />

        <Stack.Protected guard={isLoggedOut}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={isPassenger}>
          <Stack.Screen name="(passenger)" />
          <Stack.Screen name="ride" />
        </Stack.Protected>

        <Stack.Protected guard={isDriver}>
          <Stack.Screen name="(driver)" />
        </Stack.Protected>

        <Stack.Protected guard={isDriverPending}>
          <Stack.Screen name="pending-validation" />
        </Stack.Protected>

        {/* Pages communes aux deux rôles */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="carpool" />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="notifications" />
          <Stack.Screen name="wallet" />
          <Stack.Screen name="help" />
          <Stack.Screen name="settings" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AppFrame>
              <RootNavigator />
            </AppFrame>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}