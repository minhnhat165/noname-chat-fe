'use client';

import { SingleResponse, SuccessResponse } from '@/types/api';
import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { User } from '@/types/user';
import { adminApi } from '@/services/admin-services';

export const useToggleLockUser = (
  options?: UseMutationOptions<SingleResponse<User>, unknown, User['_id'], unknown>,
) => {
  const { mutate: lock, isLoading: lockLoading } = useMutation({
    mutationFn: adminApi.lock,
    ...options,
  });
  const { mutate: unlock, isLoading: unLockLoading } = useMutation({
    mutationFn: adminApi.unlock,
    ...options,
  });
  const toggleLock = (id: User['_id'], isLocked: boolean) => {
    if (isLocked) {
      unlock(id);
    } else {
      lock(id);
    }
  };

  return {
    toggleLock,
    loading: lockLoading || unLockLoading,
  };
};
