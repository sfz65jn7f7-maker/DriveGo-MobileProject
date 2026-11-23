import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rideService } from '@/services/ride.service';
import { geocodingService } from '@/services/geocoding.service';
import type { Coords, DriverOffer, Place } from '@/types';

export const useRideHistory = () =>
  useQuery({ queryKey: ['rides', 'history'], queryFn: rideService.getHistory });

export const useRide = (id: string | undefined) =>
  useQuery({ queryKey: ['rides', id], queryFn: () => rideService.getRide(id!), enabled: !!id });

/**
 * Recherche de lieux réelle (OpenStreetMap), biaisée autour de `near`.
 * Position arrondie à ~1 km dans la clé de cache : les petites variations GPS ne relancent pas la requête.
 */
export const usePlaceSearch = (query: string, near: Coords | null, lang: string) => {
  const q = query.trim();
  const around = near ? [Number(near.latitude.toFixed(2)), Number(near.longitude.toFixed(2))] : null;
  return useQuery({
    queryKey: ['places', q.toLowerCase(), around, lang],
    queryFn: ({ signal }) => geocodingService.search(q, near, lang, signal),
    enabled: q.length >= 2,
    staleTime: 5 * 60_000,
    retry: 1,
  });
};

/** Adresse de la position actuelle. */
export const useReverseGeocode = (coords: Coords | null, lang: string) => {
  const around = coords ? [Number(coords.latitude.toFixed(3)), Number(coords.longitude.toFixed(3))] : null;
  return useQuery({
    queryKey: ['reverse', around, lang],
    queryFn: () => geocodingService.reverse(coords!, lang),
    enabled: !!coords,
    staleTime: 10 * 60_000,
  });
};

export const useRideOffers = (rideId: string) =>
  useQuery({
    queryKey: ['rides', rideId, 'offers'],
    queryFn: () => rideService.getOffers(rideId),
    enabled: !!rideId,
  });

export const useCreateRide = () =>
  useMutation({
    mutationFn: (input: { pickup: Place; destination: Place; price: number }) => rideService.createRide(input),
  });

export const useAcceptOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ rideId, offer }: { rideId: string; offer: DriverOffer }) => rideService.acceptOffer(rideId, offer),
    onSuccess: (ride) => qc.setQueryData(['rides', ride.id], ride),
  });
};

export const useCancelRide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rideId: string) => rideService.cancelRide(rideId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rides'] }),
  });
};

export const useRateRide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ rideId, rating, comment }: { rideId: string; rating: number; comment?: string }) =>
      rideService.rateRide(rideId, rating, comment),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rides'] }),
  });
};
