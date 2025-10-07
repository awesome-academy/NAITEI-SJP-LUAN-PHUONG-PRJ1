import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PaginationIndies } from '@/components/ui/pagination-indies';

describe('PaginationIndies', () => {
  it('should renders the correct surrounding pages', () => {
    const handlePageChange = vi.fn();
    render(
      <PaginationIndies
        totalPages={10}
        page={5}
        handlePageChange={handlePageChange}
      />,
    );

    // Expect visible page buttons (1, ellipsis, 3, 4, 5, 6, 7, ellipsis, 10)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should calls handlePageChange when clicking next/previous', () => {
    const handlePageChange = vi.fn();
    render(
      <PaginationIndies
        totalPages={5}
        page={3}
        handlePageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByText('Previous'));
    expect(handlePageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText('Next'));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('should calls handlePageChange when clicking a page number', () => {
    const handlePageChange = vi.fn();
    render(
      <PaginationIndies
        totalPages={5}
        page={2}
        handlePageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByText('4'));
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('should does not render previous button on first page', () => {
    const handlePageChange = vi.fn();
    render(
      <PaginationIndies
        totalPages={5}
        page={1}
        handlePageChange={handlePageChange}
      />,
    );

    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should does not render next button on last page', () => {
    const handlePageChange = vi.fn();
    render(
      <PaginationIndies
        totalPages={5}
        page={5}
        handlePageChange={handlePageChange}
      />,
    );

    expect(screen.queryByText('Next')).not.toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('should disables all buttons when disabled prop is true', () => {
    const handlePageChange = vi.fn();
    render(
      <PaginationIndies
        totalPages={5}
        page={3}
        handlePageChange={handlePageChange}
        disabled
      />,
    );

    const buttons = screen.getAllByRole('button');
    for (const btn of buttons) {
      expect(btn).toBeDisabled();
    }
  });
});
