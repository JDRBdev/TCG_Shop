"use client"

import LanguageSelector from "../molecules/language-selector"

interface HeaderProps {
  dict: any
  currentLang: string
}

export default function Header({ dict, currentLang }: HeaderProps) {
  return (
    <header className="border-b bg-slate-50/50 backdrop-blur-sm sticky top-0 z-50">
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

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              {dict.header.nav.newReleases}
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              {dict.header.nav.popularSets}
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              {dict.header.nav.offers}
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">
              {dict.header.nav.accessories}
            </a>
          </nav>

          {/* Selector de idioma + carrito */}
          <div className="flex items-center space-x-4">
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
        </div>
      </div>
    </header>
  )
}
