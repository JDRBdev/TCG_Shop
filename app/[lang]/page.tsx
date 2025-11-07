import Link from "next/link";
import ProductCard from "../components/molecules/product-card";
import { fetchNewProducts } from "../data/products";
import { getDictionary } from "../hooks/dictionaries";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const supportedLangs = ["en", "es", "fr", "de"] as const;
  const safeLang = supportedLangs.includes(lang as any)
    ? (lang as (typeof supportedLangs)[number])
    : "es";
  const dict = await getDictionary(safeLang);
  const newProducts = await fetchNewProducts(safeLang);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-24 bg-white/70 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-extrabold text-slate-900 mb-6">
            {dict.hero.title}
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            {dict.hero.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/productos"
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-transform hover:scale-105"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              {dict.hero.exploreCatalog}
            </a>
            <a
              href="/ofertas"
              className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold shadow-sm transition-all"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              {dict.hero.viewOffers}
            </a>
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-900">
            {dict.products.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                showBadge={!!p.price}
                dict={dict}
                lang={safeLang}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white/80 backdrop-blur-sm border-t border-b border-slate-200">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-slate-900">
            {dict.categories.title}
          </h3>
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
                href: "/productos?category=preconstructed-decks",
              },
              {
                title: dict.categories.accessories.title,
                description: dict.categories.accessories.description,
                image: "/images/trading-card-accessories-sleeves-binders.png",
                count: dict.categories.accessories.count,
                href: "/productos?category=booster-box",
              },
            ].map((cat, i) => (
              <a
                key={i}
                href={cat.href}
                className="group bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all"
              >
                <div className="relative">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="inline-flex items-center bg-blue-600 rounded-full px-3 py-0.5 text-xs font-semibold mb-1">
                      {cat.count}
                    </span>
                    <h4 className="text-xl font-bold">{cat.title}</h4>
                    <p className="text-sm opacity-90">{cat.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
