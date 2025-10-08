import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, Mocked } from 'vitest';
import { useGetSpaceTypes } from '@/features/space/api/use-get-space-types';
import { axios } from '@/api/axios';

vi.mock('@/api/axios', () => {
  return {
    axios: {
      get: vi.fn(),
    },
  };
});

const mockedAxios = axios as Mocked<typeof axios>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGetSpaceTypes', () => {
  it('should fetch and return space types', async () => {
    const mockData = [
      { id: 1, name: 'Conference Room' },
      { id: 2, name: 'Banquet Hall' },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: { data: mockData } });

    const { result } = renderHook(() => useGetSpaceTypes(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith('/space-types');
  });

  it('should handle error', async () => {
    const message = 'Network error';
    mockedAxios.get.mockRejectedValueOnce(new Error(message));

    const { result } = renderHook(() => useGetSpaceTypes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe(message);
  });
});
