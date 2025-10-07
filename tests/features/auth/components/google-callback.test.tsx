import { act, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { GoogleCallback } from '@/features/auth/components/google-callback';
import { useSignInGoogle } from '@/features/auth/api/use-sign-in-google';
import { useSearchParams } from 'react-router';

vi.mock('react-router', () => ({
  useSearchParams: vi.fn(),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/features/auth/api/use-sign-in-google', () => ({
  useSignInGoogle: vi.fn(),
}));

vi.mock('@/components/general-error', () => ({
  GeneralError: () => <div data-testid='general-error'>Error Component</div>,
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <div data-testid='arrow-left'>Arrow Left Component</div>,
  CircleCheckBig: () => (
    <div data-testid='circle-check-big'>Circle Check Big Component</div>
  ),
  Loader2: () => <div data-testid='loader'>Loader Component</div>,
}));

describe('GoogleCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should renders loader when pending', () => {
    (useSignInGoogle as Mock).mockReturnValue({
      isIdle: true,
      isPending: false,
      isError: false,
      mutate: vi.fn(),
    });

    (useSearchParams as Mock).mockReturnValue([new URLSearchParams()]);

    render(<GoogleCallback />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should calls mutate after 1 second', async () => {
    const mutateMock = vi.fn();
    (useSignInGoogle as Mock).mockReturnValue({
      isIdle: true,
      isPending: false,
      isError: false,
      mutate: mutateMock,
    });
    (useSearchParams as Mock).mockReturnValue([
      new URLSearchParams('code=123'),
    ]);

    render(<GoogleCallback />);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(mutateMock).toHaveBeenCalledTimes(1);
  });

  it('should renders error view when isError = true', () => {
    (useSignInGoogle as Mock).mockReturnValue({
      isIdle: false,
      isPending: false,
      isError: true,
      mutate: vi.fn(),
    });
    (useSearchParams as Mock).mockReturnValue([new URLSearchParams()]);

    render(<GoogleCallback />);
    expect(screen.getByTestId('general-error')).toBeInTheDocument();
    expect(screen.getByText('back_to_home')).toBeInTheDocument();
  });

  it('should renders success view when successful', () => {
    (useSignInGoogle as Mock).mockReturnValue({
      isIdle: false,
      isPending: false,
      isError: false,
      mutate: vi.fn(),
    });
    (useSearchParams as Mock).mockReturnValue([new URLSearchParams()]);

    render(<GoogleCallback />);

    expect(screen.getByText('login_success')).toBeInTheDocument();
    expect(screen.getByText('back_to_home')).toBeInTheDocument();
  });
});
