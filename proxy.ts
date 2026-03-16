import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Accessible by anyone, no auth required
const publicRoutes = [
  '/home',
  '/about',
  '/faculty',
  '/students',
  '/news',
  '/schedule',
];

// Only accessible when NOT authenticated (redirect to dashboard if logged in)
const authRoutes = ['/sign-in'];

// Requires a verified auth token (redirect to sign-in if not authenticated)
// Note: /verify-email and /setup-profile are self-protected client-side
// since unverified users won't have an auth-token cookie
const protectedRoutes = ['/dashboard', '/change-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get('auth-token')?.value;

  const isAuthenticated = !!authToken;
  logger.info(
    '[Middleware]',
    `${pathname} — user ${isAuthenticated ? 'logged in ✓' : 'not logged in ✗'}`,
  );

  // Redirect root to home always
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Public routes: always accessible
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Auth routes: redirect to home if already authenticated
  if (isAuthRoute && authToken) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Protected routes: redirect to sign-in if not authenticated
  if (isProtectedRoute && !authToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
