import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('token');
  
  // If no token exists, redirect to login page
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Match all routes inside (app) 
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/progress/:path*',
    '/quiz/:path*',
    '/tutor/:path*',
    '/'
  ],
};
