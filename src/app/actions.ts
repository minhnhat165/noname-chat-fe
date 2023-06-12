'use server';

import { cookies } from 'next/headers';

export const removeToken = () => {
  cookies().set({
    name: 'token',
    value: '',
    expires: new Date(0),
  });
};
