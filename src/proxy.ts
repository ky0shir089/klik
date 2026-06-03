import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_ACCESS_TOKEN_COOKIE_NAME } from '@/lib/session-cookies';

/**
 * Proxy implementation (replacing deprecated middleware)
 * Intercepts requests to remember the last visited URL before redirecting to login.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Exempt public routes and internal Next.js assets to prevent loops
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/logout');
  const isInternal = pathname.startsWith('/_next') || pathname.startsWith('/api/');
  const isStaticFile = pathname.includes('.');

  if (isAuthRoute || isInternal || isStaticFile) {
    return NextResponse.next();
  }

  // 2. Check for access_token as defined in session-cookies.ts
  const token = request.cookies.get(SESSION_ACCESS_TOKEN_COOKIE_NAME)?.value;

  // Redirect if no token is found and it's not a public route
  if (!token && !isAuthRoute) {
    const fullPath = encodeURIComponent(`${pathname}${search}`);

    // Construct safe redirect URL using existing helper
    const loginUrl = new URL(`/login?next=${fullPath}`, request.url);
    const response = NextResponse.redirect(loginUrl);

    // Set fallback cookie for client-side memory
    response.cookies.set('last_visited_url', `${pathname}${search}`, { 
      path: '/', 
      maxAge: 3600, // 1 hour
      httpOnly: false, // Must be false so client-side Login page can read it
      sameSite: 'lax'
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};