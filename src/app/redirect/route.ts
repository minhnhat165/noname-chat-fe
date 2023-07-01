import { NextRequest, NextResponse } from 'next/server';

import { COOKIE_ACCESS_TOKEN_NAME } from '@/constants';
import { cookies } from 'next/headers';
import jwt_decode from 'jwt-decode';
import { redirect } from 'next/navigation';

type Token = {
  exp: number;
  iat: number;
  id: string;
};

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const error = url.searchParams.get('error');
  if (error) {
    return redirect(`/banned`);
  }
  const decoded: Token = jwt_decode(token!);
  if (token) {
    cookies().set({
      name: COOKIE_ACCESS_TOKEN_NAME,
      value: token,
      path: '/',
      maxAge: decoded.exp - decoded.iat,
      expires: new Date(decoded.exp * 1000),
    });
    return redirect('/');
  }
  return NextResponse.json(token);
}
