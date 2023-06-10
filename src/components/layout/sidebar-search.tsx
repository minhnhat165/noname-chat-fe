import { RoomList, generateRoomByOtherUser } from '../room';
import { rooms, users } from '@/stores/data-test';

import { Divider } from 'antd';
import { Room } from '@/types/room';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { useSidebar } from './sidebar';
import { useUserStore } from '@/stores/user';

const ONE_MINUTE = 60 * 1000;

export interface SidebarSearchProps {
  searchResult: Search;
}

export type Search = {
  rooms: Room[];
  users: User[];
};

const search = (query: string): Search => {
  return {
    rooms,
    users: users.slice(1, 4),
  };
};

export const SidebarSearch = ({ searchResult }: SidebarSearchProps) => {
  const currentUser = useUserStore((state) => state.data!);
  const { searchValue } = useSidebar();

  const { data } = useQuery({
    queryKey: ['search', searchValue],
    queryFn: () => search(searchValue),
    enabled: !!searchValue,
    staleTime: ONE_MINUTE,
    keepPreviousData: true,
  });
  const { rooms, users } = data || {
    rooms: [],
    users: [],
  };

  return (
    <div>
      {users.length > 0 && (
        <SearchSection
          title="Users"
          rooms={users.map((user) => {
            return generateRoomByOtherUser(user, currentUser);
          })}
        />
      )}
      {rooms.length > 0 && (
        <>
          <Divider />
          <SearchSection title="Rooms" rooms={rooms} />
        </>
      )}
    </div>
  );
};

const SearchSection = ({ title, rooms }: { title: string; rooms: Room[] }) => {
  return (
    <div>
      <h3 className="text-base font-bold">{title}</h3>
      <RoomList rooms={rooms} />
    </div>
  );
};
