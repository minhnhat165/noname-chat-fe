import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token) {
    cookies().set('token', token);
    return redirect('/');
  }
  return NextResponse.json(token);
}
