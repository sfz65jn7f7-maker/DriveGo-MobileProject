import type { DriverOffer, Earnings, Ride, RideRequest, Place, Wallet } from '@/types';

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
  { id: 'r1', pickup: MOCK_PLACES[3], destination: MOCK_PLACES[1], price: 35, status: 'completed', createdAt: '2026-11-02T08:30:00Z', driverName: 'Karim B.' },
  { id: 'r2', pickup: MOCK_PLACES[1], destination: MOCK_PLACES[2], price: 180, status: 'completed', createdAt: '2026-10-28T17:10:00Z', driverName: 'Soufiane M.' },
  { id: 'r3', pickup: MOCK_PLACES[0], destination: MOCK_PLACES[4], price: 30, status: 'cancelled', createdAt: '2026-10-20T21:45:00Z' },
];

export const MOCK_REQUESTS: RideRequest[] = [
  { id: 'q1', passengerName: 'Yassine A.', pickup: MOCK_PLACES[3], destination: MOCK_PLACES[1], proposedPrice: 35, distanceKm: 4.2 },
  { id: 'q2', passengerName: 'Nadia K.', pickup: MOCK_PLACES[4], destination: MOCK_PLACES[0], proposedPrice: 25, distanceKm: 3.1 },
];

export const MOCK_EARNINGS: Earnings = { today: 320, week: 1840, month: 7260, trips: 112 };
export const MOCK_WALLET: Wallet = { balance: 250, currency: 'MAD' };
