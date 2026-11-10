import { delay } from '@/services/mocks/delay';
import { MOCK_OFFERS, MOCK_PLACES, MOCK_RIDES } from '@/services/mocks/rides';
import type { DriverOffer, Place, Ride } from '@/types';

export const rideService = {
  async searchPlaces(query: string): Promise<Place[]> {
    await delay(300);
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_PLACES;
    return MOCK_PLACES.filter((p) => `${p.title} ${p.address}`.toLowerCase().includes(q));
  },

  async getOffers(_rideId: string): Promise<DriverOffer[]> {
    await delay(800);
    return MOCK_OFFERS;
  },

  async getHistory(): Promise<Ride[]> {
    await delay();
    return MOCK_RIDES;
  },

  async getRide(id: string): Promise<Ride | undefined> {
    await delay(300);
    return MOCK_RIDES.find((r) => r.id === id);
  },
};
