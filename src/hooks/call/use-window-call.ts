'use client';

import { useCallback, useEffect, useState } from 'react';

import { CLOSE_CALL_MESSAGE } from '@/constants';
import { Room } from '@/types/room';

export function useWindowCall() {
  const [callWindow, setCallWindow] = useState<Window | null>(null);

  const openWindowCall = (roomId: Room['_id'], callId: string) => {
    const height = 400;
    const width = 640;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const newCallWindow = window.open(
      `/call/${roomId}?call_id=${callId}`,
      'Call',
      `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no,scrollbars=no,resizable=no,top=${top},left=${left}`,
    );
    if (newCallWindow) {
      setCallWindow(newCallWindow);
    }
  };

  const closeWindowCall = useCallback(() => {
    if (callWindow) {
      callWindow.close();
      setCallWindow(null);
    }
  }, [callWindow]);

  const handleWindowCallMessage = useCallback(
    (event: { data: { type: string } }) => {
      if (event.data && event.data.type === CLOSE_CALL_MESSAGE) {
        closeWindowCall();
      }
    },
    [closeWindowCall],
  );

  const handleUnload = useCallback(() => {
    if (!callWindow) return;
    if (!callWindow.closed) {
      setCallWindow(null);
      console.log('callWindow closed');
    }
  }, [callWindow]);

  useEffect(() => {
    if (callWindow) {
      window.addEventListener('message', handleWindowCallMessage);
      window.addEventListener('beforeunload', handleUnload);
    }

    return () => {
      if (callWindow) {
        window.removeEventListener('message', handleWindowCallMessage);
        window.removeEventListener('beforeunload', handleUnload);
      }
    };
  }, [callWindow, handleUnload, handleWindowCallMessage]);

  return { callWindow, openWindowCall, closeWindowCall };
}
