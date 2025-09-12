import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface BookingCancelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingCancelModal({
  open,
  onOpenChange,
}: BookingCancelModalProps) {
  const { t } = useTranslation('booking');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader className='flex justify-between items-center'>
          <DialogTitle>{t('cancel_title')}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <p className='text-gray-600'>{t('cancel_question')}</p>

          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
            <p className='text-sm text-yellow-800'>
              <strong>{t('note')}:</strong> {t('cancel_note')}
            </p>
          </div>
        </div>

        <DialogFooter className='flex gap-3'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={() => onOpenChange(false)}
          >
            {t('keep_booking')}
          </Button>
          <Button
            variant='destructive'
            className='flex-1'
            onClick={() => {
              onOpenChange(false);
              toast(t('cancel_success'));
            }}
          >
            {t('confirm_cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
