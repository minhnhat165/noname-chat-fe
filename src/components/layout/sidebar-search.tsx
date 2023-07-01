import { UserStore, useUserStore } from '@/stores/user';
import { rooms, user, users } from '@/stores/data-test';

import { Divider } from 'antd';
import { Room } from '@/types/room';
import { RoomList } from '../room';
import { User } from '@/types/user';
import { generateRoomByOtherUser } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { useSidebar } from './sidebar';
import { userApi } from '@/services/user-services';

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
  const currentUser = useUserStore((state: UserStore) => state.data!);
  const { searchValue } = useSidebar();

  const { data } = useQuery({
    queryKey: ['search', searchValue],
    queryFn: () => userApi.search(searchValue),
    enabled: !!searchValue,
    staleTime: ONE_MINUTE,
    keepPreviousData: true,
  });
  console.log(data?.data);
  const users = data?.data || [];

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
      {/* {rooms.length > 0 && (
        <>
          <Divider />
          <SearchSection title="Rooms" rooms={rooms} />
        </>
      )} */}
    </div>
  );
};

const SearchSection = ({ title, rooms }: { title: string; rooms: Room[] }) => {
  return (
    <div>
      {/* <h3 className="text-base font-bold">{title}</h3> */}
      <RoomList rooms={rooms} />
    </div>
  );
};
