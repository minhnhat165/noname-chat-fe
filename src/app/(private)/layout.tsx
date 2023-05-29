import { InitializeUserStore, useUserStore } from '@/stores/user';

import Sidebar from '@/components/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/types/user';
import { Suspense } from 'react';
import Loading from './loading';

export interface LayoutProps {
  children: React.ReactNode;
}
export const getUserGithub = async (id: string) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const data = await response.json();
  return data;
};

const Layout = async ({ children }: LayoutProps) => {
  // if (!cookies().get('token')) redirect('/login');
  const user: User = await getUserGithub('1');
  useUserStore.setState({ data: user });
  return (
    <div className="flex h-screen">
      <Suspense fallback={<Loading />}>
        <InitializeUserStore user={user} />
        <aside className="hidden md:block ">
          <Sidebar />
        </aside>
      </Suspense>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
