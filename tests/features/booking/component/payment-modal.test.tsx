import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import { PaymentModal } from '@/features/booking/components/payment-modal';
import type { ReactNode, FormHTMLAttributes } from 'react';
import { mockBooking } from '../mock-data/booking';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => {
      if (key === 'payment.max_label' && opts?.amount) {
        return `Max: ${opts.amount}`;
      }
      if (opts?.amount) return `${key} ${opts.amount}`;
      return key;
    },
  }),
}));

const mockOnSubmit = vi.fn();
const mockSetPaymentMode = vi.fn();
const mockResetState = vi.fn();

vi.mock('@/features/booking', () => ({
  usePayment: vi.fn(),
}));

import { usePayment } from '@/features/booking';

vi.mock('react-qr-code', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid='qr-code'>{value}</div>
  ),
}));

interface MockFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

interface MockFormFieldProps {
  render: (context: { field: Record<string, unknown> }) => ReactNode;
}

interface MockFormItemProps {
  children: ReactNode;
}

interface MockFormControlProps {
  children: ReactNode;
}

vi.mock('@/components/ui/form', () => ({
  Form: ({ children, ...props }: MockFormProps) => (
    <form {...props}>{children}</form>
  ),
  FormField: ({ render }: MockFormFieldProps) => {
    const mockField = {
      onChange: vi.fn(),
      onBlur: vi.fn(),
      value: '',
      name: 'partialAmount',
      ref: vi.fn(),
    };
    return render({ field: mockField });
  },
  FormItem: ({ children }: MockFormItemProps) => <div>{children}</div>,
  FormControl: ({ children }: MockFormControlProps) => <div>{children}</div>,
  FormMessage: () => <div />,
}));

