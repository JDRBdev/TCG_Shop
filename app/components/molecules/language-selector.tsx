"use client"
import { useState } from "react"
import English from "../atoms/english"
import Spanish from "../atoms/spanish"
import Deutsch from "../atoms/deutsch"
import French from "../atoms/french"

interface LanguageSelectorProps {
  currentLang: string
}

export default function LanguageSelector({ currentLang }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)

  const languages = [
    { code: "en", name: "English", flag: <English /> },
    { code: "es", name: "Español", flag: <Spanish /> },
    { code: "de", name: "Deutsch", flag: <Deutsch /> },
    { code: "fr", name: "Français", flag: <French /> },
  ]

  const currentLanguage = languages.find((lang) => lang.code === currentLang) || languages[1]

  const handleLanguageChange = (langCode: string) => {
    const currentPath = window.location.pathname
    const pathSegments = currentPath.split("/")

    if (pathSegments[1] && ["en", "es", "de", "fr"].includes(pathSegments[1])) {
      pathSegments[1] = langCode
    } else {
      pathSegments.splice(1, 0, langCode)
    }

    const newPath = pathSegments.join("/")
    window.location.href = newPath
  }

  return (
    <div className="relative">
      {/* Botón principal */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="w-6 h-6 rounded-full overflow-hidden">{currentLanguage.flag}</span>
        <span className="text-sm font-medium text-gray-700">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-3 transition-colors cursor-pointer ${
                  currentLang === language.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
              >
                <span className="w-6 h-6 rounded-full overflow-hidden">{language.flag}</span>
                <span>{language.name}</span>
                {currentLang === language.code && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
