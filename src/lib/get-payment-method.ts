import { PAYMENT_METHOD, PaymentMethod } from '@/constants/payment-method';

export function getPaymentMethodName(method: PaymentMethod) {
  switch (method) {
    case PAYMENT_METHOD.MOMO:
      return 'MoMo';
    case PAYMENT_METHOD.VNPAY:
      return 'VNPay';
    default:
      return 'Other';
  }
}
