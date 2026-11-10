import { useQuery } from '@tanstack/react-query';
import { walletService } from '@/services/wallet.service';

export const useWallet = () => useQuery({ queryKey: ['wallet'], queryFn: walletService.getWallet });
