import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { UpdateVenue } from '@/features/venue/components/update-venue';
import { useGetVenueDetail } from '@/features/venue/api';
import { useUpdateVenue } from '@/features/venue/api/use-update-venue';
import { useNavigate } from 'react-router';
import { HTTP_STATUS_CODE } from '@/constants';

vi.mock('react-router', () => ({
  useNavigate: vi.fn(),
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/features/venue/api/use-update-venue', () => ({
  useUpdateVenue: vi.fn(),
}));

vi.mock('@/features/venue/api', () => ({
  useGetVenueDetail: vi.fn(),
}));

vi.mock('@/components/spin-loading', () => ({
  SpinLoading: () => <div data-testid='spin-loading' />,
}));

vi.mock('@/components/not-found', () => ({
  NotFound: () => <div data-testid='not-found' />,
}));

vi.mock('@/components/general-error', () => ({
  GeneralError: ({ message }: { message?: string }) => (
    <div data-testid='general-error'>{message}</div>
  ),
}));

vi.mock('@/features/venue/components/venue-form', () => ({
  VenueForm: ({
    onSubmit,
    submitBtn,
    disabled,
  }: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (values: any) => void;
    submitBtn: React.ReactNode;
    disabled: boolean;
  }) => (
    <form
      data-testid='venue-form'
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name: 'Updated Venue' });
      }}
    >
      <button type='submit' disabled={disabled}>
        {submitBtn}
      </button>
    </form>
  ),
}));

describe('UpdateVenue', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
  });

  it('should renders loading state', () => {
    (useGetVenueDetail as Mock).mockReturnValue({
      isPending: true,
      isError: false,
    });

    render(<UpdateVenue venueId='1' />);
    expect(screen.getByTestId('spin-loading')).toBeInTheDocument();
  });

  it('should renders NotFound when 404 error', () => {
    (useGetVenueDetail as Mock).mockReturnValue({
      isPending: false,
      isError: true,
      error: {
        response: { data: { statusCode: HTTP_STATUS_CODE.NOT_FOUND } },
      },
    });

    render(<UpdateVenue venueId='1' />);
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('should renders GeneralError for other errors', () => {
    (useGetVenueDetail as Mock).mockReturnValue({
      isPending: false,
      isError: true,
      error: {
        response: { data: { message: 'Server error' } },
      },
    });

    render(<UpdateVenue venueId='1' />);
    expect(screen.getByTestId('general-error')).toHaveTextContent(
      'Server error',
    );
  });

  it('should renders form and breadcrumb when success', () => {
    (useGetVenueDetail as Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        name: 'Test Venue',
        description: 'Desc',
        address: 'Addr',
        lat: '1',
        lng: '1',
        ward_id: 2,
        ward: { province_id: 3 },
      },
    });

    (useUpdateVenue as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    });

    render(<UpdateVenue venueId='1' />);
    expect(screen.getByTestId('venue-form')).toBeInTheDocument();
  });

  it('should calls mutate and navigate on successful submit', () => {
    const mutateMock = vi.fn((_vars, opts) => opts.onSuccess?.());
    (useGetVenueDetail as Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        name: 'Test Venue',
        description: 'Desc',
        address: 'Addr',
        lat: 1,
        lng: 1,
        ward_id: 2,
        ward: { province_id: 3 },
      },
    });

    (useUpdateVenue as Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: false,
    });

    render(<UpdateVenue venueId='1' />);
    fireEvent.submit(screen.getByTestId('venue-form'));

    expect(mutateMock).toHaveBeenCalledWith(
      {
        id: '1',
        updateVenueDto: { name: 'Updated Venue' },
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/om/venues/1');
  });

  it('should disables submit when update is pending', () => {
    (useGetVenueDetail as Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        name: 'Venue',
        description: '',
        address: '',
        lat: 1,
        lng: 1,
        ward_id: 1,
        ward: { province_id: 1 },
      },
    });

    (useUpdateVenue as Mock).mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
    });

    render(<UpdateVenue venueId='1' />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
