import { delay } from '@/services/mocks/delay';
import { MOCK_NOTIFICATIONS } from '@/services/mocks/misc';
import type { AppNotification } from '@/types';

let notifications: AppNotification[] = [...MOCK_NOTIFICATIONS];

export const notificationService = {
  async list(): Promise<AppNotification[]> {
    await delay(400);
    return notifications;
  },

  /** Ajoute une notification reçue pendant la session (alerte de course, nouvelle demande…). */
  add(input: Pick<AppNotification, 'type' | 'title' | 'body'>): void {
    notifications = [
      { ...input, id: `n_${Date.now()}`, createdAt: new Date().toISOString(), read: false },
      ...notifications,
    ];
  },

  async markRead(id: string): Promise<void> {
    notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  },

  async markAllRead(): Promise<void> {
    await delay(200);
    notifications = notifications.map((n) => ({ ...n, read: true }));
  },
};
