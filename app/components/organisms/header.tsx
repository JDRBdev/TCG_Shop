"use client"

import { useState } from "react"
import LanguageSelector from "../molecules/language-selector"

interface HeaderProps {
  dict: any
  currentLang: string
}

export default function Header({ dict, currentLang }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + Título */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{dict.header.title}</h1>
            </div>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                {dict.header.nav.offers}
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                {dict.header.nav.products}
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                {dict.header.nav.accessories}
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
                {dict.header.nav.tournaments}
              </a>
            </nav>

            {/* Desktop: Selector de idioma + carrito */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector currentLang={currentLang} />

              {/* Botón carrito */}
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 relative">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
                {dict.header.cart}
                <span className="absolute -top-2 -right-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                  3
                </span>
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <LanguageSelector currentLang={currentLang} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors z-60 relative"
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

          {/* Navigation links */}
          <nav className="flex flex-col p-6 space-y-6">
            <a
              href="#"
              className="text-xl text-gray-700 hover:text-blue-600 transition-colors py-3 border-b border-gray-100 hover:border-blue-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {dict.header.nav.offers}
            </a>
            <a
              href="#"
              className="text-xl text-gray-700 hover:text-blue-600 transition-colors py-3 border-b border-gray-100 hover:border-blue-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {dict.header.nav.products}
            </a>
            <a
              href="#"
              className="text-xl text-gray-700 hover:text-blue-600 transition-colors py-3 border-b border-gray-100 hover:border-blue-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {dict.header.nav.accessories}
            </a>
            <a
              href="#"
              className="text-xl text-gray-700 hover:text-blue-600 transition-colors py-3 border-b border-gray-100 hover:border-blue-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {dict.header.nav.tournaments}
            </a>

            {/* Mobile cart button */}
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 relative mt-8 w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
              {dict.header.cart}
              <span className="absolute -top-2 -right-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                3
              </span>
            </button>
          </nav>
        </div>
      </div>
    </>
  )
}
