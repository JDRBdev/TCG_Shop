import { NextResponse } from "next/server";
 
let locales = ['en', 'es', 'fr', 'de'];
 
// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
  // Example: get the first locale from the Accept-Language header or default to 'en'
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',')[0]; // "es-ES"
    const baseLang = preferred.split('-')[0];       // "es"
    if (locales.includes(baseLang)) {
      return baseLang;
    }
  }
  return 'en';
}
 
export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Match all paths except for:
    // - internal paths (_next)
    // - API routes
    // - static files (images, fonts, icons, etc.)
    '/((?!_next|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)).*)',
  ],
}