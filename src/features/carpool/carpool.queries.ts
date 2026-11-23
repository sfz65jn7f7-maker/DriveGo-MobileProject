import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { carpoolService } from '@/services/carpool.service';
import type { PublishTripInput, User } from '@/types';

type SearchParams = { from?: string; to?: string; date?: string; seats?: number };

export const useCarpoolSearch = (params: SearchParams) =>
  useQuery({ queryKey: ['carpool', 'search', params], queryFn: () => carpoolService.searchTrips(params) });

export const useCarpoolTrip = (id: string | undefined) =>
  useQuery({ queryKey: ['carpool', 'trip', id], queryFn: () => carpoolService.getTrip(id!), enabled: !!id });

export const useMyCarpoolTrips = () =>
  useQuery({ queryKey: ['carpool', 'mine'], queryFn: carpoolService.getMyTrips });

export const useMyBookings = () =>
  useQuery({ queryKey: ['carpool', 'bookings'], queryFn: carpoolService.getMyBookings });

export const useMyPublishedTrips = () =>
  useQuery({ queryKey: ['carpool', 'published'], queryFn: carpoolService.getMyPublishedTrips });

export const useBookSeats = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, seats }: { tripId: string; seats: number }) => carpoolService.bookSeats(tripId, seats),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['carpool'] }),
  });
};

export const useCancelBooking = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carpoolService.cancelBooking(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['carpool'] }),
  });
};

export const usePublishTrip = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ input, driver }: { input: PublishTripInput; driver: User | null }) =>
      carpoolService.publishTrip(input, driver),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['carpool'] }),
  });
};
