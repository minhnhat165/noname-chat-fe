import { COOKIE_ACCESS_TOKEN_NAME } from '@/constants';
import { cookies } from 'next/headers';

type Props = {
  searchParams?: {
    token?: string;
  };
};

const RedirectPage = async ({ searchParams }: Props) => {
  const token = searchParams?.token;

  // if (token) {
  //   // useCredentialStore.setState({ data: { token } });
  //   //using cookie instead of localstorage

  //   redirect('/');
  // }

  const setCookie = async (e: any) => {
    'use server';
    cookies().set(COOKIE_ACCESS_TOKEN_NAME, token || '');
    // redirect('/');
  };

  return (
    <form action={setCookie}>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RedirectPage;
