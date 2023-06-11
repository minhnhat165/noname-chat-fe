import { cookies } from 'next/headers';

export const checkIsLogin = (): boolean => {
  const token = getToken();
  return !!token;
};
export const getToken = () => {
  return cookies().get('token');
};
