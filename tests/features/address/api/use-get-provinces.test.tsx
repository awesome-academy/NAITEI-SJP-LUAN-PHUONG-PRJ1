import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';
import { useGetProvinces } from '@/features/address/api/use-get-provinces';
import { getProvinces } from '@/api/address';

vi.mock('@/api/address', () => ({
  getProvinces: vi.fn(),
}));

const mockedGetProvinces = getProvinces as ReturnType<typeof vi.fn>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGetProvinces', () => {
  it('should fetch and return provinces successfully', async () => {
    const mockProvinces = [
      { id: 1, name: 'Province A' },
      { id: 2, name: 'Province B' },
    ];

    mockedGetProvinces.mockResolvedValueOnce(mockProvinces);

    const { result } = renderHook(() => useGetProvinces(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProvinces);
    expect(mockedGetProvinces).toHaveBeenCalledTimes(1);
  });

  it('should handle API error properly', async () => {
    const errorMessage = 'Network Error';
    mockedGetProvinces.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useGetProvinces(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(errorMessage);
  });
});