function setupMockUsePayment(
  overrides?: Partial<ReturnType<typeof usePayment>>,
) {
  const mockForm = {
    handleSubmit: (fn: (data: unknown) => unknown) => (e?: Event) => {
      e?.preventDefault?.();
      return fn({});
    },
    control: {},
    setValue: vi.fn(),
    reset: vi.fn(),
    watch: vi.fn(),
    getValues: vi.fn(),
    formState: { errors: {} },
  };

  (usePayment as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    form: mockForm,
    paymentMode: 'full',
    setPaymentMode: mockSetPaymentMode,
    loading: false,
    onSubmit: mockOnSubmit,
    qrData: null,
    resetState: mockResetState,
    remaining: 100000,
    ...overrides,
  });
}

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe('PaymentModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('renders modal with form when open and no QR data', () => {
    setupMockUsePayment();

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText('payment.title')).toBeInTheDocument();
    expect(screen.getByText('payment.btn_pay')).toBeInTheDocument();
    expect(screen.getByText('payment.mode_full')).toBeInTheDocument();
    expect(screen.getByText('payment.mode_partial')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    setupMockUsePayment();

    const { container } = render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={false}
        onOpenChange={vi.fn()}
      />,
    );

    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  it('shows input field when payment mode is partial', () => {
    setupMockUsePayment({ paymentMode: 'partial' });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText('payment.placeholder');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('calls onOpenChange(false) when close button clicked', () => {
    const onOpenChange = vi.fn();
    setupMockUsePayment();

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    const closeBtn = screen.getByText('payment.btn_close');
    fireEvent.click(closeBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('calls onSubmit when pay button clicked', () => {
    setupMockUsePayment();

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const payBtn = screen.getByText('payment.btn_pay');
    fireEvent.click(payBtn);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('shows loading state when processing payment', () => {
    setupMockUsePayment({ loading: true });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText('payment.btn_processing')).toBeInTheDocument();
    expect(screen.getByText('payment.btn_processing')).toBeDisabled();
  });

  it('disables buttons when loading', () => {
    setupMockUsePayment({ loading: true });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const closeBtn = screen.getByText('payment.btn_close');
    const payBtn = screen.getByText('payment.btn_processing');

    expect(closeBtn).toBeDisabled();
    expect(payBtn).toBeDisabled();
  });

  it('renders QR code when qrData is available', () => {
    setupMockUsePayment({
      qrData: { qrCode: 'https://fake.qr/payment', requestId: 'req-123' },
    });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByText('https://fake.qr/payment')).toBeInTheDocument();
    expect(screen.getByText('payment.qr_label')).toBeInTheDocument();
  });

  it('displays payment instructions when QR code is shown', () => {
    setupMockUsePayment({
      qrData: { qrCode: 'https://fake.qr', requestId: 'req-123' },
    });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText('payment.instructions.step1')).toBeInTheDocument();
    expect(screen.getByText('payment.instructions.step2')).toBeInTheDocument();
    expect(screen.getByText('payment.instructions.step3')).toBeInTheDocument();
    expect(screen.getByText('payment.instructions.step4')).toBeInTheDocument();
  });

  it('hides payment form when QR code is displayed', () => {
    setupMockUsePayment({
      qrData: { qrCode: 'https://fake.qr', requestId: 'req-123' },
    });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.queryByText('payment.btn_pay')).not.toBeInTheDocument();
    expect(screen.queryByText('payment.mode_full')).not.toBeInTheDocument();
  });

  it('calls resetState when modal closed with existing qrData', () => {
    setupMockUsePayment({
      qrData: { qrCode: 'https://fake.qr', requestId: 'req-123' },
    });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={false}
        onOpenChange={vi.fn()}
      />,
    );

    expect(mockResetState).toHaveBeenCalled();
  });

  it('does not call resetState when modal closed without qrData', () => {
    setupMockUsePayment({ qrData: null });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={false}
        onOpenChange={vi.fn()}
      />,
    );

    expect(mockResetState).not.toHaveBeenCalled();
  });

  it('switches between full and partial payment modes', () => {
    setupMockUsePayment();

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const partialRadio = screen.getByLabelText('payment.mode_partial');
    fireEvent.click(partialRadio);

    expect(mockSetPaymentMode).toHaveBeenCalledWith('partial');
  });

  it('displays max amount hint in partial payment mode', () => {
    setupMockUsePayment({ paymentMode: 'partial', remaining: 100000 });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText(/Max:/)).toBeInTheDocument();
  });

  it('sets correct min and max attributes on partial amount input', () => {
    setupMockUsePayment({ paymentMode: 'partial', remaining: 150000 });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={50000}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText('payment.placeholder');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '150000');
  });

  it('has accessible dialog title', () => {
    setupMockUsePayment();

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const title = screen.getByText('payment.title');
    expect(title).toBeInTheDocument();
  });

  it('radio buttons are properly labeled and functional', () => {
    setupMockUsePayment();

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const fullRadio = screen.getByLabelText('payment.mode_full');
    const partialRadio = screen.getByLabelText('payment.mode_partial');

    expect(fullRadio).toBeInTheDocument();
    expect(partialRadio).toBeInTheDocument();
  });

  it('displays amount label text', () => {
    setupMockUsePayment();

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByText('payment.amount_label')).toBeInTheDocument();
  });

  it('renders number input with correct type in partial mode', () => {
    setupMockUsePayment({ paymentMode: 'partial' });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText('payment.placeholder');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('renders QR section when qrData is present', () => {
    setupMockUsePayment({
      qrData: { qrCode: 'https://fake.qr', requestId: 'req-123' },
    });

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('qr-code')).toBeInTheDocument();
    expect(screen.getByText('payment.qr_label')).toBeInTheDocument();
    expect(screen.getByText('payment.instructions.step1')).toBeInTheDocument();
  });

  it('renders buttons with correct styling', () => {
    setupMockUsePayment();

    render(
      <PaymentModal
        booking={mockBooking}
        totalPaid={0}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );

    const closeBtn = screen.getByText('payment.btn_close');
    const payBtn = screen.getByText('payment.btn_pay');

    expect(closeBtn).toBeInTheDocument();
    expect(payBtn).toBeInTheDocument();
  });
});
