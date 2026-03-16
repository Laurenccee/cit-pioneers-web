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

// Only accessible when NOT authenticated
const authRoutes = ['/sign-in'];

// Requires authentication
const protectedRoutes = ['/dashboard', '/change-password'];

// Requires admin claim
const adminRoutes = ['/dashboard'];

async function verifyToken(token: string): Promise<{ valid: boolean; isAdmin: boolean }> {
  try {
    // Decode the JWT payload (middle segment) without a library — verification
    // happens server-side via Firebase Admin in API routes; here we do a basic
    // expiry check to catch stale cookies quickly.
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64url').toString(),
    );
    const expired = payload.exp * 1000 < Date.now();
    if (expired) return { valid: false, isAdmin: false };
    return { valid: true, isAdmin: payload.admin === true };
  } catch {
    return { valid: false, isAdmin: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get('auth-token')?.value;

  // Redirect root to home always
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Public routes: always accessible
  if (isPublicRoute) return NextResponse.next();

  if (authToken) {
    const { valid, isAdmin } = await verifyToken(authToken);

    if (!valid) {
      // Expired or malformed token — clear cookie and redirect to sign-in
      const response = NextResponse.redirect(new URL('/sign-in', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    // Authenticated users don't need the sign-in page
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    // Admin-only routes: redirect non-admins away
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
  }

  // No token — redirect protected routes to sign-in
  if (isProtectedRoute) {
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
