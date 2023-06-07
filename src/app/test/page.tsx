'use client';

import io, { Socket } from 'socket.io-client';
import { useState, useEffect } from 'react';

type Props = {};

const Page = (props: Props) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io('http://localhost:8001');
    setSocket(newSocket);
  }, [setSocket]);

  const messageReceived = (message: string) => {
    console.log('received from server', message);
  };

  useEffect(() => {
    socket?.on('message', messageReceived);
    return () => {
      socket?.off('message', messageReceived);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageReceived]);

  const received = (data: string) => {
    console.log('received', data);
  };

  useEffect(() => {
    socket?.on('test-emit', received);
    return () => {
      socket?.off('test-emit', received);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [received]);

  return (
    <div>
      <button
        onClick={() => {
          socket?.emit('test-emit', 'message from client');
        }}
      >
        click me
      </button>{' '}
    </div>
  );
};

export default Page;
