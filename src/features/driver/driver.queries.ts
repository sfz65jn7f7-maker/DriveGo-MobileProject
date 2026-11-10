import { useQuery } from '@tanstack/react-query';
import { driverService } from '@/services/driver.service';

export const useIncomingRequests = () =>
  useQuery({ queryKey: ['driver', 'requests'], queryFn: driverService.getIncomingRequests });

export const useEarnings = () =>
  useQuery({ queryKey: ['driver', 'earnings'], queryFn: driverService.getEarnings });
