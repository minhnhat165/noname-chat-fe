'use client';

import { UserStore, useUserStore } from '@/stores/user';
import { extractRoomByCurrentUser, generateRoomByOtherUser } from '@/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar } from 'antd';
import { useCallback, useEffect } from 'react';

import { userApi } from '@/services/user-services';
import { useSocketStore } from '@/stores/socket';
import { Room } from '@/types/room';
import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { RoomEvent } from '../room/room-folder';
import { MenuHeader } from './menu-header';

type Props = {
  room: Room | undefined;
  flag: boolean;
};

const MessageHeader = (props: Props) => {
  const userCur = useUserStore((state: UserStore) => state.data);
  const socket = useSocketStore((state) => state.socket);
  const Id = useParams()?.id as string;
  const router = useRouter();
  let userId = Id;
  // console.log(props.room);
  // useMemo(() => {
  //   if (!props.room?.isGroup) {
  //     props.room?.participants.forEach((participant) => {
  //       if (participant !== userCur?._id) {
  //         // eslint-disable-next-line react-hooks/exhaustive-deps
  //         userId = participant;
  //       }
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [props.room]);
  const queryClient = useQueryClient();
  const { data: user } = useQuery({
    queryKey: ['user', Id],
    queryFn: () => userApi.getMemberInfo(userId),
    enabled: props.room === null,
  });

  const _room = useMemo(() => {
    if (!!props.room || user) {
      let createRoom = props.room;
      if (user) {
        createRoom = generateRoomByOtherUser(user!!, userCur!!);
      }
      if (!props.room?.isGroup) {
        props.room?.participants.forEach((participant) => {
          if (participant._id !== userCur?._id) {
            createRoom = generateRoomByOtherUser(participant, userCur!!);
          }
        });
      }
      return extractRoomByCurrentUser(createRoom!!, userCur!);
    }
  }, [props.room, user, userCur]);

  const handleRoomUpdated = useCallback(
    (data: RoomEvent) => {
      // queryClient.setQueryData(['room', props.roomId, props.flag], (oldData: any) => {
      //   return { ...oldData, data: { ...oldData.data, ...data.payload } };
      // });
      // queryClient.invalidateQueries(['room', props.roomId, props.flag]);
      queryClient.invalidateQueries(['room', Id]);
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
      if (data.userId == user?._id) {
        router.push('/chat');
      }
      // queryClient.invalidateQueries(['room', props.roomId, props.flag]);
      queryClient.invalidateQueries(['room', Id]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <Avatar size="large" src={_room?.avatar} />
          <span className="ml-2 font-bold text-gray-800">{_room?.name}</span>
        </div>
        <MenuHeader room={props.room} />
      </div>
    </div>
  );
};

export default MessageHeader;
