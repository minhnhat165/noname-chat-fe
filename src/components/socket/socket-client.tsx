'use client';

import io, { Socket } from 'socket.io-client';

import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socket';

export interface SocketClientProps {}

export const SocketClient = (props: SocketClientProps) => {
  const { socket, setSocket } = useSocketStore();
  useEffect(() => {
    const socket = io(process.env.SERVER_API_URL || 'http://localhost:5000');
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

export default SocketClient;
