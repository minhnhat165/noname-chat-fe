'use client';

import { Button, Drawer } from 'antd';
import { createContext, useContext, useState } from 'react';

import { MenuUnfoldOutlined } from '@ant-design/icons';
import { RoomItem } from '../room';
import { SearchBar } from '../common/search-bar';
import { SidebarMenu } from './sidebar-menu';
import { rooms } from '@/stores/data-test';

interface SidebarContextProps {
  showMenu: () => void;
  closeMenu: () => void;
  menuVisible: boolean;
}

export const SidebarContext = createContext<SidebarContextProps>({} as SidebarContextProps);

export const useSidebar = () => useContext(SidebarContext);

export const Sidebar = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = () => {
    setMenuVisible(true);
  };
  const closeMenu = () => {
    setMenuVisible(false);
  };
  return (
    <SidebarContext.Provider
      value={{
        showMenu,
        closeMenu,
        menuVisible,
      }}
    >
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
    </SidebarContext.Provider>
  );
};

const Header = () => {
  const { showMenu, closeMenu, menuVisible } = useSidebar();

  return (
    <div className="flex h-14 items-center justify-between px-4 py-2">
      <Button
        onClick={showMenu}
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
        onClose={closeMenu}
        open={menuVisible}
        width={280}
      >
        <SidebarMenu />
      </Drawer>
    </div>
  );
};
