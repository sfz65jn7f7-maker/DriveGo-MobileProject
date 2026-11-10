import { useAuthStore } from '@/features/auth/auth.store';

/** Un chauffeur non validé ne peut ni passer en ligne ni recevoir de demandes. */
export function useDriverGate() {
  const status = useAuthStore((s) => s.user?.driverStatus);
  return { status, isApproved: status === 'approved' };
}
