import { roomApi } from '@/services/room-servers';
import { MoreOutlined, PhoneOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Dropdown, MenuProps } from 'antd';

import React from 'react';

type Props = {
  roomId: string;
};

const MessageHeader = (props: Props) => {
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', props.roomId],
    queryFn: () => roomApi.getRoom(props.roomId!),
    enabled: !!props.roomId,
    onError(err) {
      console.log(err);
    },
  });
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
        <div className="flex w-24 justify-between">
          <SearchOutlined />
          <PhoneOutlined />
          <Dropdown overlayClassName="w-40" menu={{ items }} placement="bottomRight">
            <MoreOutlined />
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
