import { Booking } from '@/types';
import { axios } from './axios';
import { CreateBookingResponse, BookingMeResponse } from '@/features/booking';
import { BookingFilterParams } from '@/features/booking';

const BOOKING_ENDPOINT = '/bookings';

export async function createBooking(bookingData: {
  space_id: number;
  start_time: string;
  end_time: string;
}): Promise<CreateBookingResponse> {
  const { data } = await axios.post<CreateBookingResponse>(
    BOOKING_ENDPOINT,
    bookingData,
  );

  return data;
}

export async function getBookingMe(
  params: BookingFilterParams,
): Promise<BookingMeResponse> {
  const { data } = await axios.get(`${BOOKING_ENDPOINT}/me`, { params });

  return data.data;
}

export async function getBookingDetail(id: string): Promise<Booking> {
  const { data } = await axios.get(`${BOOKING_ENDPOINT}/${id}`);

  return data.data;
}
