import { getDictionary } from "./../dictionaries";
import { specialOffers } from "@/app/data/products";
import ProductCard from "@/app/components/molecules/product-card";

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function OfertasPage({ params }: PageProps) {
  const { lang } = await params

  const supportedLangs = ["en", "es", "fr", "de"] as const

  const safeLang = supportedLangs.includes(lang as any) ? (lang as (typeof supportedLangs)[number]) : "en"

  const dict = await getDictionary(safeLang)

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
            {specialOffers.map((offer) => (
              <ProductCard key={offer.id} product={offer} showBadge />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
