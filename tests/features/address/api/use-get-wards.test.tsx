import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { useGetWards } from '@/features/address/api/use-get-wards';
import { getWards } from '@/api/address';

vi.mock('@/api/address', () => ({
  getWards: vi.fn(),
}));

const mockedGetWards = getWards as ReturnType<typeof vi.fn>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGetWards', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return wards when provinceId is valid', async () => {
    const mockWards = [
      { id: 1, name: 'Ward 1' },
      { id: 2, name: 'Ward 2' },
    ];

    mockedGetWards.mockResolvedValueOnce(mockWards);

    const { result } = renderHook(() => useGetWards(10), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockWards);
    expect(mockedGetWards).toHaveBeenCalledWith(10);
  });

  it('should not run query when provinceId = 0', async () => {
    const { result } = renderHook(() => useGetWards(0), {
      wrapper: createWrapper(),
    });

    expect(result.current.isEnabled).not.toBe(true);
    expect(mockedGetWards).not.toHaveBeenCalled();
  });

  it('should handle error from API', async () => {
    const errorMessage = 'Failed to fetch';
    mockedGetWards.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useGetWards(5), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });
});
