interface FooterProps {
  dict: any
}

export default function Footer({ dict }: FooterProps) {
  return (
    <footer className="bg-white border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + descripción */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h5 className="text-lg font-bold">{dict.header.title}</h5>
            </div>
            <p className="text-gray-600 text-sm">{dict.footer.description}</p>
          </div>

          {/* Productos */}
          <div>
            <h6 className="font-semibold mb-4">{dict.footer.products.title}</h6>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">{dict.footer.products.boosterPacks}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{dict.footer.products.decks}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{dict.footer.products.singleCards}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{dict.footer.products.accessories}</a></li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h6 className="font-semibold mb-4">{dict.footer.support.title}</h6>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-blue-600 transition-colors">{dict.footer.support.helpCenter}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{dict.footer.support.shipping}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{dict.footer.support.contact}</a></li>
              <li><a href="#" className="hover:text-blue-600 transition-colors">{dict.footer.support.faq}</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h6 className="font-semibold mb-4">{dict.footer.newsletter.title}</h6>
            <p className="text-sm text-gray-600 mb-4">{dict.footer.newsletter.description}</p>
            <div className="flex gap-2">
              <input
                placeholder={dict.footer.newsletter.placeholder}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-9 px-3">
                {dict.footer.newsletter.subscribe}
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>{dict.footer.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
