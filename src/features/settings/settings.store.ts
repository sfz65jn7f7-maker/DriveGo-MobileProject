import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { applyLanguage } from '@/i18n';
import type { Language } from '@/i18n';

export type ThemeMode = 'light' | 'dark' | 'system';
export type NavigationApp = 'builtin' | 'google' | 'waze';
export type PaymentMethod = 'cash' | 'card';

type NotificationPrefs = {
  push: boolean;
  rides: boolean;
  messages: boolean;
  promotions: boolean;
  sound: boolean;
};

type DriverPrefs = {
  maxDistanceKm: number;
  alertSound: boolean;
  navigationApp: NavigationApp;
  backgroundTracking: boolean;
};

type SettingsState = {
  themeMode: ThemeMode;
  language: Language;
  currency: 'MAD';
  distanceUnit: 'km';
  notifications: NotificationPrefs;
  driverPrefs: DriverPrefs;
  autoShareTrip: boolean;
  defaultPayment: PaymentMethod;
  onboardingDone: boolean;
  /** true quand les préférences ont fini d'être lues depuis le stockage */
  isHydrated: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  setLanguage: (language: Language) => void;
  setNotification: (key: keyof NotificationPrefs, value: boolean) => void;
  setDriverPref: <K extends keyof DriverPrefs>(key: K, value: DriverPrefs[K]) => void;
  setAutoShareTrip: (value: boolean) => void;
  setDefaultPayment: (value: PaymentMethod) => void;
  setOnboardingDone: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'system',
      language: 'fr',
      currency: 'MAD',
      distanceUnit: 'km',
      notifications: { push: true, rides: true, messages: true, promotions: false, sound: true },
      driverPrefs: {
        maxDistanceKm: 10,
        alertSound: true,
        navigationApp: 'builtin',
        backgroundTracking: false,
      },
      autoShareTrip: false,
      defaultPayment: 'cash',
      onboardingDone: false,
      isHydrated: false,

      setThemeMode: (themeMode) => set({ themeMode }),
      setLanguage: (language) => {
        applyLanguage(language);
        set({ language });
      },
      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),
      setDriverPref: (key, value) =>
        set((s) => ({ driverPrefs: { ...s.driverPrefs, [key]: value } })),
      setAutoShareTrip: (autoShareTrip) => set({ autoShareTrip }),
      setDefaultPayment: (defaultPayment) => set({ defaultPayment }),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
    }),
    {
      name: 'drivego-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        themeMode: s.themeMode,
        language: s.language,
        notifications: s.notifications,
        driverPrefs: s.driverPrefs,
        autoShareTrip: s.autoShareTrip,
        defaultPayment: s.defaultPayment,
        onboardingDone: s.onboardingDone,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) applyLanguage(state.language);
        useSettingsStore.setState({ isHydrated: true });
      },
    },
  ),
);
