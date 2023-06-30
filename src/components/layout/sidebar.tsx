'use client';

import { Button, Input } from 'antd';
import { Search, SidebarSearch } from './sidebar-search';
import { createContext, useContext, useState } from 'react';
import { rooms, users } from '@/stores/data-test';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { RoomFolder } from '../room/room-folder';
import { cn } from '@/utils';
import { useSettingStore } from '@/stores/setting';

interface SidebarContextProps {
  isSearch: boolean;
  setIsSearch: (isSearch: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const SidebarContext = createContext<SidebarContextProps>({} as SidebarContextProps);

export const useSidebar = () => useContext(SidebarContext);

export const Sidebar = () => {
  const [isSearch, setIsSearch] = useState(false);
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
      }}
    >
      <div
        className={cn(
          'flex h-full flex-col border-r bg-white',
          screen == 'mobile' ? 'w-20' : 'w-[360px]',
        )}
      >
        <Header />
        <div className="overflow-y-overlay flex-1 p-2">
          {isSearch && <SidebarSearch searchResult={searchResult} />}
          <div className={isSearch ? 'hidden' : 'block'}>
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
