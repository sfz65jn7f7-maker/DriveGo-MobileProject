import { useQuery } from '@tanstack/react-query';
import { rideService } from '@/services/ride.service';

export const useRideHistory = () =>
  useQuery({ queryKey: ['rides', 'history'], queryFn: rideService.getHistory });

export const usePlaceSearch = (query: string) =>
  useQuery({ queryKey: ['places', query], queryFn: () => rideService.searchPlaces(query) });

export const useRideOffers = (rideId: string) =>
  useQuery({ queryKey: ['rides', rideId, 'offers'], queryFn: () => rideService.getOffers(rideId) });
