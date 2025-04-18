import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import initializeApp from './lib/setup';

// Initialize the app
initializeApp();

export function middleware(request: NextRequest) {
  // You can add request-level middleware logic here if needed
  return NextResponse.next();
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware
export const config = {
  // Matcher for routes that should trigger this middleware
  matcher: [
    // Skip static files and API routes that handle their own errors
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
