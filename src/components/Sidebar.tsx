'use client';

import { Button, Drawer } from 'antd';

import { Room } from '@/types/room';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { useState } from 'react';
import RoomItem from './RoomItem';
import SearchBar from './SearchBar';
import { SideBarMenu } from './SideBarMenu';
import { rooms } from '@/stores/data-test';

export interface SidebarProps {}

const Sidebar = (props: SidebarProps) => {
  return (
    <div className="h-full w-96 border-r-2 bg-white">
      <Header />
      <div className="p-2">
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
          padding: '0rem',
        }}
        onClose={onClose}
        open={drawerVisible}
        width={280}
      >
        <SideBarMenu />
      </Drawer>
    </div>
  );
};
