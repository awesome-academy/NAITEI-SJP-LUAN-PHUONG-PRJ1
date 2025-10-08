import {
  OmitKeyof,
  QueryClient,
  QueryObserverOptions,
} from '@tanstack/react-query';
import { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { getBookingQuery, getMyBookingListQueryKey } from '@/features/booking';
import { getProfileQueryKey } from '@/features/auth';

const defaultQueryConfig: OmitKeyof<
  QueryObserverOptions<
    unknown,
    Error,
    unknown,
    unknown,
    readonly unknown[],
    never
  >,
  'suspense' | 'queryKey',
  'strictly'
> = {
  staleTime: 1000 * 60,
  gcTime: 1000 * 60 * 60 * 24,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
};

export const queryClient = new QueryClient({
  defaultOptions: { queries: defaultQueryConfig },
});

const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

export const persistOptions: OmitKeyof<
  PersistQueryClientOptions,
  'queryClient'
> = {
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) =>
      query.queryKey[0] === getBookingQuery()[0] ||
      query.queryKey[0] === getMyBookingListQueryKey()[0] ||
      query.queryKey[0] === getProfileQueryKey()[0],
  },
};
