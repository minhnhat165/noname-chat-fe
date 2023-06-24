'use client';

import io, { Socket } from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useSocketStore } from '@/stores/socket';
import { useMutation } from '@tanstack/react-query';
import { axios } from '@/lib';

type Props = {};

const Page = (props: Props) => {
  // const [socket, setSocket] = useState<Socket>();
  const socket = useSocketStore((state) => state.socket);
  const [value, setValue] = useState<string>('');
  const [event, setEvent] = useState<string>('');

  // useEffect(() => {
  //   const newSocket = io('http://localhost:5000');
  //   setSocket(newSocket);
  // }, [setSocket]);

  const { mutate } = useMutation({
    mutationFn: (data: any) => axios.post(`http://localhost:3000/api/messages/test`, data),
  });

  useEffect(() => {
    socket?.emit('join-room', '649548c616842766034130dc');
    socket?.emit('join-event', 'userId');
  }, [socket]);

  const messageReceived = (message: string) => {
    console.log('received from server', message);
    setValue(message);
  };

  useEffect(() => {
    socket?.on('message-new', messageReceived);
    return () => {
      socket?.off('message-new', messageReceived);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageReceived, socket]);

  const received = (data: string) => {
    console.log('received123: ', data);
    setEvent(JSON.stringify(data));
  };

  const testSocket = async () => {
    const res = await axios.get('http://localhost:3000/api/users/test');
    // const result = await res.json();
    const result = res;
    console.log(result);
  };

  // useEffect(() => {
  //   testSocket();
  // }, []);

  useEffect(() => {
    socket?.on('event-new', received);
    return () => {
      socket?.off('event-new', received);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [received]);

  return (
    <div>
      <button
        onClick={() => {
          testSocket();
        }}
      >
        click me
      </button>{' '}
      <button
        className="ml-5"
        onClick={() => {
          // testSocket();
          mutate({
            type: 'TEXT',
            content: 'this is message',
            room: '649548c616842766034130dc',
          });
        }}
      >
        send message
      </button>{' '}
      <p> value: {value} </p>
      <p> event: {event} </p>
    </div>
  );
};

export default Page;
