'use client';

import io from 'socket.io-client';
import { removeToken } from '@/app/actions';
import { useAppStore } from '@/stores/app';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSocketStore } from '@/stores/socket';
import { useUserStore } from '@/stores/user';

export interface SocketClientProps {}

export const SocketClient = (props: SocketClientProps) => {
  const { socket, setSocket } = useSocketStore();
  const { data, setUsersOnline, addUserOnline, removeUserOnline } = useAppStore();
  const user = useUserStore((state) => state.data!);
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_SERVER_API_URL || 'http://localhost:5000');
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (socket) {
      socket.emit('join-app', user?._id);
      socket.on('all-users-online', (userIds: string[]) => {
        setUsersOnline(userIds);
      });
      socket.on('new-user-online', (userId: string) => {
        addUserOnline(userId);
      });
      socket.on('user-offline', (userId: string) => {
        removeUserOnline(userId);
      });
      socket.on('user.locked', () => {
        router.push('/banned');
        removeToken();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user?._id]);
  console.log(data.usersOnline);
  return <></>;
};

export default SocketClient;
