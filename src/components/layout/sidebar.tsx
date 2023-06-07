'use client';

import { Button, Drawer } from 'antd';

import { MenuUnfoldOutlined } from '@ant-design/icons';
import { RoomItem } from '../room';
import { SearchBar } from '../common/search-bar';
import { SidebarMenu } from './sidebar-menu';
import { rooms } from '@/stores/data-test';
import { useState } from 'react';

export interface SidebarProps {}

export const Sidebar = (props: SidebarProps) => {
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
        <SidebarMenu />
      </Drawer>
    </div>
  );
};
