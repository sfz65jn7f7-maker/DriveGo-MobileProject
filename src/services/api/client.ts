import { config } from '@/constants/config';
import { useAuthStore } from '@/features/auth/auth.store';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

/** Client HTTP unique : base URL, token et gestion d'erreurs centralisés. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const response = await fetch(`${config.apiUrl}${path}`, {
    method: options.method ?? 'GET',
    signal: options.signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    void useAuthStore.getState().logout();
  }
  if (!response.ok) {
    throw new ApiError(`Erreur ${response.status}`, response.status);
  }
  return (await response.json()) as T;
}
