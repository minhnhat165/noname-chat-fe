'use client';

import Link from 'next/link';
import { User } from '@/stores/user';
import { useQuery } from '@tanstack/react-query';

export interface SidebarProps {}

const Sidebar = (props: SidebarProps) => {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
      const data = await response.json();
      return data;
    },
  });

  return (
    <div className="h-full w-96 bg-gray-800">
      {
        <ul className="flex flex-col">
          {data?.map((user: User) => (
            <li key={user.id} className="text-white">
              <Link href={`/${user.id}`}>{user.name}</Link>
            </li>
          ))}
        </ul>
      }
    </div>
  );
};

export default Sidebar;
