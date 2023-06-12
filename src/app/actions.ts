'use server';

import { COOKIE_ACCESS_TOKEN_NAME } from '@/constants';
import { cookies } from 'next/headers';

export const removeToken = () => {
  cookies().set({
    name: COOKIE_ACCESS_TOKEN_NAME,
    value: '',
    expires: new Date(0),
  });
};
