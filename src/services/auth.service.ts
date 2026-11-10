import { config } from '@/constants/config';
import { apiRequest } from '@/services/api/client';
import { delay } from '@/services/mocks/delay';
import { MOCK_USERS } from '@/services/mocks/users';
import type { AuthSession, Role, User } from '@/types';

const normalize = (phone: string) => phone.replace(/\s/g, '').replace(/^\+212/, '0');

export const authService = {
  async login(phone: string, password: string): Promise<AuthSession> {
    if (!config.useMocks) {
      return apiRequest<AuthSession>('/auth/login', { method: 'POST', body: { phone, password } });
    }
    await delay();
    const user = MOCK_USERS.find((u) => u.phone === normalize(phone)) ?? MOCK_USERS[0];
    return { user, token: `mock-token-${user.id}` };
  },

  /** Connexion rapide pour les tests (mock uniquement). */
  async loginAs(userId: string): Promise<AuthSession> {
    await delay(200);
    const user = MOCK_USERS.find((u) => u.id === userId) ?? MOCK_USERS[0];
    return { user, token: `mock-token-${user.id}` };
  },

  async register(input: { name: string; phone: string; password: string; role: Role }): Promise<AuthSession> {
    if (!config.useMocks) {
      return apiRequest<AuthSession>('/auth/register', { method: 'POST', body: input });
    }
    await delay();
    const user: User = {
      id: `u_${Date.now()}`,
      name: input.name,
      phone: normalize(input.phone),
      role: input.role,
      driverStatus: input.role === 'driver' ? 'pending' : undefined,
    };
    return { user, token: `mock-token-${user.id}` };
  },

  /** Mock : le code valide est toujours 123456. */
  async verifyOtp(code: string): Promise<boolean> {
    await delay(400);
    return code === '123456';
  },

  async deleteAccount(): Promise<void> {
    await delay();
  },
};
