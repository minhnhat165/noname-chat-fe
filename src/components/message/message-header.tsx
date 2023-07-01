'use client';

import { roomApi } from '@/services/room-servers';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Avatar, Dropdown, MenuProps, Button } from 'antd';

import { useCallback, useEffect } from 'react';
import { MenuHeader } from './menu-header';
import { useSocketStore } from '@/stores/socket/socket-store';
import { RoomEvent } from '../room/room-folder';

type Props = {
  roomId: string;
};

const MessageHeader = (props: Props) => {
  const socket = useSocketStore((state) => state.socket);

  const queryClient = useQueryClient();

  const { data: room, isLoading } = useQuery({
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

  useEffect(() => {
    socket?.on('room-updated', handleRoomUpdated);
    return () => {
      socket?.off('room-updated', handleRoomUpdated);
    };
  }, [socket, handleRoomUpdated]);

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
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
  return (
    <div>
      <div className="flex h-14 w-full flex-shrink-0 items-center justify-between bg-white px-5">
        <div className="flex items-center">
          <Avatar size="large" src={room?.data.avatar} />
          <span className="ml-2 font-bold text-gray-800">{room?.data.name}</span>
        </div>
        <MenuHeader room={room?.data} />
        {/* <div className="flex w-24 items-center justify-between">
        <SearchOutlined />
        <PhoneOutlined />
        <Button type="text" icon={<MoreOutlined />} onClick={openGroupMenu} />
         <Dropdown overlayClassName="w-40" menu={{ items }} placement="bottomRight">
            <MoreOutlined />
          </Dropdown> 
      </div> */}
      </div>
    </div>
  );
};

export default MessageHeader;
