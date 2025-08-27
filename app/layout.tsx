import type { Metadata } from "next"
import { ReactNode } from "react"
import "./globals.css"

interface RootLayoutProps {
  children: ReactNode
  className?: string
}

// Puedes definir metadatos de Next.js
export const metadata: Metadata = {
  title: "Jose David Rodriguez Betancor",
  description: "Portfolio website",
}

export default function Layout({ children, className = "" }: RootLayoutProps) {
  // 🚨 En Next.js no tenemos `Astro.url`
  // Si quieres detectar el idioma desde la URL, lo ideal es usar
  // `headers()` o el pathname desde `usePathname()` (cliente).
  // Aquí lo dejamos hardcodeado a "en" o lo pasamos por props.
  const lang = "en"

  return (
    <html lang={lang}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`h-full min-h-screen ${className}`}>

        {/* Contenido de las páginas */}
        {children}
      </body>
    </html>
  )
}
