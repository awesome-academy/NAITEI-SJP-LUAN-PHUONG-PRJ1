import { useQuery } from '@tanstack/react-query';
import { getBookingDetail } from '@/api/booking';
import { useAtomValue } from 'jotai';
import { isLoginAtom } from '@/features/auth';

const QUERY_KEY = 'bookings';

const minutesTime = 1000 * 60;

export function getQueryKey(id?: string) {
  return id ? [QUERY_KEY, id] : [QUERY_KEY];
}

export function useGetBookingDetail(id: string) {
  const isLogin = useAtomValue(isLoginAtom);

  return useQuery({
    queryKey: getQueryKey(id),
    queryFn: () => getBookingDetail(id),
    enabled: isLogin && Number(id) > 0,
    staleTime: minutesTime,
    gcTime: 5 * minutesTime,
  });
}
