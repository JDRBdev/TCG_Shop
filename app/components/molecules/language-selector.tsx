"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import English from "../atoms/english"
import Spanish from "../atoms/spanish"
import Deutsch from "../atoms/deutsch"
import French from "../atoms/french"

const SUPPORTED = ["en", "es", "de", "fr"] as const
type Lang = typeof SUPPORTED[number]

interface LanguageSelectorProps {
  currentLang?: string
}

export default function LanguageSelector({ currentLang }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  // Flags como función => evita problemas de reuso del mismo nodo
  const languages = useMemo(
    () => [
      { code: "en" as Lang, name: "English", flag: () => <English /> },
      { code: "es" as Lang, name: "Español", flag: () => <Spanish /> },
      { code: "de" as Lang, name: "Deutsch", flag: () => <Deutsch /> },
      { code: "fr" as Lang, name: "Français", flag: () => <French /> },
    ],
    []
  )

  // Idioma derivado de la URL (si no viene por prop)
  const urlCode = useMemo<Lang>(() => {
    const seg = (pathname?.split("/")[1] || "").toLowerCase()
    return (SUPPORTED as readonly string[]).includes(seg) ? (seg as Lang) : "en"
  }, [pathname])

  const activeCode: Lang = useMemo(() => {
    const fromProp = (currentLang || "").toLowerCase()
    return (SUPPORTED as readonly string[]).includes(fromProp)
      ? (fromProp as Lang)
      : urlCode
  }, [currentLang, urlCode])

  const currentLanguage = languages.find((l) => l.code === activeCode)!

  const changeLang = (langCode: Lang) => {
    if (langCode === activeCode) {
      setOpen(false)
      return
    }
    const segs = pathname.split("/")
    if ((SUPPORTED as readonly string[]).includes(segs[1])) segs[1] = langCode
    else segs.splice(1, 0, langCode)
    router.push(segs.join("/") || "/")
    setOpen(false)
  }

  // Cerrar al clicar fuera
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return (
    <div ref={ref} className="relative z-[100]">
      {/* Botón principal */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="w-6 h-6 rounded-full overflow-hidden">{currentLanguage.flag()}</span>
        <span className="text-sm font-medium text-gray-700">{activeCode.toUpperCase()}</span>
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
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-[110] pointer-events-auto">
          <ul role="listbox" className="py-1">
            {languages.map((l) => {
              const selected = l.code === activeCode
              return (
                <li key={l.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => changeLang(l.code)}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 transition-colors cursor-pointer ${
                      selected ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full overflow-hidden">{l.flag()}</span>
                    <span>{l.name}</span>
                    {selected && (
                      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
