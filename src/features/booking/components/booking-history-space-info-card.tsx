import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { Booking } from '@/types';
import { useTranslation } from 'react-i18next';

interface Props {
  booking: Booking;
  renderActions?: React.ReactNode;
}

export function BookingHistorySpaceInfoCard({ booking, renderActions }: Props) {
  const { t } = useTranslation('booking');

  return (
    <Card className='border-0 shadow-sm'>
      <div className='p-6'>
        <h2 className='text-xl font-bold mb-4'>{t('space_info')}</h2>

        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
          <div className='w-24 h-24 rounded-lg overflow-hidden bg-gray-200 mx-auto sm:mx-0 flex-shrink-0'>
            {booking.space.images && booking.space.images[0] ? (
              <img
                src={booking.space.images[0]}
                alt={booking.space.name}
                className='w-full h-full object-cover'
                loading='lazy'
              />
            ) : (
              <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                <span className='text-gray-400 text-xs'>{t('no_image')}</span>
              </div>
            )}
          </div>

          <div className='flex-1 mt-3 sm:mt-0'>
            <h3 className='font-semibold text-lg mb-2'>{booking.space.name}</h3>

            <div className='space-y-2 text-sm text-gray-600'>
              {booking.space.venue?.address && (
                <div className='flex items-center gap-2'>
                  <MapPin className='w-4 h-4' />
                  <span>{booking.space.venue?.address}</span>
                </div>
              )}
              <div className='flex items-center gap-2'>
                <Users className='w-4 h-4' />
                <span>{t('capacity', { count: booking.space.capacity })}</span>
              </div>
            </div>

            <div className='mt-3 flex flex-wrap items-center gap-2'>
              <Button asChild variant='outline' size='sm'>
                <Link
                  to={`/spaces/${booking.space.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Eye className='w-4 h-4 mr-2' />
                  {t('space_info')}
                </Link>
              </Button>

              <div className='flex gap-2 sm:ml-auto'>{renderActions}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
