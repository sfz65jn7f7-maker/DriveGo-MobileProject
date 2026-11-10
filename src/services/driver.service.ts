import { delay } from '@/services/mocks/delay';
import { MOCK_EARNINGS, MOCK_REQUESTS } from '@/services/mocks/rides';
import type { Earnings, RideRequest } from '@/types';

export const driverService = {
  async getIncomingRequests(): Promise<RideRequest[]> {
    await delay(600);
    return MOCK_REQUESTS;
  },

  async getEarnings(): Promise<Earnings> {
    await delay();
    return MOCK_EARNINGS;
  },
};
