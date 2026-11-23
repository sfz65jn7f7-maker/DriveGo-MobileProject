import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';
import type { DocumentType } from '@/types';

/** `poll` : interroge régulièrement le serveur (chauffeur en ligne). */
export const useIncomingRequests = (poll = false) =>
  useQuery({
    queryKey: ['driver', 'requests'],
    queryFn: driverService.getIncomingRequests,
    refetchInterval: poll ? 10_000 : false,
  });

export const useEarnings = () =>
  useQuery({ queryKey: ['driver', 'earnings'], queryFn: driverService.getEarnings });

export const useDocuments = () =>
  useQuery({ queryKey: ['driver', 'documents'], queryFn: driverService.getDocuments });

export const useAcceptRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => driverService.acceptRequest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['driver', 'requests'] }),
  });
};

export const useCounterOffer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, price }: { id: string; price: number }) => driverService.counterOffer(id, price),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['driver', 'requests'] }),
  });
};

export const useDeclineRequest = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => driverService.declineRequest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['driver', 'requests'] }),
  });
};

export const useUploadDocument = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (type: DocumentType) => driverService.uploadDocument(type),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['driver', 'documents'] }),
  });
};
