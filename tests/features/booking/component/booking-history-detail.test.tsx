import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookingHistoryDetail } from '@/features/booking/components/booking-history-detail';
import { mockBooking } from '../mock-data/booking';

vi.mock('@/features/booking', () => ({
  BookingHistorySpaceInfoCard: vi.fn(({ renderActions }) => (
    <div data-testid='space-card'>{renderActions}</div>
  )),
  BookingHistoryTimeInfoCard: vi.fn(() => (
    <div data-testid='time-card'>Time Info</div>
  )),
  BookingHistoryPaymentInfoCard: vi.fn(({ totalPaid }) => (
    <div data-testid='payment-card'>Total Paid: {totalPaid}</div>
  )),
  BookingDetailLayout: vi.fn(
    ({ renderSpaceInfoCard, renderExtraCards, renderModals }) => (
      <div>
        <div data-testid='layout-space'>{renderSpaceInfoCard}</div>
        <div data-testid='layout-extra'>{renderExtraCards}</div>
        <div data-testid='layout-modals'>{renderModals}</div>
      </div>
    ),
  ),
  BookingHistoryDetailActions: vi.fn(
    ({ onShowPaymentModal, onShowCancelModal }) => (
      <div>
        <button onClick={onShowPaymentModal}>Payment</button>
        <button onClick={onShowCancelModal}>Cancel</button>
      </div>
    ),
  ),
}));

vi.mock('@/features/booking/components/payment-modal', () => ({
  PaymentModal: vi.fn(({ open }) =>
    open ? <div data-testid='payment-modal'>Payment Modal Open</div> : null,
  ),
}));

vi.mock('@/features/booking/components/booking-cancel-modal', () => ({
  BookingCancelModal: vi.fn(({ open }) =>
    open ? <div data-testid='cancel-modal'>Cancel Modal Open</div> : null,
  ),
}));

describe('BookingHistoryDetail', () => {
  it('should correctly calculate totalPaid', () => {
    render(<BookingHistoryDetail booking={mockBooking} />);
    expect(screen.getByTestId('payment-card')).toHaveTextContent(
      'Total Paid: 250',
    );
  });

  it('should render layout with sub-components', () => {
    render(<BookingHistoryDetail booking={mockBooking} />);
    expect(screen.getByTestId('layout-space')).toBeInTheDocument();
    expect(screen.getByTestId('layout-extra')).toBeInTheDocument();
    expect(screen.getByTestId('layout-modals')).toBeInTheDocument();
  });

  it('should open payment modal when clicking "Payment"', () => {
    render(<BookingHistoryDetail booking={mockBooking} />);
    fireEvent.click(screen.getByText('Payment'));
    expect(screen.getByTestId('payment-modal')).toBeInTheDocument();
  });

  it('should open cancel modal when clicking "Cancel"', () => {
    render(<BookingHistoryDetail booking={mockBooking} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.getByTestId('cancel-modal')).toBeInTheDocument();
  });
});
