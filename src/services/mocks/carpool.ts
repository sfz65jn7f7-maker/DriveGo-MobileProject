import type { CarpoolTrip, DriverSummary } from '@/types';
import { inDays } from '@/utils/date';

const KARIM: DriverSummary = {
  id: 'd1', name: 'Karim B.', rating: 4.9, trips: 812,
  vehicle: { brand: 'Dacia', model: 'Logan', plate: '12345-A-6', color: 'Blanche', year: 2020 },
};
const HAMZA: DriverSummary = {
  id: 'd2', name: 'Hamza R.', rating: 4.7, trips: 304,
  vehicle: { brand: 'Hyundai', model: 'i10', plate: '67890-B-1', color: 'Grise', year: 2022 },
};
const SOUFIANE: DriverSummary = {
  id: 'd3', name: 'Soufiane M.', rating: 4.8, trips: 1290,
  vehicle: { brand: 'Renault', model: 'Clio', plate: '24680-C-2', color: 'Noire', year: 2019 },
};

/** Dates relatives à aujourd'hui : les trajets simulés restent toujours « à venir ». */
export const MOCK_TRIPS: CarpoolTrip[] = [
  { id: 't1', from: 'Casablanca', to: 'Rabat', departureAt: inDays(0, 18, 0), seatsAvailable: 3, pricePerSeat: 40, rules: ['noSmoking', 'lightLuggage'], driver: KARIM },
  { id: 't2', from: 'Rabat', to: 'Marrakech', departureAt: inDays(1, 14, 30), seatsAvailable: 2, pricePerSeat: 110, rules: ['noSmoking', 'noPets'], driver: HAMZA },
  { id: 't3', from: 'Casablanca', to: 'Marrakech', departureAt: inDays(1, 7, 0), seatsAvailable: 4, pricePerSeat: 90, rules: ['noSmoking', 'music'], driver: SOUFIANE },
  { id: 't4', from: 'Casablanca', to: 'Rabat', departureAt: inDays(1, 8, 15), seatsAvailable: 1, pricePerSeat: 35, rules: ['lightLuggage'], driver: HAMZA },
  { id: 't5', from: 'Tanger', to: 'Casablanca', departureAt: inDays(2, 9, 0), seatsAvailable: 3, pricePerSeat: 150, rules: ['noSmoking', 'pets'], driver: KARIM },
  { id: 't6', from: 'Casablanca', to: 'El Jadida', departureAt: inDays(3, 17, 45), seatsAvailable: 2, pricePerSeat: 30, rules: ['music'], driver: SOUFIANE },
];

/** Règles proposées à la publication (clés i18n carpool.rules.*). */
export const CARPOOL_RULES = ['noSmoking', 'noPets', 'pets', 'lightLuggage', 'music'] as const;
