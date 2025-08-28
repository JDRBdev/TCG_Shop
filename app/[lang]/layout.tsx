import type { Metadata } from "next"
import { ReactNode } from "react"
import "./../globals.css"

import { getDictionary } from "../[lang]/dictionaries"
import Header from "../components/organisms/header"
import Footer from "../components/organisms/footer"

interface RootLayoutProps {
  children: ReactNode
  className?: string
}

export const metadata: Metadata = {
  title: "Jose David Rodriguez Betancor",
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
    <html lang={safeLang}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`h-full min-h-screen ${className}`}>
        <Header dict={dict} currentLang={safeLang} />
        {children}
        <Footer dict={dict} />
      </body>
    </html>
  )
}
