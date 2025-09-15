import { getDictionary } from "./dictionaries";
import ProductCard from "../components/molecules/product-card";
import { featuredProducts } from "../data/products";

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
    : "es";

  // Obtiene el diccionario de traducciones correspondiente al idioma seguro seleccionado
  const dict = await getDictionary(safeLang) // es
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">{dict.hero.title}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">{dict.hero.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/productos">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-11 px-8 text-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {dict.hero.exploreCatalog}
              </button>
            </a>
            <a href="/ofertas">
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
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">{dict.products.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  showBadge={!!p.price} 
                  dict={dict}       // ✅ pasa el diccionario
                  lang={safeLang || "es"} // ✅ pasa el idioma actual
                />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">{dict.categories.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: dict.categories.boosterPacks.title,
                description: dict.categories.boosterPacks.description,
                image: "/images/trading-card-booster-packs-collection.png",
                count: dict.categories.boosterPacks.count,
                href: "/productos?category=booster-packs",
              },
              {
                title: dict.categories.constructedDecks.title,
                description: dict.categories.constructedDecks.description,
                image: "/images/constructed-trading-card-decks-tournament.png",
                count: dict.categories.constructedDecks.count,
                href: "/productos?category=constructed-decks",
              },
              {
                title: dict.categories.accessories.title,
                description: dict.categories.accessories.description,
                image: "/images/trading-card-accessories-sleeves-binders.png",
                count: dict.categories.accessories.count,
                href: "/accesorios",
              },
            ].map((category, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <a href={category.href} className="block">
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
                </a>
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
    </main>
  );
}
