'use client';

import { ArrowLeftOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, Drawer, Input } from 'antd';
import { Search, SidebarSearch } from './sidebar-search';
import { createContext, useContext, useEffect, useState } from 'react';
import { rooms, users } from '@/stores/data-test';

import { RoomFolder } from '../room/room-folder';
import { RoomList } from '../room';
import { CreateChat } from '../chat';
import { SidebarMenu } from './sidebar-menu';
import { GroupCreate, Header as HeaderGroup, GroupName } from './group-create';
import { useSocketStore } from '@/stores/socket';
import { useUserStore } from '@/stores/user';

interface SidebarContextProps {
  showMenu: () => void;
  closeMenu: () => void;
  isSearch: boolean;
  setIsSearch: (isSearch: boolean) => void;
  menuVisible: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  isCreateGroup: boolean;
  setIsCreateGroup: (isCreateGroup: boolean) => void;
  isStep2CreateGroup: boolean;
  setIsStep2CreateGroup: (isStep2CreateGroup: boolean) => void;
  username: string;
  setUsername: (value: string) => void;
  eventData: any;
  setEventData: (eventData: any) => void;
  // isReload: boolean;
  // setIdReload: (value:boolean) => void
}

export const SidebarContext = createContext<SidebarContextProps>({} as SidebarContextProps);

export const useSidebar = () => useContext(SidebarContext);

export const Sidebar = () => {
  const [username, setUsername] = useState<string>('');

  const user = useUserStore((state) => state.data!);
  const socket = useSocketStore((state) => state.socket);

  useEffect(() => {
    if (socket) {
      socket.emit('register-listenner', user?._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (socket && user) {
      socket?.on(`${user?._id}-event`, (data: any) => {
        console.log('on here ', data);
        setEventData(data);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, user]);

  // const [isReload, setIsReload] =
  const [eventData, setEventData] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [isStep2CreateGroup, setIsStep2CreateGroup] = useState(false);
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
        isCreateGroup,
        setIsCreateGroup,
        isStep2CreateGroup,
        setIsStep2CreateGroup,
        username,
        setUsername,
        eventData,
        setEventData,
      }}
    >
      {/* old 372px */}
      <div className="relative flex h-full w-[400px] flex-col border-r border-r-2 bg-slate-100">
        {/* {isStep2CreateGroup && <GroupName />} */}
        {!isCreateGroup ? (
          <Header />
        ) : (
          !isStep2CreateGroup && <HeaderGroup username={username} setUsername={setUsername} />
        )}
        <div className=" overflow-y-overlay flex-1 ">
          {!isSearch && !isCreateGroup && <RoomFolder />}
          {isSearch && !isCreateGroup && <SidebarSearch searchResult={searchResult} />}
          {isCreateGroup && <GroupCreate />}
          {!isCreateGroup ? <CreateChat /> : ''}
          <div className={isSearch || isCreateGroup || isStep2CreateGroup ? 'hidden' : 'block'}>
            <RoomFolder />
          </div>
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
    <div className="flex h-14 items-center justify-between bg-white px-4 py-2">
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
