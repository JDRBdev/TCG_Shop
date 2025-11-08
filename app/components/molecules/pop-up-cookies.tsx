"use client"

import React, { useEffect, useState } from "react"

type Props = {
  dict?: any
}

const COOKIE_NAME = "tcg_cookie_consent"

function readCookie(name: string) {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
}

export default function PopUpCookies({ dict }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check immediately on mount
    const checkConsent = () => {
      const cookieVal = readCookie(COOKIE_NAME)
      const localVal = typeof window !== "undefined" ? window.localStorage.getItem(COOKIE_NAME) : null
      
      // Only hide if BOTH cookie and localStorage have a value
      // This ensures popup reappears if user deletes cookies
      if (!cookieVal && !localVal) {
        setVisible(true)
      } else if (cookieVal) {
        setVisible(false)
      } else {
        // localStorage exists but cookie doesn't - show popup again
        setVisible(true)
      }
    }

    checkConsent()

    // Recheck periodically in case cookies are deleted
    const interval = setInterval(checkConsent, 1000)
    return () => clearInterval(interval)
  }, [])

  function accept() {
    setCookie(COOKIE_NAME, "accepted")
    try { window.localStorage.setItem(COOKIE_NAME, "accepted") } catch {}
    setVisible(false)
    // You could initialize analytics here
  }

  function reject() {
    setCookie(COOKIE_NAME, "rejected")
    try { window.localStorage.setItem(COOKIE_NAME, "rejected") } catch {}
    setVisible(false)
  }

  if (!visible) return null

  const text = dict?.cookieBanner?.text || "Usamos cookies para mejorar tu experiencia."
  const acceptText = dict?.cookieBanner?.accept || "Aceptar"
  const rejectText = dict?.cookieBanner?.reject || "Rechazar"

  return (
    <div className="fixed bottom-4 left-4 z-50 w-11/12 max-w-sm">
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-4 flex flex-col gap-4">
        <div className="flex-1">
          <p className="text-sm text-slate-800 leading-relaxed">{text}</p>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm rounded-md bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
            aria-label={rejectText}
          >
            {rejectText}
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            aria-label={acceptText}
          >
            {acceptText}
          </button>
        </div>
      </div>
    </div>
  )
}
