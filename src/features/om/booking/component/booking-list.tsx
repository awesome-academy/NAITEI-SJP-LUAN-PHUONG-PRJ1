import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookingFilterParams,
  BookingHistoryPagination,
} from '@/features/booking';
import {
  BookingListFilter,
  BookingListTable,
  BookingListStatistic,
} from '@/features/om/booking';
import { useDebounce, usePagination } from '@/hooks';
import { useGetBookingListOM } from '@/features/om/booking';
import { useTranslation } from 'react-i18next';
import { PageSize } from '@/constants';

export const FILTER_VALUES = {
  ALL: 'all',
} as const;

export function BookingList() {
  const { t } = useTranslation('booking');
  const {
    page: currentPage,
    setPage: setCurrentPage,
    pageSize,
    setPageSize,
  } = usePagination();

  const [filters, setFilters] = useState<
    BookingFilterParams & { venueId?: string }
  >({
    page: currentPage,
    pageSize: pageSize,
    search: '',
    venueId: '',
    status: FILTER_VALUES.ALL,
    statusPayment: FILTER_VALUES.ALL,
    startTime: '',
    endTime: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const params: BookingFilterParams & { venueId?: string } = {
    page: currentPage,
    pageSize,
    venueId: filters.venueId || undefined,
    status: filters.status !== FILTER_VALUES.ALL ? filters.status : undefined,
    statusPayment:
      filters.statusPayment !== FILTER_VALUES.ALL
        ? filters.statusPayment
        : undefined,
    search: debouncedSearch || undefined,
    startTime: filters.startTime || undefined,
    endTime: filters.endTime || undefined,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
  };

  const { data, isPending, isFetching } = useGetBookingListOM(params);

  const bookings = data?.data || [];
  const totalRecords = data?.meta?.total || 0;
  const totalPages = data?.meta?.last_page || 1;

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto'>
        <BookingListStatistic bookings={bookings} />

        <Card className='mb-6'>
          <CardHeader></CardHeader>
          <CardContent>
            <BookingListFilter
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t('booking_list.bookings', { total: totalRecords })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BookingListTable
              bookings={bookings}
              isPending={isPending}
              isFetching={isFetching}
            />

            <BookingHistoryPagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
              onPageSizeChange={(size) => {
                setPageSize(size as PageSize);
                setCurrentPage(1);
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
