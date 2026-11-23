import { create } from 'zustand';
import type { AlertKind } from './alerts';

export type InAppAlertData = {
  id: number;
  kind: AlertKind;
  title: string;
  body: string;
  /** Écran à ouvrir quand on touche la bannière */
  url?: string;
};

type AlertState = {
  current: InAppAlertData | null;
  show: (alert: Omit<InAppAlertData, 'id'>) => void;
  hide: () => void;
};

/** Bannière d'alerte in-app (une à la fois : la plus récente remplace la précédente). */
export const useAlertStore = create<AlertState>((set) => ({
  current: null,
  show: (alert) => set({ current: { ...alert, id: Date.now() } }),
  hide: () => set({ current: null }),
}));
