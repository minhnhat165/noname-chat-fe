import { InitializeUserStore, useUserStore } from '@/stores/user';

import Loading from './loading';
import { Sidebar } from '@/components/layout/sidebar';
import { Suspense } from 'react';
import { User } from '@/types/user';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { user } from '@/stores/data-test';

export interface LayoutProps {
  children: React.ReactNode;
}
async function getUserGithub(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/users/${id}`);
    const res = await response.json();
    return user;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

const Layout = async ({ children }: LayoutProps) => {
  // if (!cookies().get('token')) redirect('/login');
  const user = await getUserGithub('1');
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
