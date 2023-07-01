import { roomApi } from '@/services/room-servers';
import { userApi } from '@/services/user-services';
import { UserStore, useUserStore } from '@/stores/user';
import { extractRoomByCurrentUser, generateRoomByOtherUser } from '@/utils';
import { MoreOutlined, PhoneOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Dropdown, MenuProps } from 'antd';

import { useMemo, useState } from 'react';

type Props = {
  roomId: string;
  flag: boolean;
};

const MessageHeader = (props: Props) => {
  const [avatar, setAvatar] = useState<string>();
  const [name, setName] = useState<string>();
  const userCur = useUserStore((state: UserStore) => state.data);
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', props.roomId, props.flag],
    queryFn: () => roomApi.getRoom(props.roomId!),
    enabled: !!(props.roomId && props.flag),
    onError(err) {
      console.log(err);
    },
    onSuccess(data) {
      setName(data?.data?.name);
      setAvatar(data?.data?.avatar);
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
    onSuccess: (data) => {
      setName(data?.username);
      setAvatar(data?.avatar);
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
          <Avatar size="large" src={roomm?.avatar} />
          <span className="ml-2 font-bold text-gray-800">{roomm?.name}</span>
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
