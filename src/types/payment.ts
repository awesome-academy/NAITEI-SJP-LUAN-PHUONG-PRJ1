import { PaymentMethod } from '@/constants';

export type Payment = {
  id: number;
  method: PaymentMethod;
  amount: string;
  status: string;
  paid_at: string;
};
