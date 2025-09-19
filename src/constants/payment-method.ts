export const PAYMENT_METHOD = {
  MOMO: 'momo',
  VNPAY: 'vnpay',
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
