import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { Call } from '@/types/call';
import { SingleResponse } from '@/types/api';
import { callApi } from '@/services/call-services';

export function useCreateCall(
  options?: UseMutationOptions<SingleResponse<Call>, unknown, string, unknown>,
) {
  return useMutation({
    mutationFn: callApi.createCall,
    ...options,
  });
}
