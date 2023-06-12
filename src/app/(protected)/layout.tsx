import { InitializeUserStore, useUserStore } from '@/stores/user';

import { checkIsLogin } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { user } from '@/stores/data-test';

export interface AuthLayoutProps {
  children: React.ReactNode;
}
async function getUserInfo() {
  try {
    // const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/users/${1}`);
    // const res = await response.json();
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
  useUserStore.setState({ data: user });
  return (
    <>
      <InitializeUserStore user={user} />
      {children}
    </>
  );
};

export default ProtectedLayout;
