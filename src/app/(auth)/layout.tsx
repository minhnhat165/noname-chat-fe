import { redirect } from 'next/navigation';

export interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  redirect('/');
  return <div>{children}</div>;
};

export default AuthLayout;
