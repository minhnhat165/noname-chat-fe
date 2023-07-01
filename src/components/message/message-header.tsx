'use client';

import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Avatar } from 'antd';
import { MenuHeader } from './menu-header';
import { RoomEvent } from '../room/room-folder';
import { roomApi } from '@/services/room-servers';
import { useSocketStore } from '@/stores/socket/socket-store';

type Props = {
  roomId: string;
};

const MessageHeader = (props: Props) => {
  const socket = useSocketStore((state) => state.socket);

  const queryClient = useQueryClient();

  const {
    data: room,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['room', props.roomId],
    queryFn: () => roomApi.getRoom(props.roomId!),
    enabled: !!props.roomId,
    onError(err) {
      console.log(err);
    },
  });

  const handleRoomUpdated = useCallback(
    (data: RoomEvent) => {
      queryClient.setQueryData(['room', data.payload._id], (oldData: any) => {
        return { ...oldData, data: { ...oldData.data, ...data.payload } };
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket],
  );

  const handleOuted = useCallback(async (data: RoomEvent) => {
    // await redirect('/');
  }, []);

  useEffect(() => {
    socket?.on('room-updated', handleRoomUpdated);
    return () => {
      socket?.off('room-updated', handleRoomUpdated);
    };
  }, [socket, handleRoomUpdated]);

  useEffect(() => {
    socket?.on('room.outed', handleOuted);
    return () => {
      socket?.off('room.outed', handleOuted);
    };
  }, [socket, handleOuted]);

  const onRemoveMember = useCallback(
    (data: RoomEvent) => {
      queryClient.setQueryData(['room', data.payload._id], (oldData: any) => {
        return { ...oldData, data: { ...oldData.data, ...data.payload } };
      });
    },
    [queryClient],
  );

  useEffect(() => {
    socket?.on('room.removed', onRemoveMember);
    return () => {
      socket?.off('room.removed', onRemoveMember);
    };
  }, [socket, onRemoveMember]);

  return (
    <div>
      <div className="flex h-14 w-full flex-shrink-0 items-center justify-between bg-white px-5">
        <div className="flex items-center">
          <Avatar size="large" src={room?.data.avatar} />
          <span className="ml-2 font-bold text-gray-800">{room?.data.name}</span>
        </div>
        <MenuHeader room={room?.data} />
      </div>
    </div>
  );
};

export default MessageHeader;
