import { QueryClient } from '@tanstack/react-query';

const config = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: config });
