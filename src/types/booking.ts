import { User, Space, Payment } from '@/types';
import { BookingStatus, BookingPaymentStatus } from '@/constants/';

export type Booking = {
  id: number;
  user: User;
  space: Space;
  status: BookingStatus;
  status_payment: BookingPaymentStatus;
  payments: Payment[];
  total_price: string;
  start_time: string;
  end_time: string;
  check_in: string | null;
  check_out: string | null;
  created_at: string;
};
