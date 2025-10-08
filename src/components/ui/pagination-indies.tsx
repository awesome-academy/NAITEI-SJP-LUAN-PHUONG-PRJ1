import { getSurroundingPages } from '@/lib/gen-sur-pages';
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './pagination-base';
import React, { useMemo } from 'react';

export function PaginationIndies({
  totalPages,
  page,
  handlePageChange,
  className,
  disabled = false,
  ...props
}: {
  totalPages: number;
  page: number;
  handlePageChange: (page: number) => void;
  disabled?: boolean;
} & React.ComponentProps<typeof Pagination>) {
  const pages = useMemo(
    () => getSurroundingPages(totalPages, page),
    [totalPages, page],
  );

  return (
    <Pagination className={className} {...props}>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem key={page - 1}>
            <PaginationPrevious
              disabled={disabled}
              onClick={() => {
                handlePageChange(page - 1);
              }}
            />
          </PaginationItem>
        )}
        {pages.map((p, index) => (
          <PaginationItem key={p === 0 ? `ellipsis-${index}` : p}>
            {p !== 0 ? (
              <PaginationButton
                disabled={disabled}
                isActive={p === page}
                onClick={() => {
                  handlePageChange(p);
                }}
              >
                {p}
              </PaginationButton>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        {page < totalPages && (
          <PaginationItem key={page + 1}>
            <PaginationNext
              disabled={disabled}
              onClick={() => {
                handlePageChange(page + 1);
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
