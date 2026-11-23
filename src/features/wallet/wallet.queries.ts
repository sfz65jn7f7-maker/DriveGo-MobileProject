import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { walletService } from '@/services/wallet.service';

export const useWallet = () => useQuery({ queryKey: ['wallet'], queryFn: walletService.getWallet });

export const useTransactions = () =>
  useQuery({ queryKey: ['wallet', 'transactions'], queryFn: walletService.getTransactions });

export const useTopUp = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, label }: { amount: number; label: string }) => walletService.topUp(amount, label),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallet'] }),
  });
};
