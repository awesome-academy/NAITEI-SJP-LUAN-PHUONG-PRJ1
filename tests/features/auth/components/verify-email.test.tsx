import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach, afterEach } from 'vitest';
import { VerifyEmail } from '@/features/auth/components/verify-email';
import { useVerifyEmail } from '@/features/auth/api/use-verify-email';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

vi.mock('react-router', () => ({
  useSearchParams: vi.fn(),
  useNavigate: vi.fn(),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
  Navigate: ({ to }: { to: string }) => (
    <div data-testid='navigate'>Redirect {to}</div>
  ),
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid='arrow-left'>Arrow Left Component</div>,
  CircleCheckBig: () => (
    <div data-testid='circle-check-big'>Circle Check Big Component</div>
  ),
  Loader2: () => <div data-testid='loader'>Loader Component</div>,
}));

vi.mock('@/features/auth/api/use-verify-email', () => ({
  useVerifyEmail: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: vi.fn(),
}));

describe('VerifyEmail', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should redirects if token is missing', () => {
    (useSearchParams as Mock).mockReturnValue([new URLSearchParams()]);
    (useVerifyEmail as Mock).mockReturnValue({
      mutate: vi.fn(),
      isIdle: false,
      isPending: false,
    });

    render(<VerifyEmail />);
    expect(screen.getByTestId('navigate')).toHaveTextContent('Redirect /');
  });

  it('should renders loader when pending', () => {
    (useSearchParams as Mock).mockReturnValue([
      new URLSearchParams('token=abc'),
    ]);
    (useVerifyEmail as Mock).mockReturnValue({
      mutate: vi.fn(),
      isIdle: true,
      isPending: false,
    });

    render(<VerifyEmail />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should calls mutate after 1 second with token', async () => {
    const mutateMock = vi.fn();
    (useSearchParams as Mock).mockReturnValue([
      new URLSearchParams('token=xyz'),
    ]);
    (useVerifyEmail as Mock).mockReturnValue({
      mutate: mutateMock,
      isIdle: true,
      isPending: false,
      isError: false,
    });

    render(<VerifyEmail />);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(mutateMock).toHaveBeenCalledTimes(1);
    expect(mutateMock).toHaveBeenCalledWith(
      { token: 'xyz' },
      expect.objectContaining({
        onError: expect.any(Function),
      }),
    );
  });

  it('should calls toast + navigate on error callback', async () => {
    const mutateMock = vi.fn((_vars, opts) => {
      opts?.onError?.();
    });

    (useSearchParams as Mock).mockReturnValue([
      new URLSearchParams('token=abc'),
    ]);
    (useVerifyEmail as Mock).mockReturnValue({
      mutate: mutateMock,
      isIdle: false,
      isPending: false,
      isError: false,
    });

    render(<VerifyEmail />);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(toast).toHaveBeenCalledWith('email_verification_error');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should renders success UI after verification success', () => {
    (useSearchParams as Mock).mockReturnValue([
      new URLSearchParams('token=abc'),
    ]);
    (useVerifyEmail as Mock).mockReturnValue({
      mutate: vi.fn(),
      isIdle: false,
      isPending: false,
      isError: false,
    });

    render(<VerifyEmail />);
    expect(screen.getByText('email_verification_success')).toBeInTheDocument();
    expect(screen.getByText('back_to_sign_in')).toBeInTheDocument();
  });
});
