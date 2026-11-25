import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow assets, images, and the error page file itself to load
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname === '/errorpage.html' ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Rewrite every visitor and route to your error page
  return NextResponse.rewrite(new URL('/errorpage.html', request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};