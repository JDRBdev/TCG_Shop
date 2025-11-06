"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
import LanguageSelector from "../molecules/language-selector"
import CartButton from "../molecules/cart-button"

interface HeaderProps {
  dict: any
  // Eliminamos currentLang del prop porque lo obtenemos del URL
}

export default function Header({ dict }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const params = useParams()
  const pathname = usePathname()

  // Función para obtener el locale actual de forma consistente
  const getCurrentLocale = (): string => {
    // Primero intentar de params (más confiable)
    if (params.locale) return params.locale as string
    
    // Fallback: extraer de pathname
    const segments = pathname.split('/').filter(Boolean)
    const possibleLocales = ['en', 'es', 'fr', 'de']
    const localeFromPath = segments.find(seg => possibleLocales.includes(seg))
    
    return localeFromPath || 'es' // default
  }

  const currentLang = getCurrentLocale()

  // Función para generar URLs con el locale
  const localizedHref = (path: string) => {
    // Si el path es la raíz, devolver solo el locale
    if (path === '/') return `/${currentLang}`
    // Sino, agregar el locale al path
    return `/${currentLang}${path}`
  }

  const navigationItems = [
    { href: "/", label: dict.header.nav.home },
    { href: "/ofertas", label: dict.header.nav.offers },
    { href: "/productos", label: dict.header.nav.products },
  ]

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Título */}
            <div className="flex items-center space-x-2">
              <Link href={localizedHref("/")} className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">{dict.header.title}</h1>
              </Link>
            </div>

            {/* Navegación Desktop - USANDO LINK */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={localizedHref(item.href)}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop: Selector de idioma + auth + carrito */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector currentLang={currentLang} />

              <SignedOut>
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-9 px-3">
                        {dict.header.sign_in || "Iniciar sesión"}
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-9 px-3">
                        {dict.header.sign_up || "Crear cuenta"}
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <UserButton
                  afterSignOutUrl={localizedHref("/")}
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    },
                  }}
                />
              </SignedIn>

              {/* Botón carrito */}
              <CartButton label={dict.header.cart} />
            </div>

            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile cart and language button */}
              
              <LanguageSelector currentLang={currentLang} />
              <CartButton label={dict.header.cart} />

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors relative"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  // Close icon
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // Hamburger icon
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Background overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu content */}
        <div
          className={`absolute right-0 top-0 h-full w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">{dict.header.title}</h2>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation links - USANDO LINK también en móvil */}
          <nav className="flex flex-col p-6 space-y-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={localizedHref(item.href)}
                className="text-xl text-gray-700 hover:text-blue-600 transition-colors py-3 border-b border-gray-100 hover:border-blue-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-6 border-t border-gray-200">
              <SignedOut>
                <div className="space-y-4">
                  <SignInButton mode="modal">
                    <button
                      className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-12 px-6"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dict.header.sign_in || "Iniciar sesión"}
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-12 px-6"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {dict.header.sign_up || "Crear cuenta"}
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-center py-4">
                  <UserButton
                    afterSignOutUrl={localizedHref("/")}
                    appearance={{
                      elements: {
                        avatarBox: "h-12 w-12",
                      },
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}