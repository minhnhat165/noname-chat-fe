'use client';

import { Button, Input } from 'antd';
import { GroupCreate, Header as HeaderGroup } from './group-create';
import { Search, SidebarSearch } from './sidebar-search';
import { createContext, useContext, useEffect, useState } from 'react';
import { rooms, users } from '@/stores/data-test';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { CreateChat } from '../chat';
import { RoomFolder } from '../room/room-folder';
import { cn } from '@/utils';
import { useSettingStore } from '@/stores/setting';
import { useSocketStore } from '@/stores/socket';
import { useUserStore } from '@/stores/user';

interface SidebarContextProps {
  isSearch: boolean;
  setIsSearch: (isSearch: boolean) => void;
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

  const screen = useSettingStore((state) => state.data.screen);

  const [searchResult, setSearchResult] = useState<Search>({
    rooms: rooms,
    users: users.slice(1, 4),
  });

  return (
    <SidebarContext.Provider
      value={{
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
      <div
        className={cn(
          'relative flex h-full flex-col border-r bg-white',
          screen == 'mobile' ? 'w-20' : 'w-[360px]',
        )}
      >
        {!isCreateGroup ? (
          <Header />
        ) : (
          !isStep2CreateGroup && <HeaderGroup username={username} setUsername={setUsername} />
        )}
        <div className=" overflow-y-overlay flex-1 ">
          {isSearch && !isCreateGroup && <SidebarSearch searchResult={searchResult} />}
          {isCreateGroup && <GroupCreate />}
          {!isCreateGroup ? <CreateChat /> : ''}
          <div className={isSearch || isCreateGroup || isStep2CreateGroup ? 'hidden' : 'block'}>
            <RoomFolder shorted={screen == 'mobile'} />
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
};

const Header = () => {
  const { isSearch, setIsSearch, searchValue, setSearchValue } = useSidebar();
  const { Search } = Input;
  return (
    <div className="flex h-14 items-center justify-between px-4 py-2">
      {isSearch && (
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
      )}
      <Search
        size="large"
        placeholder="search"
        allowClear
        onFocus={() => {
          setIsSearch(true);
        }}
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
        }}
      />
    </div>
  );
};
