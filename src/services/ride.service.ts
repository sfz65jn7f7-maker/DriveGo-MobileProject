import { delay } from '@/services/mocks/delay';
import { MOCK_OFFERS, MOCK_RIDES } from '@/services/mocks/rides';
import type { DriverOffer, Place, Ride } from '@/types';
import { estimateMinutes, roadDistanceKm } from '@/utils/geo';

/** Historique en mémoire : les courses créées pendant la session s'y ajoutent. */
let rides: Ride[] = [...MOCK_RIDES];

const update = (id: string, patch: Partial<Ride>): Ride | undefined => {
  rides = rides.map((r) => (r.id === id ? { ...r, ...patch } : r));
  return rides.find((r) => r.id === id);
};

export const rideService = {
  async createRide(input: { pickup: Place; destination: Place; price: number }): Promise<Ride> {
    await delay(400);
    const distanceKm = roadDistanceKm(input.pickup.coords, input.destination.coords);
    const ride: Ride = {
      id: `r_${Date.now()}`,
      ...input,
      status: 'searching',
      createdAt: new Date().toISOString(),
      distanceKm,
      durationMinutes: estimateMinutes(distanceKm),
    };
    rides = [ride, ...rides];
    return ride;
  },

  /** Mock : les chauffeurs répondent autour du prix proposé par le passager. */
  async getOffers(rideId: string): Promise<DriverOffer[]> {
    await delay(1500);
    const base = rides.find((r) => r.id === rideId)?.price;
    if (!base) return MOCK_OFFERS;
    const factors = [1, 1.1, 0.95];
    return MOCK_OFFERS.map((o, i) => ({ ...o, price: Math.round((base * factors[i]) / 5) * 5 || base }));
  },

  async acceptOffer(rideId: string, offer: DriverOffer): Promise<Ride> {
    await delay(500);
    const ride = update(rideId, {
      status: 'driver_assigned',
      price: offer.price,
      driver: offer.driver,
      driverName: offer.driver.name,
    });
    if (!ride) throw new Error('Ride not found');
    return ride;
  },

  async setStatus(rideId: string, status: Ride['status']): Promise<void> {
    update(rideId, { status });
  },

  async cancelRide(rideId: string): Promise<void> {
    await delay(300);
    update(rideId, { status: 'cancelled' });
  },

  async rateRide(rideId: string, rating: number, _comment?: string): Promise<void> {
    await delay(400);
    update(rideId, { rating });
  },

  async getHistory(): Promise<Ride[]> {
    await delay();
    return rides.filter((r) => r.status === 'completed' || r.status === 'cancelled');
  },

  /** null (et non undefined) : TanStack Query refuse les données undefined. */
  async getRide(id: string): Promise<Ride | null> {
    await delay(300);
    return rides.find((r) => r.id === id) ?? null;
  },
};
