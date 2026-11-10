import type { User } from '@/types';

export const MOCK_USERS: User[] = [
  {
    id: 'u_passenger_1',
    name: 'Yassine Alaoui',
    phone: '0600000000',
    email: 'yassine@example.com',
    role: 'passenger',
  },
  {
    id: 'u_driver_1',
    name: 'Karim Bennani',
    phone: '0611111111',
    role: 'driver',
    driverStatus: 'approved',
    vehicle: { brand: 'Dacia', model: 'Logan', plate: '12345-A-6', color: 'Blanche', year: 2020 },
  },
  {
    id: 'u_driver_2',
    name: 'Salma El Idrissi',
    phone: '0622222222',
    role: 'driver',
    driverStatus: 'pending',
  },
];
