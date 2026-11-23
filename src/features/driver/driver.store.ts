import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { RideRequest } from '@/types';

type DriverState = {
  /** Mémorisé : le chauffeur reste en ligne après un redémarrage de l'app. */
  online: boolean;
  /** Course acceptée en cours (côté chauffeur). */
  activeRequest: RideRequest | null;
  setOnline: (online: boolean) => void;
  setActiveRequest: (request: RideRequest | null) => void;
};

export const useDriverStore = create<DriverState>()(
  persist(
    (set) => ({
      online: false,
      activeRequest: null,
      setOnline: (online) => set({ online }),
      setActiveRequest: (activeRequest) => set({ activeRequest }),
    }),
    { name: 'drivego-driver', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
