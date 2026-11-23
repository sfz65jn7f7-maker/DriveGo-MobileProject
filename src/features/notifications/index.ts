import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';

export const useNotifications = () =>
  useQuery({ queryKey: ['notifications'], queryFn: notificationService.list });

/** Nombre de notifications non lues (badge sur l'accueil). */
export const useUnreadCount = () => {
  const { data } = useNotifications();
  return data?.filter((n) => !n.read).length ?? 0;
};

export const useMarkRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export const useMarkAllRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
};

export { notify } from './alerts';
export type { AlertKind } from './alerts';
