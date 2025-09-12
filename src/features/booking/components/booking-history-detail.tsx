import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  MapPin,
  Users,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { BookingStatusBadge } from './booking-status-badge';
import { PaymentStatusBadge } from './payment-status-badge';
import {
  BOOKING_PAYMENT_STATUS,
  BOOKING_STATUS,
  BookingPaymentStatus,
  BookingStatus,
  PaymentMethod,
} from '@/constants';
import { getPaymentMethodName } from '@/lib';
import { useDateTimeFormatter } from '@/features/booking';
import { PaymentModal } from './payment-modal';
import { BookingCancelModal } from './booking-cancel-modal';
import { Booking } from '@/types';
import { useTranslation } from 'react-i18next';

interface BookingHistoryDetailProps {
  booking: Booking;
}

export function BookingHistoryDetail({ booking }: BookingHistoryDetailProps) {
  const { t } = useTranslation('booking');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { formatDate, formatDateTime, formatTime } = useDateTimeFormatter();

  const totalPaid = useMemo(
    () =>
      booking.payments
        .filter((p) => p.status === 'success')
        .reduce((sum, p) => sum + parseFloat(p.amount), 0),
    [booking.payments],
  );

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 md:px-8 py-8'>
        <div className='mb-6'>
          <Button
            variant='ghost'
            className='mb-4 -ml-3'
            onClick={() => window.history.back()}
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {t('back_list')}
          </Button>

          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                {t('title_detail', { id: booking.id })}
              </h1>
              <p className='text-gray-600'>
                {t('created_at', { date: formatDate(booking.created_at) })}
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <BookingStatusBadge status={booking.status as BookingStatus} />
              <PaymentStatusBadge
                status={booking.status_payment as BookingPaymentStatus}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>
          <div className='space-y-6'>
            <Card className='border-0 shadow-sm'>
              <div className='p-6'>
                <h2 className='text-xl font-bold mb-4'>{t('space_info')}</h2>

                <div className='flex gap-4'>
                  <div className='w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0'>
                    {booking.space.images && booking.space.images[0] ? (
                      <img
                        src={booking.space.images[0]}
                        alt={booking.space.name}
                        className='w-full h-full object-cover'
                        loading='lazy'
                      />
                    ) : (
                      <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                        <span className='text-gray-400 text-xs'>
                          {' '}
                          {t('no_image')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='flex-1'>
                    <h3 className='font-semibold text-lg mb-2'>
                      {booking.space.name}
                    </h3>

                    <div className='space-y-2 text-sm text-gray-600'>
                      {booking.space.venue?.address && (
                        <div className='flex items-center gap-2'>
                          <MapPin className='w-4 h-4' />
                          <span>{booking.space.venue?.address}</span>
                        </div>
                      )}
                      <div className='flex items-center gap-2'>
                        <Users className='w-4 h-4' />
                        <span>
                          {t('capacity', { count: booking.space.capacity })}
                        </span>
                      </div>
                    </div>

                    <div className='mt-3 flex items-center gap-3'>
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

                      <div className='flex gap-2 ml-auto'>
                        {booking.status_payment !==
                          BOOKING_PAYMENT_STATUS.PAID && (
                          <Button
                            size='sm'
                            className='bg-blue-600 hover:bg-blue-700'
                            onClick={() => setShowPaymentModal(true)}
                          >
                            <CreditCard className='w-4 h-4 mr-2' />
                            {t('btn_pay')}
                          </Button>
                        )}

                        {(booking.status === BOOKING_STATUS.PENDING ||
                          booking.status ===
                            BOOKING_STATUS.CONFIRMED_UNPAID) && (
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => setShowCancelModal(true)}
                          >
                            <XCircle className='w-4 h-4 mr-2' />
                            {t('btn_cancel')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className='border-0 shadow-sm'>
              <div className='p-6'>
                <h2 className='text-xl font-bold mb-4'>{t('time_info')}</h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <div>
                      <div className='flex items-center gap-2 text-gray-600 mb-2'>
                        <Calendar className='w-4 h-4' />
                        <span className='font-medium'>{t('start')}</span>
                      </div>
                      <div className='text-lg font-semibold'>
                        {formatDateTime(booking.start_time)}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {formatTime(booking.start_time)}
                      </div>
                    </div>

                    {booking.check_in && (
                      <div>
                        <div className='flex items-center gap-2 text-gray-600 mb-2'>
                          <CheckCircle className='w-4 h-4 text-green-600' />
                          <span className='font-medium'>{t('checkin')}</span>
                        </div>
                        <div className='text-sm text-gray-700'>
                          {formatDate(booking.check_in)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='space-y-4'>
                    <div>
                      <div className='flex items-center gap-2 text-gray-600 mb-2'>
                        <Calendar className='w-4 h-4' />
                        <span className='font-medium'>{t('end')}</span>
                      </div>
                      <div className='text-lg font-semibold'>
                        {formatDateTime(booking.end_time)}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {formatTime(booking.end_time)}
                      </div>
                    </div>

                    {booking.check_out && (
                      <div>
                        <div className='flex items-center gap-2 text-gray-600 mb-2'>
                          <CheckCircle className='w-4 h-4 text-blue-600' />
                          <span className='font-medium'>{t('checkout')}</span>
                        </div>
                        <div className='text-sm text-gray-700'>
                          {formatDate(booking.check_out)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className='border-0 shadow-sm'>
              <div className='p-6'>
                <h2 className='text-xl font-bold mb-4'>{t('payment_info')}</h2>

                <div className='space-y-4'>
                  <div className='flex justify-between items-center p-4 bg-gray-50 rounded-lg'>
                    <span className='font-medium'>{t('total_price')}</span>
                    <span className='text-lg font-bold text-gray-900'>
                      {parseInt(booking.total_price).toLocaleString()}₫
                    </span>
                  </div>

                  <div className='flex justify-between items-center p-4 bg-green-50 rounded-lg'>
                    <span className='font-medium text-green-800'>
                      {t('paid')}
                    </span>
                    <span className='text-lg font-bold text-green-600'>
                      {totalPaid.toLocaleString()}₫
                    </span>
                  </div>

                  {totalPaid < parseFloat(booking.total_price) && (
                    <div className='flex justify-between items-center p-4 bg-red-50 rounded-lg'>
                      <span className='font-medium text-red-800'>
                        {t('remaining')}
                      </span>
                      <span className='text-lg font-bold text-red-600'>
                        {(
                          parseFloat(booking.total_price) - totalPaid
                        ).toLocaleString()}
                        ₫
                      </span>
                    </div>
                  )}
                </div>

                {booking.payments.length > 0 && (
                  <div className='mt-6'>
                    <h3 className='font-semibold mb-3'>
                      {t('payment_history')}
                    </h3>
                    <div className='space-y-3'>
                      {booking.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className='flex items-center justify-between p-4 border rounded-lg'
                        >
                          <div className='flex items-center gap-3'>
                            <CreditCard className='w-5 h-5 text-gray-500' />
                            <div>
                              <div className='font-medium'>
                                {getPaymentMethodName(
                                  payment.method as PaymentMethod,
                                )}
                              </div>
                              <div className='text-sm text-gray-500'>
                                {formatDateTime(payment.paid_at)}
                              </div>
                            </div>
                          </div>

                          <div className='text-right'>
                            <div className='font-semibold'>
                              {parseInt(payment.amount).toLocaleString()}₫
                            </div>
                            <Badge
                              variant={
                                payment.status === 'success'
                                  ? 'default'
                                  : 'destructive'
                              }
                              className='text-xs'
                            >
                              {payment.status === 'success'
                                ? t('success')
                                : t('failed')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        <PaymentModal
          booking={booking}
          totalPaid={totalPaid}
          open={showPaymentModal}
          onOpenChange={setShowPaymentModal}
        />

        <BookingCancelModal
          open={showCancelModal}
          onOpenChange={setShowCancelModal}
        />
      </div>
    </div>
  );
}
