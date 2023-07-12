import { callApi } from '@/services/call-services';
import { useMutation } from '@tanstack/react-query';
import { useSocketStore } from '@/stores/socket';
import { useState } from 'react';

type Options = {
  onEndSuccess?: () => void;
  onAcceptSuccess?: () => void;
  onRejectSuccess?: () => void;
};

export const useCallAction = (options?: Options) => {
  const socket = useSocketStore((state) => state.socket);
  const accept = useMutation({
    mutationFn: callApi.acceptCall,
    onSuccess(_, callId) {
      socket?.emit('accept-call', callId);
      options?.onAcceptSuccess?.();
    },
  });

  const reject = useMutation({
    mutationFn: callApi.rejectCall,
    onSuccess(_, callId) {
      socket?.emit('reject-call', callId);
      options?.onRejectSuccess?.();
    },
  });

  const end = useMutation({
    mutationFn: callApi.endCall,
    onSuccess(_, callId) {
      socket?.emit('end-call', callId);
      options?.onEndSuccess?.();
    },
  });

  return {
    acceptCall: accept.mutateAsync,
    rejectCall: reject.mutateAsync,
    endCall: end.mutateAsync,
    acceptCallLoading: accept.isLoading,
    rejectCallLoading: reject.isLoading,
    endCallLoading: end.isLoading,
  };
};
