import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isTokenExpired } from './lib/jwt';
import { AUTH_COOKIE_NAME } from './lib/cookie';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Guard all dashboard routes from direct URL access without a valid/active token
  if (pathname.startsWith('/dashboard')) {
    const hasValidToken = tokenCookie && !isTokenExpired(tokenCookie);

    if (!hasValidToken) {
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);

      // Clean up any stale/invalid cookie
      if (tokenCookie) {
        response.cookies.delete(AUTH_COOKIE_NAME);
      }

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
};
