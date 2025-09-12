import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { paymentFormSchema } from '@/features/booking';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

interface PaymentModalProps {
  booking: any;
  totalPaid: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentModal({
  booking,
  totalPaid,
  open,
  onOpenChange,
}: PaymentModalProps) {
  const { t } = useTranslation('booking');

  const remaining = useMemo(
    () => parseFloat(booking.total_price) - totalPaid,
    [booking.total_price, totalPaid],
  );

  const form = useForm({
    resolver: zodResolver(paymentFormSchema(remaining)),
    defaultValues: {
      partialAmount: '',
    },
    mode: 'onChange',
  });

  const [paymentMode, setPaymentMode] = useState<'full' | 'partial'>('full');
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setQrData(null);
      form.reset();
      setPaymentMode('full');
      setLoading(false);
    }
  }, [open, form]);

  // Simulating QR generation here with setTimeout.
  // In reality, this will call the payment API in the next PR.
  const onSubmit = async (values: { partialAmount: string }) => {
    const paidAmount =
      paymentMode === 'full' ? remaining : parseFloat(values.partialAmount);

    if (!paidAmount || paidAmount <= 0 || paidAmount > remaining) {
      alert(t('payment.invalid_amount'));
      return;
    }

    setLoading(true);
    try {
      const res = await new Promise<string>((resolve) =>
        setTimeout(() => resolve(`QR-${paidAmount}-${Date.now()}`), 2000),
      );
      setQrData(res);
    } catch (err) {
      toast.error('Lỗi khi tạo QR!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('payment.title')}</DialogTitle>
        </DialogHeader>

        <div className='text-center space-y-4'>
          {!qrData && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <div>
                  <p className='text-gray-600 mb-2'>
                    {t('payment.amount_label')}
                  </p>
                  {paymentMode === 'full' ? (
                    <p className='text-2xl font-bold text-red-600'>
                      {remaining.toLocaleString()}₫
                    </p>
                  ) : (
                    <FormField
                      control={form.control}
                      name='partialAmount'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type='number'
                              min={1}
                              max={remaining}
                              className='w-40 text-center mx-auto'
                              placeholder={t('payment.placeholder')}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className='text-sm text-gray-500 mt-1'>
                            {t('payment.max_label', {
                              amount: remaining.toLocaleString(),
                            })}
                          </p>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <RadioGroup
                  value={paymentMode}
                  onValueChange={(val) =>
                    setPaymentMode(val as 'full' | 'partial')
                  }
                  className='flex justify-center gap-6'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='full' id='full' />
                    <Label htmlFor='full'>{t('payment.mode_full')}</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='partial' id='partial' />
                    <Label htmlFor='partial'>{t('payment.mode_partial')}</Label>
                  </div>
                </RadioGroup>

                <DialogFooter className='flex gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1'
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                  >
                    {t('payment.btn_close')}
                  </Button>
                  {!qrData && (
                    <Button
                      type='submit'
                      className='flex-1 bg-pink-600 hover:bg-pink-700'
                      disabled={loading}
                    >
                      {loading
                        ? t('payment.btn_processing')
                        : t('payment.btn_pay')}
                    </Button>
                  )}
                </DialogFooter>
              </form>
            </Form>
          )}

          {qrData && (
            <div className='bg-gray-100 p-4 rounded-lg'>
              <p className='font-mono text-xs break-all mb-2'>{qrData}</p>
              <div className='flex justify-center'>
                <QRCode
                  value={qrData}
                  size={128}
                  bgColor='#f3f4f6'
                  fgColor='#111827'
                  level='H'
                />
              </div>
              <p className='text-sm text-gray-600 mt-2'>
                {t('payment.qr_label')}
              </p>

              <div className='text-xs text-gray-500 space-y-1 mt-3'>
                <p>{t('payment.instructions.step1')}</p>
                <p>{t('payment.instructions.step2')}</p>
                <p>{t('payment.instructions.step3')}</p>
                <p>{t('payment.instructions.step4')}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
