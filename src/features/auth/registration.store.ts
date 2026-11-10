import { create } from 'zustand';

/** Données temporaires du parcours d'inscription (non persistées). */
type RegistrationState = {
  name: string;
  phone: string;
  password: string;
  setData: (data: { name: string; phone: string; password: string }) => void;
  clear: () => void;
};

export const useRegistrationStore = create<RegistrationState>((set) => ({
  name: '',
  phone: '',
  password: '',
  setData: (data) => set(data),
  clear: () => set({ name: '', phone: '', password: '' }),
}));
