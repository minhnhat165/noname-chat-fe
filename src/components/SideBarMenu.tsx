import { Button, Divider, Menu, MenuProps } from 'antd';
import {
  EditOutlined,
  HistoryOutlined,
  LogoutOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

import { Avatar } from './Avatar';
import { User } from '@/types/user';

export interface SideBarMenuProps {}

export const SideBarMenu = (props: SideBarMenuProps) => {
  const user: User = {
    id: '1',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    name: 'Nguyen Minh Nhat',
    email: 'nhatyugioh@gmail.com',
    username: 'nhatyugioh',
  };
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-2 px-4">
        <Avatar size="medium" src={user.avatar} />
        <div>
          <h3 className="inline-block font-bold">{user.name}</h3>
          <p className="inline-block">{user.email}</p>
        </div>
        <Button type="text" shape="circle" icon={<EditOutlined />} />
      </div>
      <Divider className="my-1" />
      <MenuAction />
      <div className="mt-auto">
        <Divider className="my-1" />
        <div className="py-2 text-center">
          <p className="text-center text-gray-500">Version 1.0.0</p>
          <p>
            copy right &copy; 2023 <span className="font-bold">Noname Chat App</span>
          </p>
        </div>
      </div>
    </div>
  );
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Create group', 'create-group', <UsergroupAddOutlined />),

  getItem('Call history', 'call-history', <HistoryOutlined />),

  getItem('Log out', 'sub4', <LogoutOutlined />),
];

const MenuAction = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };
  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />
  );
};
