import { delay } from '@/services/mocks/delay';
import { MOCK_TRIPS } from '@/services/mocks/carpool';
import { MOCK_USERS } from '@/services/mocks/users';
import type { CarpoolBooking, CarpoolTrip, PublishTripInput, User } from '@/types';

let trips: CarpoolTrip[] = [...MOCK_TRIPS];
let bookings: CarpoolBooking[] = [{ id: 'b1', trip: MOCK_TRIPS[0], seats: 1, status: 'confirmed' }];
let published: CarpoolTrip[] = [];

const sameDay = (iso: string, day: string) => iso.slice(0, 10) === day.slice(0, 10);

export const carpoolService = {
  async searchTrips(params: { from?: string; to?: string; date?: string; seats?: number }): Promise<CarpoolTrip[]> {
    await delay();
    const from = params.from?.trim().toLowerCase();
    const to = params.to?.trim().toLowerCase();
    return trips
      .filter(
        (t) =>
          (!from || t.from.toLowerCase().includes(from)) &&
          (!to || t.to.toLowerCase().includes(to)) &&
          (!params.date || sameDay(t.departureAt, params.date)) &&
          (!params.seats || t.seatsAvailable >= params.seats),
      )
      .sort((a, b) => a.departureAt.localeCompare(b.departureAt));
  },

  async getTrip(id: string): Promise<CarpoolTrip | null> {
    await delay(300);
    return trips.find((t) => t.id === id) ?? null;
  },

  async bookSeats(tripId: string, seats: number): Promise<CarpoolBooking> {
    await delay(700);
    const trip = trips.find((t) => t.id === tripId);
    if (!trip || trip.seatsAvailable < seats) throw new Error('Not enough seats');
    const updated = { ...trip, seatsAvailable: trip.seatsAvailable - seats };
    trips = trips.map((t) => (t.id === tripId ? updated : t));
    const booking: CarpoolBooking = { id: `b_${Date.now()}`, trip: updated, seats, status: 'confirmed' };
    bookings = [booking, ...bookings];
    return booking;
  },

  async cancelBooking(id: string): Promise<void> {
    await delay(400);
    bookings = bookings.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b));
  },

  async getMyBookings(): Promise<CarpoolBooking[]> {
    await delay();
    return bookings;
  },

  async publishTrip(input: PublishTripInput, driver: User | null): Promise<CarpoolTrip> {
    await delay(700);
    const fallback = MOCK_USERS.find((u) => u.role === 'driver');
    const vehicle = driver?.vehicle ?? fallback?.vehicle;
    const trip: CarpoolTrip = {
      id: `t_${Date.now()}`,
      from: input.from,
      to: input.to,
      departureAt: input.departureAt,
      seatsAvailable: input.seats,
      pricePerSeat: input.pricePerSeat,
      rules: input.rules,
      driver: {
        id: driver?.id ?? 'me',
        name: driver?.name ?? 'Moi',
        rating: 5,
        trips: 0,
        vehicle: vehicle ?? { brand: '—', model: '', plate: '', color: '', year: 0 },
      },
    };
    trips = [...trips, trip];
    published = [trip, ...published];
    return trip;
  },

  async getMyPublishedTrips(): Promise<CarpoolTrip[]> {
    await delay();
    return published.map((p) => trips.find((t) => t.id === p.id) ?? p);
  },

  /** Conservé pour compatibilité avec l'ancien hook. */
  async getMyTrips(): Promise<CarpoolTrip[]> {
    await delay();
    return bookings.filter((b) => b.status === 'confirmed').map((b) => b.trip);
  },
};
