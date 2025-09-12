import { z } from 'zod';
import i18n from '@/i18n';

export const paymentFormSchema = (remaining: number) =>
  z.object({
    partialAmount: z
      .string()
      .nonempty(i18n.t('payment.required_amount', { ns: 'booking' }))
      .refine((val) => !isNaN(Number(val)), {
        message: i18n.t('payment.invalid_number', { ns: 'booking' }),
      })
      .transform((val) => Number(val))
      .refine((val) => val > 0, {
        message: i18n.t('payment.min_label', { ns: 'booking' }),
      })
      .refine((val) => val <= remaining, {
        message: i18n.t('payment.max_label', {
          ns: 'booking',
          amount: remaining.toLocaleString(),
        }),
      }),
  });
