import { InitializeUserStore, User, useUserStore } from '@/stores/user';

import Sidebar from '@/components/Sidebar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface LayoutProps {
  children: React.ReactNode;
}
interface GithubUser extends User {
  message?: string;
}

export const getUserGithub = async (id: string) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  const data = await response.json();
  return data;
};

const Layout = async ({ children }: LayoutProps) => {
  // if (!cookies().get('token')) redirect('/login');
  const user: GithubUser = await getUserGithub('1');
  useUserStore.setState({ data: user });
  return (
    <div className="flex h-screen">
      <InitializeUserStore user={user} />
      <aside className="hidden md:block ">
        <Sidebar />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
