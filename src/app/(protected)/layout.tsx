import { InitializeUserStore, useUserStore } from '@/stores/user';
import { checkIsLogin, getToken } from '@/utils/auth';

import SocketClient from '@/components/socket/socket-client';
import { redirect } from 'next/navigation';

export interface AuthLayoutProps {
  children: React.ReactNode;
}
async function getUserInfo() {
  try {
    const token = getToken();
    const res = await fetch(`${process.env.SERVER_API_URL}/api/auth/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { user } = await res.json();
    return user;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
}

const ProtectedLayout = async ({ children }: AuthLayoutProps) => {
  const isLogged = checkIsLogin();
  if (!isLogged) {
    redirect('/');
  }
  const user = await getUserInfo();
  console.log(user);
  useUserStore.setState({ data: user });
  return (
    <>
      <SocketClient />
      <InitializeUserStore user={user} />
      {children}
    </>
  );
};

export default ProtectedLayout;
