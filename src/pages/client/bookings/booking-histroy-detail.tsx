import { AlertCircle, MapPinOff } from 'lucide-react';
import {
  BookingHistoryDetail,
  BookingHistoryDetailSkeleton,
} from '@/features/booking';
import { useGetBookingDetail } from '@/features/booking';
import { AxiosError } from '@/types';
import { HTTP_STATUS_CODE } from '@/constants';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

export function BookingHistoryDetailPage() {
  const { t } = useTranslation('booking');
  const { bookingId } = useParams<{ bookingId: string }>();
  const {
    data: booking,
    isPending,
    isError,
    error,
  } = useGetBookingDetail(bookingId!);

  if (isPending) return <BookingHistoryDetailSkeleton />;

  if (isError) {
    if (
      (error as AxiosError)?.response?.data.statusCode ===
      HTTP_STATUS_CODE.NOT_FOUND
    ) {
      return (
        <div className='flex flex-col items-center justify-center py-16 text-gray-500'>
          <MapPinOff className='w-10 h-10 mb-4' />
          <p className='text-lg font-medium'>{t('not_found')}</p>
        </div>
      );
    }

    return (
      <div className='flex flex-col items-center justify-center py-16 text-red-600'>
        <AlertCircle className='w-10 h-10 mb-4' />
        <p className='text-lg font-medium'>{t('error.fetch_failed')}</p>
      </div>
    );
  }

  return <BookingHistoryDetail booking={booking} />;
}
