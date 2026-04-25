import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['en', 'es'];
const atitlanTownSlugs = new Set(['san-marcos', 'san-pedro', 'panajachel', 'san-juan', 'santiago']);
const microRouteIds = new Set(['ruta-zen', 'ruta-cafe', 'ruta-santander', 'ruta-arte', 'ruta-maximon']);

function normalizeLegacyMapParams(url: URL): boolean {
  const legacyRoute = url.searchParams.get('route');
  if (!legacyRoute) return false;

  url.searchParams.delete('route');

  if (!url.searchParams.has('town') && atitlanTownSlugs.has(legacyRoute)) {
    url.searchParams.set('town', legacyRoute);
    return true;
  }

  if (!url.searchParams.has('microRoute') && microRouteIds.has(legacyRoute)) {
    url.searchParams.set('microRoute', legacyRoute);
    return true;
  }

  return true;
}

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const localeInPath = supportedLocales.find(locale =>
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (localeInPath) {
    const isMapPath =
      pathname === `/${localeInPath}/mapa` ||
      pathname === `/${localeInPath}/mapa/`;
    if (isMapPath && normalizeLegacyMapParams(url)) {
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get('accept-language') || '';
  const userLocale = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  const detectedLocale = supportedLocales.includes(userLocale) ? userLocale : 'es';

  normalizeLegacyMapParams(url);
  url.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
