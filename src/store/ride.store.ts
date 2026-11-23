import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DriverOffer, Place } from '@/types';

/**
 * Trajet en cours de préparation / en cours (état local).
 * Persisté : si l'app est fermée pendant une course, l'accueil propose de la reprendre.
 */
type RideState = {
  pickup: Place | null;
  destination: Place | null;
  proposedPrice: number | null;
  activeRideId: string | null;
  acceptedOffer: DriverOffer | null;
  setPickup: (p: Place | null) => void;
  setDestination: (p: Place | null) => void;
  setProposedPrice: (price: number | null) => void;
  setActiveRideId: (id: string | null) => void;
  setAcceptedOffer: (offer: DriverOffer | null) => void;
  reset: () => void;
};

const initial = {
  pickup: null,
  destination: null,
  proposedPrice: null,
  activeRideId: null,
  acceptedOffer: null,
};

export const useRideStore = create<RideState>()(
  persist(
    (set) => ({
      ...initial,
      setPickup: (pickup) => set({ pickup }),
      setDestination: (destination) => set({ destination }),
      setProposedPrice: (proposedPrice) => set({ proposedPrice }),
      setActiveRideId: (activeRideId) => set({ activeRideId }),
      setAcceptedOffer: (acceptedOffer) => set({ acceptedOffer }),
      reset: () => set(initial),
    }),
    { name: 'drivego-ride', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
