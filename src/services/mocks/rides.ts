import type { DriverOffer, Earnings, Ride, RideRequest, Place, Transaction, Wallet } from '@/types';
import { inDays, minutesAgo } from '@/utils/date';

export const MOCK_PLACES: Place[] = [
  { id: 'p1', title: 'Morocco Mall', address: 'Bd de la Corniche, Casablanca', coords: { latitude: 33.5764, longitude: -7.7003 } },
  { id: 'p2', title: 'Gare Casa-Voyageurs', address: 'Bd Mohammed V, Casablanca', coords: { latitude: 33.5896, longitude: -7.5909 } },
  { id: 'p3', title: 'Aéroport Mohammed V', address: 'Nouaceur, Casablanca', coords: { latitude: 33.3675, longitude: -7.5898 } },
  { id: 'p4', title: 'Twin Center', address: 'Bd Zerktouni, Casablanca', coords: { latitude: 33.5886, longitude: -7.6333 } },
  { id: 'p5', title: 'Corniche Aïn Diab', address: 'Aïn Diab, Casablanca', coords: { latitude: 33.5934, longitude: -7.6753 } },
];

export const MOCK_OFFERS: DriverOffer[] = [
  {
    id: 'o1',
    price: 45,
    etaMinutes: 4,
    distanceKm: 1.2,
    driver: {
      id: 'd1', name: 'Karim B.', rating: 4.9, trips: 812,
      vehicle: { brand: 'Dacia', model: 'Logan', plate: '12345-A-6', color: 'Blanche', year: 2020 },
    },
  },
  {
    id: 'o2',
    price: 50,
    etaMinutes: 2,
    distanceKm: 0.6,
    driver: {
      id: 'd2', name: 'Hamza R.', rating: 4.7, trips: 304,
      vehicle: { brand: 'Hyundai', model: 'i10', plate: '67890-B-1', color: 'Grise', year: 2022 },
    },
  },
  {
    id: 'o3',
    price: 40,
    etaMinutes: 7,
    distanceKm: 2.4,
    driver: {
      id: 'd3', name: 'Soufiane M.', rating: 4.8, trips: 1290,
      vehicle: { brand: 'Renault', model: 'Clio', plate: '24680-C-2', color: 'Noire', year: 2019 },
    },
  },
];

export const MOCK_RIDES: Ride[] = [
  { id: 'r1', pickup: MOCK_PLACES[3], destination: MOCK_PLACES[1], price: 35, status: 'completed', createdAt: inDays(-1, 8, 30), driverName: 'Karim B.', driver: MOCK_OFFERS[0].driver, distanceKm: 5.6, durationMinutes: 14, rating: 5 },
  { id: 'r2', pickup: MOCK_PLACES[1], destination: MOCK_PLACES[2], price: 180, status: 'completed', createdAt: inDays(-5, 17, 10), driverName: 'Soufiane M.', driver: MOCK_OFFERS[2].driver, distanceKm: 31.4, durationMinutes: 42, rating: 4 },
  { id: 'r3', pickup: MOCK_PLACES[0], destination: MOCK_PLACES[4], price: 30, status: 'cancelled', createdAt: inDays(-12, 21, 45) },
];

export const MOCK_REQUESTS: RideRequest[] = [
  { id: 'q1', passengerName: 'Yassine A.', pickup: MOCK_PLACES[3], destination: MOCK_PLACES[1], proposedPrice: 35, distanceKm: 4.2 },
  { id: 'q2', passengerName: 'Nadia K.', pickup: MOCK_PLACES[4], destination: MOCK_PLACES[0], proposedPrice: 25, distanceKm: 3.1 },
  { id: 'q3', passengerName: 'Omar T.', pickup: MOCK_PLACES[1], destination: MOCK_PLACES[2], proposedPrice: 150, distanceKm: 28.7 },
];

const DAILY = [210, 340, 180, 295, 410, 85, 320];
export const MOCK_EARNINGS: Earnings = {
  today: 320,
  week: DAILY.reduce((a, b) => a + b, 0),
  month: 7260,
  trips: 112,
  daily: DAILY.map((amount, i) => ({ date: inDays(i - 6, 12), amount })),
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', type: 'ride', label: 'Twin Center → Gare Casa-Voyageurs', amount: -35, createdAt: inDays(-1, 8, 45) },
  { id: 'tx2', type: 'topup', label: 'Recharge carte', amount: 200, createdAt: inDays(-3, 19, 2) },
  { id: 'tx3', type: 'ride', label: 'Gare Casa-Voyageurs → Aéroport', amount: -180, createdAt: inDays(-5, 17, 55) },
  { id: 'tx4', type: 'refund', label: 'Course annulée', amount: 30, createdAt: minutesAgo(60 * 24 * 12) },
];
export const MOCK_WALLET: Wallet = { balance: 250, currency: 'MAD' };
