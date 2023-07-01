'use client';

import { Avatar, MenuProps } from 'antd';
import { UserStore, useUserStore } from '@/stores/user';
import { extractRoomByCurrentUser, generateRoomByOtherUser } from '@/utils';
import { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { MenuHeader } from './menu-header';
import { RoomEvent } from '../room/room-folder';
import { roomApi } from '@/services/room-servers';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSocketStore } from '@/stores/socket';
import { userApi } from '@/services/user-services';

type Props = {
  roomId: string;
  flag: boolean;
};

const MessageHeader = (props: Props) => {
  const userCur = useUserStore((state: UserStore) => state.data);
  const socket = useSocketStore((state) => state.socket);
  const router = useRouter();

  const queryClient = useQueryClient();
  const {
    data: _room,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['room', props.roomId, props.flag],
    queryFn: () => roomApi.getRoom(props.roomId!),
    enabled: !!(props.roomId && props.flag),
    onError(err) {
      console.log(err);
    },
  });
  //console.log('chek', !!(props.roomId && !props.flag));
  const { data: user } = useQuery({
    queryKey: ['user', props.roomId, props.flag],
    queryFn: () => userApi.getMemberInfo(props.roomId!),
    enabled: !!(props.roomId && !props.flag),
    onError(err) {
      console.log(err);
    },
  });

  const room = useMemo(() => {
    if (_room || user) {
      let createRoom = _room?.data;
      if (user) {
        createRoom = generateRoomByOtherUser(user!!, userCur!!);
      }
      return extractRoomByCurrentUser(createRoom!!, userCur!);
    }
  }, [_room, user, userCur]);

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
    router.push('/chat');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Avatar size="large" src={room?.avatar} />
          <span className="ml-2 font-bold text-gray-800">{room?.name}</span>
        </div>
        <MenuHeader room={room} />
      </div>
    </div>
  );
};

export default MessageHeader;
