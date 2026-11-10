import { useQuery } from '@tanstack/react-query';
import { carpoolService } from '@/services/carpool.service';

export const useCarpoolSearch = (params: { from?: string; to?: string }) =>
  useQuery({ queryKey: ['carpool', 'search', params], queryFn: () => carpoolService.searchTrips(params) });

export const useMyCarpoolTrips = () =>
  useQuery({ queryKey: ['carpool', 'mine'], queryFn: carpoolService.getMyTrips });
