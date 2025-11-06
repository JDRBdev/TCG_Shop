import { getDictionary } from "./../dictionaries";
import { fetchSpecialOffers } from "@/app/data/products";
import ProductCard from "@/app/components/molecules/product-card";

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function OfertasPage({ params }: PageProps) {
  const { lang } = await params
  const supportedLangs = ["en", "es", "fr", "de"] as const
  const safeLang = supportedLangs.includes(lang as any) ? (lang as (typeof supportedLangs)[number]) : "en"
  const dict = await getDictionary(safeLang)
  // Traer ofertas dinámicamente: top 6 productos por descuento
  const offers = await fetchSpecialOffers(safeLang)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-bottom" style={{backgroundSize: '40px 40px'}}></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl mb-6 animate-pulse">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            ¡Ofertas por Tiempo Limitado!
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">{dict.offers.title}</h2>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Descubre increíbles descuentos en nuestros mejores productos. ¡No dejes pasar estas oportunidades únicas!
          </p>
        </div>
      </section>

      {/* Special Offers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">Ofertas Especiales</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {offers.map((offer) => (
              <ProductCard 
                key={offer.id} 
                product={offer} 
                dict={dict}
                lang={safeLang || "es"}
                showBadge 
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}