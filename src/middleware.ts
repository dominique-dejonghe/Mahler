import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Private app routes are NOT internationalised — they live outside next-intl
  if (pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|favicon.ico|manifest.json|sw.js|workbox|icons|images|.*\\..*).*)'],
};
