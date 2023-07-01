import { roomApi } from '@/services/room-servers';
import { userApi } from '@/services/user-services';
import { UserStore, useUserStore } from '@/stores/user';
import { extractRoomByCurrentUser, generateRoomByOtherUser } from '@/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, MenuProps } from 'antd';

import { useMemo } from 'react';

import { useCallback, useEffect } from 'react';

import { useSocketStore } from '@/stores/socket';
import { RoomEvent } from '../room/room-folder';
import { MenuHeader } from './menu-header';

type Props = {
  roomId: string;
  flag: boolean;
};

const MessageHeader = (props: Props) => {
  const userCur = useUserStore((state: UserStore) => state.data);
  const socket = useSocketStore((state) => state.socket);

  const queryClient = useQueryClient();
  const {
    data: room,
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

  const roomm = useMemo(() => {
    if (room || user) {
      let createRoom = room?.data;
      if (user) {
        createRoom = generateRoomByOtherUser(user!!, userCur!!);
      }
      return extractRoomByCurrentUser(createRoom!!, userCur!);
    }
  }, [room, user, userCur]);
  // useEffect(() => {
  //   if (props.flag) {
  //     setName(room?.data.avatar);
  //     setAvatar(room?.data.avatar);
  //   } else {
  //     console.log('vo');
  //     setName(user?.data.avatar);
  //     setAvatar(user?.data.avatar);
  //   }
  // }, [props.flag, props.roomId]);
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
          className="text-base"
        >
          2nd menu item
        </a>
      ),
    },
  ];

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
          <Avatar size="large" src={roomm?.avatar} />
          <span className="ml-2 font-bold text-gray-800">{roomm?.name}</span>
        </div>
        <MenuHeader room={room?.data} />
      </div>
    </div>
  );
};

export default MessageHeader;
