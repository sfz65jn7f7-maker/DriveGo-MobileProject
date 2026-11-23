import { QueryClient } from '@tanstack/react-query';

/** Client unique, exporté pour que les services (ex. alertes) puissent rafraîchir le cache. */
export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});
