import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { Call } from '@/types/call';
import { callApi } from '@/services/call-services';
import { singleResponse } from '@/types/api';

export function useCreateCall(
  options?: UseMutationOptions<singleResponse<Call>, unknown, string, unknown>,
) {
  return useMutation({
    mutationFn: callApi.createCall,
    ...options,
  });
}
