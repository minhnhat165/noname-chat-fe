'use client';

import { Button, Drawer } from 'antd';

import { Avatar } from './Avatar';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { Room } from '@/types/room';
import RoomItem from './RoomItem';
import SearchBar from './SearchBar';
import { User } from '@/types/user';
import { cn } from '@/utils/cn';
import { useState } from 'react';

export interface SidebarProps {}

const rooms: Room[] = [
  {
    id: 1,
    name: 'Room 1',
    description: 'Room 1 description',
    isGroup: false,
    users: [
      {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        name: 'User 1',
        email: '',
        username: '',
      },
      {
        id: '2',
        avatar:
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        name: 'User 2',
        email: '',
        username: '',
      },
    ],
    lastMessage: {
      id: 1,
      read: false,
      content: 'Last message',
      createdAt: '2021-10-10T00:00:00.000Z',
      user: {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        name: 'User 1',
        email: '',
        username: '',
      },
    },
  },
  {
    id: 2,
    name: 'Room 1',
    description: 'Room 1 description',
    isGroup: false,
    users: [
      {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
        name: 'User 1',
        email: '',
        username: '',
      },
      {
        id: '2',
        avatar:
          'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        name: 'User 2',
        email: '',
        username: '',
      },
    ],
    lastMessage: {
      id: 3,
      read: false,
      content: 'Last message lkajsfdlkjas lkajsdfla laksjfd;lkasjdf;laksjdflaksjdflaksjfd;la',
      createdAt: '2021-10-10T00:00:00.000Z',
      user: {
        id: '1',
        avatar:
          'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        name: 'User 1',
        email: '',
        username: '',
      },
    },
  },
];

const Sidebar = (props: SidebarProps) => {
  return (
    <div className="h-full w-96 bg-white">
      <Header />
      <div className={cn('px-2')}>
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              <RoomItem room={room} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

const Header = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };
  const onClose = () => {
    setDrawerVisible(false);
  };

  const user: User = {
    id: '1',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
    name: 'Nguyen Minh Nhat',
    email: 'nhatyugioh@gmail.com',
    username: 'nhatyugioh',
  };

  return (
    <div className="flex h-14 items-center justify-between px-4 py-2">
      <Button
        onClick={showDrawer}
        type="text"
        className="mr-2"
        shape="circle"
        icon={<MenuUnfoldOutlined />}
        size="large"
      />
      <SearchBar />
      <Drawer
        placement="left"
        closable={false}
        bodyStyle={{
          padding: '1rem',
        }}
        onClose={onClose}
        open={drawerVisible}
        width={280}
      >
        <div className="flex items-center gap-2">
          <Avatar size="medium" src={user.avatar} />
          <div>
            <h3 className="inline-block font-bold">{user.name}</h3>
            <p className="inline-block">{user.email}</p>
          </div>
        </div>
        <div></div>
      </Drawer>
    </div>
  );
};
