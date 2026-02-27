import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en', 'es'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if pathname already has a locale
  const localeInPath = supportedLocales.find(locale => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (localeInPath) {
    // Already has locale, proceed
    return NextResponse.next();
  }
  
  // No locale in path, detect from accept-language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  const userLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  const detectedLocale = supportedLocales.includes(userLocale) ? userLocale : 'es';
  
  // Redirect to detected locale
  return NextResponse.redirect(
    new URL(`/${detectedLocale}${pathname === '/' ? '' : pathname}`, request.url)
  );
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
