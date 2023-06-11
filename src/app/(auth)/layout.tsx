import { checkIsLogin } from '@/utils/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  const isLogged = checkIsLogin();
  if (isLogged) {
    redirect('/');
  }
  return <div>{children}</div>;
};

export default AuthLayout;
