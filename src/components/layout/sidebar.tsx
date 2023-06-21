'use client';

import { ArrowLeftOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Drawer, Input } from 'antd';
import { Search, SidebarSearch } from './sidebar-search';
import { createContext, useContext, useState } from 'react';
import { rooms, users } from '@/stores/data-test';

import { RoomFolder } from '../room/room-folder';
import { RoomList } from '../room';
import { SidebarMenu } from './sidebar-menu';

interface SidebarContextProps {
  showMenu: () => void;
  closeMenu: () => void;
  isSearch: boolean;
  setIsSearch: (isSearch: boolean) => void;
  menuVisible: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const SidebarContext = createContext<SidebarContextProps>({} as SidebarContextProps);

export const useSidebar = () => useContext(SidebarContext);

export const Sidebar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [searchResult, setSearchResult] = useState<Search>({
    rooms: rooms,
    users: users.slice(1, 4),
  });

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
        isSearch,
        setIsSearch,
        searchValue,
        setSearchValue,
      }}
    >
      <div className="flex h-full w-[372px] flex-col border-r bg-white">
        <Header />
        <div className=" flex-1 overflow-y-scroll p-2">
          {!isSearch && <RoomFolder />}
          {isSearch && <SidebarSearch searchResult={searchResult} />}
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

const Header = () => {
  const { showMenu, closeMenu, menuVisible, isSearch, setIsSearch, searchValue, setSearchValue } =
    useSidebar();
  const { Search } = Input;
  return (
    <div className="flex h-14 items-center justify-between px-4 py-2">
      {isSearch ? (
        <Button
          onClick={() => {
            setIsSearch(false);
          }}
          type="text"
          className="mr-2"
          shape="circle"
          icon={<ArrowLeftOutlined />}
          size="large"
        />
      ) : (
        <Button
          onClick={showMenu}
          type="text"
          className="mr-2"
          shape="circle"
          icon={<MenuUnfoldOutlined />}
          size="large"
        />
      )}
      <Search
        size="large"
        placeholder="input search text"
        allowClear
        onFocus={() => {
          setIsSearch(true);
        }}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
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
