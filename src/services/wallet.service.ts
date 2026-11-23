import { delay } from '@/services/mocks/delay';
import { MOCK_TRANSACTIONS, MOCK_WALLET } from '@/services/mocks/rides';
import type { Transaction, Wallet } from '@/types';

let wallet: Wallet = { ...MOCK_WALLET };
let transactions: Transaction[] = [...MOCK_TRANSACTIONS];

export const walletService = {
  async getWallet(): Promise<Wallet> {
    await delay(400);
    return wallet;
  },

  async getTransactions(): Promise<Transaction[]> {
    await delay(400);
    return transactions;
  },

  async topUp(amount: number, label: string): Promise<Wallet> {
    await delay(800);
    wallet = { ...wallet, balance: wallet.balance + amount };
    transactions = [
      { id: `tx_${Date.now()}`, type: 'topup', label, amount, createdAt: new Date().toISOString() },
      ...transactions,
    ];
    return wallet;
  },
};
