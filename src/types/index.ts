export type Role = 'passenger' | 'driver';
export type DriverStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type Coords = { latitude: number; longitude: number };

export type Vehicle = {
  brand: string;
  model: string;
  plate: string;
  color: string;
  year: number;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  role: Role;
  /** Uniquement pour les chauffeurs */
  driverStatus?: DriverStatus;
  vehicle?: Vehicle;
};

export type AuthSession = { user: User; token: string };

export type Place = {
  id: string;
  title: string;
  address: string;
  coords: Coords;
};

export type RideStatus =
  | 'searching'
  | 'offers'
  | 'driver_assigned'
  | 'arriving'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type DriverSummary = {
  id: string;
  name: string;
  rating: number;
  trips: number;
  avatarUrl?: string;
  vehicle: Vehicle;
};

export type DriverOffer = {
  id: string;
  driver: DriverSummary;
  price: number;
  etaMinutes: number;
  distanceKm: number;
};

export type Ride = {
  id: string;
  pickup: Place;
  destination: Place;
  price: number;
  status: RideStatus;
  createdAt: string;
  driverName?: string;
};

export type RideRequest = {
  id: string;
  passengerName: string;
  pickup: Place;
  destination: Place;
  proposedPrice: number;
  distanceKm: number;
};

export type CarpoolTrip = {
  id: string;
  from: string;
  to: string;
  departureAt: string;
  seatsAvailable: number;
  pricePerSeat: number;
  driver: DriverSummary;
  rules: string[];
};

export type Earnings = {
  today: number;
  week: number;
  month: number;
  trips: number;
};

export type Wallet = {
  balance: number;
  currency: 'MAD';
};
