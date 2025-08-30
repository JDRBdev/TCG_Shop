import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const locales = ["en", "es", "fr", "de"] as const
type Locale = (typeof locales)[number]

// Get the preferred locale from Accept-Language header
function getLocale(request: Request): Locale {
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0]
    const baseLang = preferred.split("-")[0] as Locale
    if (locales.includes(baseLang)) {
      return baseLang
    }
  }
  return "en"
}

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/profile(.*)", "/admin(.*)"])

export default clerkMiddleware((auth, req) => {
  const { pathname } = req.nextUrl
  
  // ←←← IMPORTANTE: NO redirigir API routes ←←←
  if (pathname.startsWith('/api/')) {
    return NextResponse.next() // Saltar redirección para APIs
  }

  // Handle locale redirection for non-API routes
  const pathnameHasLocale = locales.some((locale) => 
    pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    const locale = getLocale(req)
    req.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(req.nextUrl)
  }

  if (isProtectedRoute(req)) {
    return auth().then((session) => {
      if (!session.userId) {
        const signInUrl = new URL("/sign-in", req.nextUrl.origin)
        return NextResponse.redirect(signInUrl)
      }
      return NextResponse.next()
    })
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Incluir todo pero el middleware manejará la exclusión de APIs
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}