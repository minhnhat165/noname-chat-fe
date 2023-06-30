'use client';

import io, { Socket } from 'socket.io-client';

import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socket';
import { useUserStore } from '@/stores/user';

export interface SocketClientProps {}

export const SocketClient = (props: SocketClientProps) => {
  const { socket, setSocket } = useSocketStore();
  const user = useUserStore((state) => state.data!);
  useEffect(() => {
    const socket = io(process.env.SERVER_API_URL || 'http://localhost:5000');
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(user._id);
    if (socket) {
      socket.emit('join-app', user._id);
      socket.on('incoming-call', (callId: string) => {
        console.log('incoming call', callId);
      });
    }
  }, [socket, user._id]);

  return <></>;
};

export default SocketClient;
