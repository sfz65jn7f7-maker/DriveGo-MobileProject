import { create } from 'zustand';
import { secureStorage } from '@/services/storage';
import type { Role, User } from '@/types';

const TOKEN_KEY = 'drivego.token';
const USER_KEY = 'drivego.user';

type AuthState = {
  user: User | null;
  token: string | null;
  /**
   * Rôle actuellement actif. V1 : toujours égal à user.role.
   * Prévu pour évoluer vers un compte à deux rôles (mode passager / chauffeur basculable).
   */
  activeRole: Role | null;
  /** true quand le token a fini d'être lu au démarrage */
  isReady: boolean;

  hydrate: () => Promise<void>;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (patch: Partial<User>) => Promise<void>;
  setActiveRole: (role: Role) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  activeRole: null,
  isReady: false,

  hydrate: async () => {
    try {
      const [token, raw] = await Promise.all([
        secureStorage.get(TOKEN_KEY),
        secureStorage.get(USER_KEY),
      ]);
      if (token && raw) {
        const user = JSON.parse(raw) as User;
        set({ user, token, activeRole: user.role });
      }
    } catch {
      // session illisible : on démarre déconnecté
    } finally {
      set({ isReady: true });
    }
  },

  login: async (user, token) => {
    await secureStorage.set(TOKEN_KEY, token);
    await secureStorage.set(USER_KEY, JSON.stringify(user));
    set({ user, token, activeRole: user.role });
  },

  logout: async () => {
    await secureStorage.remove(TOKEN_KEY);
    await secureStorage.remove(USER_KEY);
    set({ user: null, token: null, activeRole: null });
  },

  updateUser: async (patch) => {
    const current = get().user;
    if (!current) return;
    const user = { ...current, ...patch };
    await secureStorage.set(USER_KEY, JSON.stringify(user));
    set({ user });
  },

  setActiveRole: (activeRole) => set({ activeRole }),
}));
