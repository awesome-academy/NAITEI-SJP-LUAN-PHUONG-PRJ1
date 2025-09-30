import { Payment } from '@/types';

export const mockPayment: Payment[] = [
  {
    id: 1001,
    method: 'momo',
    amount: '150',
    status: 'success',
    paid_at: '2025-02-01T00:00:00Z',
  },
  {
    id: 1002,
    method: 'momo',
    amount: '100',
    status: 'success',
    paid_at: '2025-02-01T00:00:00Z',
  },
];
