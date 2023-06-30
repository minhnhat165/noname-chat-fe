'use client';

import { ButtonNewChat } from './button-new';
import { Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { EditFilled, UsergroupAddOutlined, UserAddOutlined } from '@ant-design/icons';
import { useSidebar } from '../layout/sidebar';

const ITEMS_KEY = {
  NEW_GROUP: '0',
  NEW_CHAT: '1',
};

const items: MenuProps['items'] = [
  {
    key: ITEMS_KEY.NEW_GROUP,
    icon: <UsergroupAddOutlined />,
    label: 'New Group Chat',
    className: 'hover:bg-black',
  },
  {
    key: ITEMS_KEY.NEW_CHAT,
    icon: <UserAddOutlined />,
    label: 'New Private Chat',
  },
];

type Props = {};

export const CreateChat = (props: Props) => {
  const { setIsCreateGroup } = useSidebar();

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case ITEMS_KEY.NEW_CHAT:
        alert('chat');
        break;
      case ITEMS_KEY.NEW_GROUP:
        setIsCreateGroup(true);
        break;
    }
  };

  return (
    <>
      <div className="absolute bottom-10 right-4">
        <Dropdown
          overlayClassName="shadow-lg m-1"
          trigger={['click']}
          menu={{ items, onClick }}
          placement="topRight"
        >
          <Button
            type="primary"
            shape="circle"
            icon={<EditFilled />}
            size={'large'}
            onClick={(e) => {
              // e.stopPropagation();
              // e.preventDefault();
            }}
          />
        </Dropdown>
      </div>
    </>
  );
};

export default CreateChat;