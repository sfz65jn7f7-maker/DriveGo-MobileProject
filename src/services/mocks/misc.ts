import type { AppNotification, ChatMessage, DriverDocument } from '@/types';
import { minutesAgo } from '@/utils/date';

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n1', type: 'ride', title: 'Course terminée', body: 'Merci d’avoir voyagé avec Karim B. Notez votre trajet.', createdAt: minutesAgo(35), read: false },
  { id: 'n2', type: 'promo', title: '-20 % ce week-end', body: 'Profitez de -20 % sur vos covoiturages vers Marrakech.', createdAt: minutesAgo(60 * 5), read: false },
  { id: 'n3', type: 'carpool', title: 'Réservation confirmée', body: 'Votre place Casablanca → Rabat est confirmée.', createdAt: minutesAgo(60 * 26), read: true },
  { id: 'n4', type: 'system', title: 'Bienvenue sur Drive Go!', body: 'Complétez votre profil pour voyager en toute sérénité.', createdAt: minutesAgo(60 * 24 * 6), read: true },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', from: 'them', text: 'Bonjour, je suis en route 🚗', createdAt: minutesAgo(4) },
  { id: 'm2', from: 'me', text: 'Parfait, je vous attends devant l’entrée.', createdAt: minutesAgo(3) },
];

export const AUTO_REPLIES = ['D’accord 👍', 'J’arrive dans quelques minutes.', 'Merci !', 'Je suis devant.'];

export const MOCK_DOCUMENTS: DriverDocument[] = [
  { type: 'license', status: 'approved', updatedAt: minutesAgo(60 * 24 * 30) },
  { type: 'registration', status: 'approved', updatedAt: minutesAgo(60 * 24 * 30) },
  { type: 'insurance', status: 'pending', updatedAt: minutesAgo(60 * 24 * 2) },
  { type: 'idCard', status: 'missing' },
];
