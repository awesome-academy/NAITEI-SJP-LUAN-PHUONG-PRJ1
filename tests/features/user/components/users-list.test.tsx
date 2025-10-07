import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { UsersList } from '@/features/user/components/users-list';
import { useGetUsers } from '@/features/user/api/use-get-users';

import { HTTP_STATUS_CODE } from '@/constants';

// --- mock react-router ---
vi.mock('react-router', () => ({
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
}));

// --- mock feature hooks ---
vi.mock('@/features/auth', () => ({
  useGetProfile: () => ({ data: { role: { id: 3 } } }),
}));

vi.mock('@/features/booking', () => ({
  useDateTimeFormatter: () => ({
    formatDate: (v: string) => `formatted(${v})`,
  }),
}));

// --- mock api hooks ---
vi.mock('@/features/user/api/use-get-users', () => ({
  useGetUsers: vi.fn(),
}));
vi.mock('@/features/user/api/use-update-user', () => ({
  useUpdateUser: () => ({ mutate: vi.fn() }),
}));
vi.mock('@/features/user/api/use-update-user-status', () => ({
  useUpdateUserStatus: () => ({ mutate: vi.fn() }),
}));

// --- mock child components (optional to simplify DOM) ---
vi.mock('@/components/ui/breadcrumb-indies', () => ({
  BreadcrumbIndies: () => <div data-testid='breadcrumb' />,
}));
vi.mock('@/components/ui/skeleton', () => ({
  Skeleton: () => <div data-testid='skeleton' />,
}));
vi.mock('@/components/spin-loading', () => ({
  SpinLoading: () => <div data-testid='loading' />,
}));
vi.mock('@/components/not-found', () => ({
  NotFound: () => <div data-testid='not-found' />,
}));
vi.mock('@/components/general-error', () => ({
  GeneralError: ({ message }: { message: string }) => (
    <div data-testid='general-error'>{message}</div>
  ),
}));
vi.mock('@/components/empty', () => ({
  Empty: () => <div data-testid='empty' />,
}));

describe('UsersList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders loading state', () => {
    (useGetUsers as Mock).mockReturnValue({
      isPending: true,
    });

    render(<UsersList />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should renders not found error', () => {
    (useGetUsers as Mock).mockReturnValue({
      isError: true,
      error: {
        response: { data: { statusCode: HTTP_STATUS_CODE.NOT_FOUND } },
      },
    });

    render(<UsersList />);
    expect(screen.getByTestId('not-found')).toBeInTheDocument();
  });

  it('should renders general error', () => {
    (useGetUsers as Mock).mockReturnValue({
      isError: true,
      error: { response: { data: { message: 'Something went wrong' } } },
    });

    render(<UsersList />);
    expect(screen.getByTestId('general-error')).toHaveTextContent(
      'Something went wrong',
    );
  });

  it('should renders empty state when no users', () => {
    (useGetUsers as Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: { data: [], meta: { last_page: 1, current_page: 1 } },
    });

    render(<UsersList />);
    expect(screen.getByTestId('empty')).toBeInTheDocument();
  });

  it('should renders user table when users exist', () => {
    (useGetUsers as Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        data: [
          {
            id: 1,
            name: 'John',
            email: 'john@example.com',
            status: 'ACTIVE',
            phone_number: '0900000000',
            role: { id: 1 },
            created_at: '2025-01-01',
            email_verified_at: null,
          },
        ],
        meta: { last_page: 1, current_page: 1 },
      },
    });

    render(<UsersList />);

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
