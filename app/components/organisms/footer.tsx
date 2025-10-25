interface FooterProps {
  dict: any
}

export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-t border-slate-200 text-slate-700 pt-16 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
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

          {/* Productos */}
          <div>
            <h6 className="font-semibold text-slate-800 mb-4">{dict.footer.products.title}</h6>
            <ul className="space-y-2 text-sm">
              {Object.entries(dict.footer.products)
                .filter(([key]) => key !== "title")
                .map(([key, label]) => (
                  <li key={key}>
                    <a href="#" className="hover:text-blue-600 transition-colors">{label as string}</a>
                  </li>
              ))}
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h6 className="font-semibold text-slate-800 mb-4">{dict.footer.support.title}</h6>
            <ul className="space-y-2 text-sm">
              {Object.entries(dict.footer.support)
                .filter(([key]) => key !== "title")
                .map(([key, label]) => (
                  <li key={key}>
                    <a href="#" className="hover:text-blue-600 transition-colors">{label as string}</a>
                  </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h6 className="font-semibold text-slate-800 mb-4">{dict.footer.newsletter.title}</h6>
            <p className="text-sm text-slate-600 mb-4">{dict.footer.newsletter.description}</p>
            <div className="flex gap-2">
              <input
                placeholder={dict.footer.newsletter.placeholder}
                className="flex h-10 w-full rounded-xl border border-slate-300 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 h-10 shadow-md transition-all">
                {dict.footer.newsletter.subscribe}
              </button>
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
