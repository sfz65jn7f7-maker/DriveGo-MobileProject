import { delay } from '@/services/mocks/delay';
import { MOCK_TRIPS } from '@/services/mocks/carpool';
import type { CarpoolTrip } from '@/types';

export const carpoolService = {
  async searchTrips(params: { from?: string; to?: string }): Promise<CarpoolTrip[]> {
    await delay();
    const from = params.from?.trim().toLowerCase();
    const to = params.to?.trim().toLowerCase();
    return MOCK_TRIPS.filter(
      (t) =>
        (!from || t.from.toLowerCase().includes(from)) && (!to || t.to.toLowerCase().includes(to)),
    );
  },

  async getTrip(id: string): Promise<CarpoolTrip | undefined> {
    await delay(300);
    return MOCK_TRIPS.find((t) => t.id === id);
  },

  async getMyTrips(): Promise<CarpoolTrip[]> {
    await delay();
    return MOCK_TRIPS.slice(0, 1);
  },
};
