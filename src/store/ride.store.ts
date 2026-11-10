import { create } from 'zustand';
import type { Place } from '@/types';

/** Trajet en cours de préparation / en cours (état local, pas de données serveur). */
type RideState = {
  pickup: Place | null;
  destination: Place | null;
  proposedPrice: number | null;
  activeRideId: string | null;
  setPickup: (p: Place | null) => void;
  setDestination: (p: Place | null) => void;
  setProposedPrice: (price: number | null) => void;
  setActiveRideId: (id: string | null) => void;
  reset: () => void;
};

export const useRideStore = create<RideState>((set) => ({
  pickup: null,
  destination: null,
  proposedPrice: null,
  activeRideId: null,
  setPickup: (pickup) => set({ pickup }),
  setDestination: (destination) => set({ destination }),
  setProposedPrice: (proposedPrice) => set({ proposedPrice }),
  setActiveRideId: (activeRideId) => set({ activeRideId }),
  reset: () => set({ pickup: null, destination: null, proposedPrice: null, activeRideId: null }),
}));
