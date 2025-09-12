import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, MapPin, Users, Calendar } from 'lucide-react';
import { BookingStatusBadge } from './booking-status-badge';
import { PaymentStatusBadge } from './payment-status-badge';
import { useTranslation } from 'react-i18next';
import { Booking } from '@/types';
import { formatPrice } from '@/lib';
import { useDateTimeFormatter } from '@/features/booking';
import { Link } from 'react-router';

interface BookingHistoryTableProps {
  bookings: Booking[];
  isPending: boolean;
  isFetching: boolean;
}

export function BookingHistoryTable({
  bookings,
  isPending,
  isFetching,
}: BookingHistoryTableProps) {
  const { t } = useTranslation('booking');
  const { formatDateTime } = useDateTimeFormatter();

  const isInitialLoading = isPending && bookings.length === 0;
  const isUpdating = isFetching && !isInitialLoading;

  return (
    <div className='relative overflow-x-auto'>
      {isUpdating && (
        <div className='absolute inset-0 flex items-center justify-center bg-white/30 z-10'>
          <Skeleton className='w-12 h-12 rounded-full' />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('booking_history.table.id')}</TableHead>
            <TableHead>{t('booking_history.table.space')}</TableHead>
            <TableHead>{t('booking_history.table.duration')}</TableHead>
            <TableHead>{t('booking_history.table.status')}</TableHead>
            <TableHead>{t('booking_history.table.payment')}</TableHead>
            <TableHead>{t('booking_history.table.total')}</TableHead>
            <TableHead>{t('booking_history.table.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isInitialLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className='h-4 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : bookings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='py-8 text-center'>
                <Calendar className='w-12 h-12 mx-auto mb-4 text-gray-300' />
                {t('booking_history.no_bookings')}
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((b: Booking) => (
              <TableRow key={b.id}>
                <TableCell>
                  <div className='font-medium'>#{b.id}</div>
                  <div className='text-sm text-gray-500'>
                    {formatDateTime(b.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4 text-blue-600' />
                    <div>
                      <div className='font-medium'>{b.space?.name}</div>
                      <div className='text-sm text-gray-500 flex items-center gap-1'>
                        <Users className='w-3 h-3' />
                        {t('booking_history.people', {
                          count: b.space?.capacity,
                        })}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='text-sm'>
                    <div>
                      {t('booking_history.start')}:{' '}
                      {formatDateTime(b.start_time)}
                    </div>
                    <div>
                      {t('booking_history.end')}: {formatDateTime(b.end_time)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <BookingStatusBadge status={b.status} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={b.status_payment} />
                </TableCell>
                <TableCell>{formatPrice(String(b.total_price))}</TableCell>
                <TableCell>
                  <Button variant='outline' size='sm' asChild>
                    <Link to={`/bookings/${b.id}`}>
                      <Eye className='w-4 h-4 mr-1' />
                      {t('booking_history.view')}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
