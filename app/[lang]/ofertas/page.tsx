import { getDictionary } from "./../dictionaries";

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function OfertasPage({ params }: PageProps) {
  const { lang } = await params

  const supportedLangs = ["en", "es", "fr", "de"] as const

  const safeLang = supportedLangs.includes(lang as any) ? (lang as (typeof supportedLangs)[number]) : "en"

  const dict = await getDictionary(safeLang)

  const specialOffers = [
    {
      title: "Bundle Mega Coleccionista",
      description: "3 Booster Boxes + Accesorios Premium + Cartas Exclusivas",
      originalPrice: "$285.99",
      salePrice: "$199.99",
      discount: "-30%",
      image: "/images/trading-card-booster-packs-collection.png",
      badge: "Oferta Limitada",
      timeLeft: "2 días restantes",
    },
    {
      title: "Pack Competitivo Pro",
      description: "2 Decks Construidos + Guía de Estrategia + Protectores",
      originalPrice: "$129.99",
      salePrice: "$89.99",
      discount: "-31%",
      image: "/images/competitive-trading-card-deck.png",
      badge: "Más Popular",
      timeLeft: "5 días restantes",
    },
    {
      title: "Set Coleccionista Premium",
      description: "Cartas Holográficas Raras + Carpeta Coleccionista",
      originalPrice: "$199.99",
      salePrice: "$149.99",
      discount: "-25%",
      image: "/images/holographic-rare-trading-card.png",
      badge: "Nuevo",
      timeLeft: "1 semana restante",
    },
    {
      title: "Bundle Accesorios Completo",
      description: "Protectores, Carpetas, Dados y Tapete de Juego",
      originalPrice: "$89.99",
      salePrice: "$59.99",
      discount: "-33%",
      image: "/images/trading-card-accessories-sleeves-binders.png",
      badge: "Mejor Valor",
      timeLeft: "3 días restantes",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold bg-red-100 text-red-800 border-red-200 mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              />
            </svg>
            ¡Ofertas por Tiempo Limitado!
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-balance">{dict.offers.title}</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
            Descubre increíbles descuentos en nuestros mejores productos. ¡No dejes pasar estas oportunidades únicas!
          </p>
        </div>
      </section>

      {/* Special Offers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Ofertas Especiales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialOffers.map((offer, index) => (
              <div
                key={index}
                className="rounded-lg border bg-white shadow-sm group hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.title}
                    className="w-full h-68 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-red-600 text-white border-red-500">
                      {offer.discount}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border-blue-200">
                      {offer.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    ⏰ {offer.timeLeft}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold mb-2">{offer.title}</h4>
                  <p className="text-gray-600 mb-4 text-pretty">{offer.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-blue-600">{offer.salePrice}</span>
                    <span className="text-lg line-through text-gray-400">{offer.originalPrice}</span>
                  </div>
                  <button className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-11 px-6">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      />
                    </svg>
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
