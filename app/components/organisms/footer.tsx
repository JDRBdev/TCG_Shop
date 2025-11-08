import Link from "next/link"

interface FooterProps {
  dict: any
  lang?: string
}

export default function Footer({ dict, lang = "es" }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-t border-slate-200 text-slate-700 pt-16 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Logo y descripción */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h5 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {dict.header.title}
              </h5>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              {dict.footer.description}
            </p>
          </div>

          <div className="grid grid-cols-2">
            {/* Productos */}
            <div className="w-fit">
              <h6 className="font-semibold text-slate-800 mb-4">{dict.footer.products.title}</h6>
              <ul className="space-y-2 text-sm">
              {[
                { value: "booster-packs", label: dict.products.filters.boosterPacks || "Booster Packs" },
                { value: "preconstructed-deck", label: dict.products.filters.constructedDecks || "Decks Construidos" },
                { value: "booster-box", label: dict.products.filters.boosterBox || "Booster Box" },
                { value: "collector-set", label: dict.products.filters.collectorSet || "Sets Coleccionista" },
              ].map(item => (
                <li key={item.value}>
                  <a href={`?category=${encodeURIComponent(item.value)}`} className="hover:text-blue-600 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
              </ul>
            </div>

            {/* Legales */}
            <div className="w-fit">
              <h6 className="font-semibold text-slate-800 mb-4">{dict.footer.legal.title}</h6>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${lang}/politica-de-privacidad`} className="hover:text-blue-600 transition-colors">
                    {dict.footer.legal.privacy}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/politica-de-cookies`} className="hover:text-blue-600 transition-colors">
                    {dict.footer.legal.cookies}
                  </Link>
                </li>
                <li>
                  <Link href={`/${lang}/aviso-legal`} className="hover:text-blue-600 transition-colors">
                    {dict.footer.legal.legalNotice}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 text-center text-sm text-slate-500">
          <p>{dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
