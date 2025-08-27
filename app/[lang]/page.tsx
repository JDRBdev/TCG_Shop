import Image from "next/image";
import { getDictionary } from "./dictionaries";

// You now have access to the current locale
// e.g. /en-US/products -> `lang` is "en-US"
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  // Extrae el parámetro 'lang' de los parámetros recibidos (probablemente de la URL o del contexto de la página)
  const { lang } = await params

  // Define un array constante con los idiomas soportados
  const supportedLangs = ["en", "es", "fr", "de"] as const;

  // Verifica si 'lang' está dentro de los idiomas soportados.
  // Si es así, lo usa; si no, por defecto usa "en" (inglés).
  const safeLang = supportedLangs.includes(lang as any) 
    ? (lang as typeof supportedLangs[number]) 
    : "en";

  // Obtiene el diccionario de traducciones correspondiente al idioma seguro seleccionado
  const dict = await getDictionary(safeLang) // en
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-slate-50/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{dict.header.title}</h1>
            </div>

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

            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  placeholder={dict.header.search}
                  className="pl-10 w-64 flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">{dict.hero.title}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">{dict.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 text-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {dict.hero.exploreCatalog}
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 h-11 px-8 text-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              {dict.hero.viewOffers}
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">{dict.products.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: dict.products.items.boosterPack,
                price: "$15.99",
                rating: 4.8,
                image: "/images/trading-card-booster-pack-premium.png",
              },
              {
                name: dict.products.items.competitiveDeck,
                price: "$45.99",
                rating: 4.9,
                image: "/images/competitive-trading-card-deck.png",
              },
              {
                name: dict.products.items.holographicCard,
                price: "$89.99",
                rating: 5.0,
                image: "/images/holographic-rare-trading-card.png",
              },
              {
                name: dict.products.items.collectorSet,
                price: "$129.99",
                rating: 4.7,
                image: "/images/collector-trading-card-set.png",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white shadow-sm group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border-emerald-200">
                      {dict.products.new}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold leading-none tracking-tight mb-2">{product.name}</h4>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{product.price}</span>
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-9 px-3">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                        />
                      </svg>
                      {dict.products.add}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">{dict.categories.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: dict.categories.boosterPacks.title,
                description: dict.categories.boosterPacks.description,
                image: "/images/trading-card-booster-packs-collection.png",
                count: dict.categories.boosterPacks.count,
              },
              {
                title: dict.categories.constructedDecks.title,
                description: dict.categories.constructedDecks.description,
                image: "/images/constructed-trading-card-decks-tournament.png",
                count: dict.categories.constructedDecks.count,
              },
              {
                title: dict.categories.accessories.title,
                description: dict.categories.accessories.description,
                image: "/images/trading-card-accessories-sleeves-binders.png",
                count: dict.categories.accessories.count,
              },
            ].map((category, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-600 text-white border-blue-500">
                      {category.count}
                    </span>
                    <h4 className="text-xl font-bold mb-1">{category.title}</h4>
                    <p className="text-sm opacity-90 text-pretty">{category.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">{dict.offers.title}</h3>
            <p className="text-gray-600">{dict.offers.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-lg border bg-gradient-to-br from-blue-600 to-emerald-600 text-white shadow-sm overflow-hidden">
              <div className="p-8 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-white text-blue-600 border-white">
                    -30%
                  </span>
                </div>
                <h4 className="text-2xl font-bold mb-2">{dict.offers.megaBundle.title}</h4>
                <p className="mb-4 opacity-90">{dict.offers.megaBundle.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold">$199.99</span>
                  <span className="text-lg line-through opacity-70">$285.99</span>
                </div>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white bg-white text-blue-600 hover:bg-gray-100 h-10 px-4 py-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                  {dict.offers.megaBundle.getOffer}
                </button>
              </div>
            </div>

            <div className="rounded-lg border bg-gradient-to-br from-emerald-600 to-blue-600 text-white shadow-sm overflow-hidden">
              <div className="p-8 relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-white text-emerald-600 border-white">
                    Limitado
                  </span>
                </div>
                <h4 className="text-2xl font-bold mb-2">{dict.offers.tournament.title}</h4>
                <p className="mb-4 opacity-90">{dict.offers.tournament.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  <span>128 {dict.offers.tournament.playersRegistered}</span>
                </div>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white bg-white text-emerald-600 hover:bg-gray-100 h-10 px-4 py-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  {dict.offers.tournament.register}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

            <div>
              <h6 className="font-semibold mb-4">{dict.footer.products.title}</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {dict.footer.products.boosterPacks}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {dict.footer.products.decks}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {dict.footer.products.singleCards}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {dict.footer.products.accessories}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold mb-4">{dict.footer.support.title}</h6>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {dict.footer.support.helpCenter}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {dict.footer.support.shipping}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {dict.footer.support.contact}
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-600 transition-colors">
                    {dict.footer.support.faq}
                  </a>
                </li>
              </ul>
            </div>

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

          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>{dict.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
