import { COOKIE_ACCESS_TOKEN_NAME } from '@/constants';
import { cookies } from 'next/headers';

export const checkIsLogin = (): boolean => {
  const token = getToken();
  return !!token;
};
export const getToken = () => {
  return cookies().get(COOKIE_ACCESS_TOKEN_NAME);
};
