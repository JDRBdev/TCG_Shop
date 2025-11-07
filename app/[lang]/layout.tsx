import type { Metadata } from "next"
import React, { ReactNode, Suspense } from "react"
import "./../globals.css"

import { getDictionary } from "../hooks/dictionaries"
import Header from "../components/organisms/header"
import Footer from "../components/organisms/footer"
import { ProductUpdatesProvider } from "../components/atoms/provider/product-updates-context"

import {
  ClerkProvider
} from '@clerk/nextjs'
import { CartProvider } from "../components/atoms/provider/cart-context"

interface RootLayoutProps {
  children: ReactNode
  className?: string
}

export const metadata: Metadata = {
  title: "TCG Store - Your Online Trading Card Game Shop",
  description: "Portfolio website",
}

export default async function Layout({
  children,
  className = "",
  params,
}: RootLayoutProps & { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const supportedLangs = ["en", "es", "fr", "de"] as const
  const safeLang: typeof supportedLangs[number] = supportedLangs.includes(lang as any)
    ? (lang as typeof supportedLangs[number])
    : "es"

  const dict = await getDictionary(safeLang)

  return (
    <ClerkProvider>
      <CartProvider>
        <html lang={safeLang}>
          <head>
            <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          </head>
          <body className={`h-full min-h-screen ${className}`}>
            <ProductUpdatesProvider>
              {/* Header is a client component that uses next/navigation hooks
                  (useSearchParams/usePathname). Wrap it in Suspense so that
                  during server rendering Next.js can fallback while the
                  client-only router state hydrates. This prevents the
                  "useSearchParams() should be wrapped in a suspense boundary"
                  prerender/build error. */}
              <Suspense fallback={<header aria-hidden className="h-16" />}> 
                <Header dict={dict} />
              </Suspense>

              {children}

              <Suspense fallback={<footer aria-hidden className="h-16" />}> 
                <Footer dict={dict} />
              </Suspense>
            </ProductUpdatesProvider>
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  )
}
