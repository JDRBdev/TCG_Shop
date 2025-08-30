import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const locales = ["en", "es", "fr", "de"] as const
type Locale = (typeof locales)[number]

// Get the preferred locale from Accept-Language header
function getLocale(request: Request): Locale {
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0] // "es-ES"
    const baseLang = preferred.split("-")[0] as Locale // "es"
    if (locales.includes(baseLang)) {
      return baseLang
    }
  }
  return "en"
}

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/profile(.*)", "/admin(.*)"])

export default clerkMiddleware((auth, req) => {
  // Handle locale redirection first
  const { pathname } = req.nextUrl
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // If no locale in pathname, redirect with locale
  if (!pathnameHasLocale) {
    const locale = getLocale(req)
    req.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.redirect(req.nextUrl)
  }

  if (isProtectedRoute(req)) {
    return auth().then((session) => {
      if (!session.userId) {
        // Redirect to sign-in page if not authenticated
        const signInUrl = new URL("/sign-in", req.nextUrl.origin)
        return NextResponse.redirect(signInUrl)
      }
      return NextResponse.next()
    })
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
