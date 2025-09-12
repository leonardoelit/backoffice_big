// middleware.ts
import { parseJwtCookie } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // List of public paths that don't require authentication
  const publicPaths = ['/signin', '/signup', '/api', '/_next', '/favicon.ico', '/images'];
  
  // Check if current path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = request.cookies.get('authToken')?.value;

  // If no token and not public path, redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  const user = parseJwtCookie(token);
  if (!user) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Admin route protection
  if (pathname.startsWith('/admin') && user.role !== 'Admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - signin/signup (auth pages)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|signin|signup|images).*)',
  ],
};