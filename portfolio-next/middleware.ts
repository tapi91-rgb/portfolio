import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (url.pathname === '/admin/admin/123/rrr/poi/@#@#/admin') {
    url.pathname = '/admin-secret';
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/admin/123/rrr/poi/@#@#/admin']
};