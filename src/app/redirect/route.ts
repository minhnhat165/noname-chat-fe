import { NextRequest, NextResponse } from 'next/server';

import { COOKIE_ACCESS_TOKEN_NAME } from '@/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token) {
    cookies().set(COOKIE_ACCESS_TOKEN_NAME, token);
    return redirect('/');
  }
  return NextResponse.json(token);
}
