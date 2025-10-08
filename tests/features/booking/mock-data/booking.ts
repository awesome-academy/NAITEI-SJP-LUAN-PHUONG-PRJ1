import { Booking } from '@/types';
import { mockPayment } from './payment';
import { mockUser } from './user';
import { mockSpace } from './space';

export const mockBooking: Booking = {
  id: 200,
  user: mockUser,
  space: mockSpace,
  status: 'confirmed-unpaid',
  status_payment: 'unpaid',
  payments: mockPayment,
  total_price: '500000',
  start_time: '2025-02-01T08:00:00Z',
  end_time: '2025-02-01T12:00:00Z',
  check_in: null,
  check_out: null,
  created_at: '2025-01-31T00:00:00Z',
};
