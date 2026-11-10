import { delay } from '@/services/mocks/delay';
import { MOCK_WALLET } from '@/services/mocks/rides';
import type { Wallet } from '@/types';

export const walletService = {
  async getWallet(): Promise<Wallet> {
    await delay(400);
    return MOCK_WALLET;
  },
};
