import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export function BookingHistoryDetailSkeleton() {
  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
          <div>
            <Skeleton className='h-8 w-64 mb-2' />
            <Skeleton className='h-4 w-40' />
          </div>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-6 w-20' />
            <Skeleton className='h-6 w-20' />
          </div>
        </div>

        <Card className='border-0 shadow-sm'>
          <div className='p-6 flex gap-4'>
            <Skeleton className='w-24 h-24 rounded-lg' />
            <div className='flex-1 space-y-3'>
              <Skeleton className='h-6 w-48' />
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-40' />
              <div className='flex gap-2'>
                <Skeleton className='h-8 w-32' />
                <Skeleton className='h-8 w-32' />
              </div>
            </div>
          </div>
        </Card>

        <Card className='border-0 shadow-sm'>
          <div className='p-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
            {Array({ length: 2 }).map((_, idx) => (
              <div key={idx} className='space-y-4'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-6 w-full' />
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-20' />
              </div>
            ))}
          </div>
        </Card>

        <Card className='border-0 shadow-sm'>
          <div className='p-6 space-y-4'>
            <Skeleton className='h-4 w-40' />
            {Array({ length: 3 }).map((_, index) => (
              <Skeleton className='h-6 w-full' key={index} />
            ))}

            <div className='mt-6 space-y-3'>
              {Array({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <Skeleton className='w-5 h-5' />
                    <div className='space-y-1'>
                      <Skeleton className='h-4 w-24' />
                      <Skeleton className='h-3 w-20' />
                    </div>
                  </div>
                  <div className='text-right space-y-1'>
                    <Skeleton className='h-4 w-16 mx-auto' />
                    <Skeleton className='h-3 w-12 mx-auto' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
