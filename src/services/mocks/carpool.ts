import type { CarpoolTrip } from '@/types';

export const MOCK_TRIPS: CarpoolTrip[] = [
  {
    id: 't1',
    from: 'Casablanca',
    to: 'Rabat',
    departureAt: '2026-11-10T08:00:00Z',
    seatsAvailable: 3,
    pricePerSeat: 40,
    rules: ['Non-fumeur', 'Bagages légers'],
    driver: {
      id: 'd1', name: 'Karim B.', rating: 4.9, trips: 812,
      vehicle: { brand: 'Dacia', model: 'Logan', plate: '12345-A-6', color: 'Blanche', year: 2020 },
    },
  },
  {
    id: 't2',
    from: 'Rabat',
    to: 'Marrakech',
    departureAt: '2026-11-11T14:30:00Z',
    seatsAvailable: 2,
    pricePerSeat: 110,
    rules: ['Non-fumeur', 'Pas d’animaux'],
    driver: {
      id: 'd2', name: 'Hamza R.', rating: 4.7, trips: 304,
      vehicle: { brand: 'Hyundai', model: 'i10', plate: '67890-B-1', color: 'Grise', year: 2022 },
    },
  },
];
