import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Place } from '@/types';

const MAX_RECENT = 8;

/** Lieux récemment choisis (suggestions quand le champ de recherche est vide + raccourcis de l'accueil). */
type PlacesState = {
  recent: Place[];
  addRecent: (place: Place) => void;
  clearRecent: () => void;
};

export const usePlacesStore = create<PlacesState>()(
  persist(
    (set) => ({
      recent: [],
      addRecent: (place) =>
        set((s) => ({
          recent: [place, ...s.recent.filter((p) => p.id !== place.id)].slice(0, MAX_RECENT),
        })),
      clearRecent: () => set({ recent: [] }),
    }),
    { name: 'drivego-places', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
