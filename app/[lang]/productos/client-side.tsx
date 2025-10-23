// app/productos/ProductosClientPage.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import ProductCard from "@/app/components/molecules/product-card"
import { createClient } from '@supabase/supabase-js'
import { Product } from "@/app/data/products"

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json'
    }
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

interface Filters {
  language: string
  category: string
  brand: string
  sort: string
  inStock: boolean
}

interface ProductosClientPageProps {
  initialProducts: Product[]
  initialFilters: Filters
  dict: any
  lang: string
}

async function fetchUpdatedProductData(): Promise<{id: string, price: number, discount: number, inStock: boolean}[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, price, discount, in_stock')
      .order('name')

    if (error) {
      console.error('Error fetching updated prices:', error)
      return []
    }

    return (data || []).map(item => ({
      id: item.id,
      price: Number(item.price) || 0,
      discount: Number(item.discount) || 0,
      inStock: item.in_stock
    }))
  } catch (error) {
    console.error('Error in fetchUpdatedProductData:', error)
    return []
  }
}

export default function ProductosClientPage({ 
  initialProducts, 
  initialFilters,
  dict,
  lang
}: ProductosClientPageProps) {
  const router = useRouter()
  const isMountedRef = useRef(true)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isUpdating, setIsUpdating] = useState(false)

  const [selectedLanguage, setSelectedLanguage] = useState(initialFilters.language)
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category)
  const [selectedBrand, setSelectedBrand] = useState(initialFilters.brand)
  const [sortBy, setSortBy] = useState(initialFilters.sort)
  const [showOnlyInStock, setShowOnlyInStock] = useState(initialFilters.inStock)

useEffect(() => {
  isMountedRef.current = true;
  let isUpdating = false;

  const updateProductData = async () => {
    if (!isMountedRef.current || isUpdating) return;
    isUpdating = true;
    try {
      const updatedData = await fetchUpdatedProductData();
      if (updatedData.length > 0) {
        setAllProducts(prevProducts =>
          prevProducts.map(product => {
            const updated = updatedData.find(p => p.id === product.id);
            if (
              updated &&
              (updated.price !== product.price ||
                updated.discount !== product.discount ||
                updated.inStock !== product.inStock)
            ) {
              console.log(`📊 Producto actualizado: ${product.name}`);
              return { ...product, ...updated };
            }
            return product;
          })
        );
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Error actualizando productos:", error);
    } finally {
      isUpdating = false;
    }
  };

  updateProductData();

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      updateProductData();
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    isMountedRef.current = false;
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, []);


  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: keyof Filters, value: string | boolean) => {
      if (key === "language") {
        setSelectedLanguage(value as string)
      } else if (key === "category") {
        setSelectedCategory(value as string)
      } else if (key === "brand") {
        setSelectedBrand(value as string)
      } else if (key === "sort") {
        setSortBy(value as string)
      } else if (key === "inStock") {
        setShowOnlyInStock(value as boolean)
      }

      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value.toString())

      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const language = [
    { value: "all", label: dict.products.filters.allLanguages || "Todos los idiomas" },
    { value: "es", label: dict.products.filters.spanish || "Español" },
    { value: "en", label: dict.products.filters.english || "Inglés" },
    { value: "jp", label: dict.products.filters.japanese || "Japonés" },
  ]

  const categories = [
    { value: "all", label: dict.products.filters.allCategories || "Todas las Categorías" },
    { value: "booster-packs", label: dict.products.filters.boosterPacks || "Booster Packs" },
    { value: "preconstructed-deck", label: dict.products.filters.constructedDecks || "Decks Construidos" },
    { value: "booster-box", label: dict.products.filters.boosterBox || "Booster Box" },
    { value: "collector-set", label: dict.products.filters.collectorSet || "Sets Coleccionista" },
  ]

  const brands = [
    { value: "all", label: dict.products.filters.allBrands || "Todas las Marcas" },
    { value: "pokemon", label: "Pokémon" },
    { value: "magic", label: "Magic: The Gathering" },
    { value: "one-piece", label: "One Piece" },
  ]

  const sortOptions = [
    { value: "name", label: dict.products.filters.sortName || "Nombre A-Z" },
    { value: "price-low", label: dict.products.filters.sortPriceLow || "Precio: Menor a Mayor" },
    { value: "price-high", label: dict.products.filters.sortPriceHigh || "Precio: Mayor a Menor" },
    { value: "discount", label: dict.products.filters.sortDiscount || "Descuento: Mayor a Menor" },
  ]

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage === "all" || product.language === selectedLanguage
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand
    const matchesStock = !showOnlyInStock || product.inStock

    return matchesSearch && matchesLanguage && matchesCategory && matchesBrand && matchesStock
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name": return a.name.localeCompare(b.name)
      case "price-low": return a.price - b.price
      case "price-high": return b.price - a.price
      case "discount": return (b.discount || 0) - (a.discount || 0)
      default: return 0
    }
  })

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header con búsqueda y controles */}
      <section className="py-10 bg-white/60 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 relative w-full">
            <div className="relative group">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder={dict.products.search.placeholder || "Buscar productos..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full h-14 rounded-xl border-2 border-slate-200 bg-white shadow-lg px-4 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="relative inline-block w-full lg:w-72">
            <select
              value={sortBy}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="h-14 w-full rounded-xl border-2 border-slate-200 bg-white shadow-lg px-4 pr-12 py-2 text-base text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer transition-all"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.243a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 flex gap-8">
        {/* Sidebar filtros - Desktop */}
        <aside className="lg:w-72 hidden lg:block">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sticky top-24">
            <h3 className="text-xl font-bold mb-6 text-slate-900 pb-3 border-b-2 border-blue-500 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              {dict.products.filters.title || "Filtros"}
            </h3>

            <div className="mb-6">
              <h4 className="font-bold mb-3 text-slate-800 text-sm uppercase tracking-wide">
                {dict.products.filters.availability || "Disponibilidad"}
              </h4>
              <div className="space-y-2">
                  <label className="flex items-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                    <input
                      type="checkbox"
                      checked={showOnlyInStock}
                      onChange={(e) => updateFilter("inStock", e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm text-slate-700 font-medium">
                      {dict.products.filters.onlyInStock || "Solo productos disponibles"}
                    </span>
                  </label>
              </div>
            </div>

            {/* Idioma */}
            <div className="mb-6">
              <h4 className="font-bold mb-3 text-slate-800 text-sm uppercase tracking-wide">
                {dict.products.filters.language || "Idioma"}
              </h4>
              <div className="space-y-2">
                {language.map((langOption) => (
                  <label key={langOption.value} className="flex items-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                    <input
                      type="radio"
                      name="language"
                      value={langOption.value}
                      checked={selectedLanguage === langOption.value}
                      onChange={() => updateFilter("language", langOption.value)}
                      className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm text-slate-700 font-medium">{langOption.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <h4 className="font-bold mb-3 text-slate-800 text-sm uppercase tracking-wide">
                {dict.products.filters.category || "Categoría"}
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={() => updateFilter("category", cat.value)}
                      className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm text-slate-700 font-medium">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div className="mb-6">
              <h4 className="font-bold mb-3 text-slate-800 text-sm uppercase tracking-wide">
                {dict.products.filters.brand || "Marca"}
              </h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand.value} className="flex items-center p-3 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                    <input
                      type="radio"
                      name="brand"
                      value={brand.value}
                      checked={selectedBrand === brand.value}
                      onChange={() => updateFilter("brand", brand.value)}
                      className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm text-slate-700 font-medium">{brand.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Productos */}
        <main className="flex-1">
          {/* Info de resultados */}
          <div className="mb-8 flex justify-between items-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
            <p className="text-slate-700 text-base font-medium">
              {dict.products.results.showing || "Mostrando"} <span className="font-bold text-blue-600">{sortedProducts.length}</span> {dict.products.results.products || "productos"}
            </p>
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              {dict.products.filters.title || "Filtros"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedProducts.map((p) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  showBadge={!!p.price} 
                  dict={dict}
                  lang={lang || "en"}
                />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-slate-200">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {dict.products.results.noProducts || "No se encontraron productos"}
              </h3>
              <p className="text-base text-slate-600">
                {dict.products.results.tryAdjusting || "Intenta ajustar los filtros o términos de búsqueda"}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Botón flotante para móviles */}
      <button 
        onClick={() => setIsMobileFiltersOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-2xl flex items-center justify-center transition-all transform hover:scale-110"
        aria-label={dict.products.filters.openFilters || "Abrir filtros"}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
      </button>

      {/* Panel de filtros móviles */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)}></div>
        <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-2xl overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-500">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                {dict.products.filters.title || "Filtros"}
              </h2>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                aria-label={dict.products.filters.closeFilters || "Cerrar filtros"}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-3 text-slate-800 text-sm uppercase tracking-wide">
                {dict.products.filters.availability || "Disponibilidad"}
              </h4>
              <div className="space-y-2">
                  <label className="flex items-center p-4 rounded-xl bg-slate-50 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-300">
                    <input
                      type="checkbox"
                      checked={showOnlyInStock}
                      onChange={(e) => updateFilter("inStock", e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-700 font-medium">
                      {dict.products.filters.onlyInStock || "Solo productos disponibles"}
                    </span>
                  </label>
              </div>
            </div>

            {/* Idioma */}
            <div className="mb-6">
              <h4 className="font-bold mb-3 text-slate-800 text-sm uppercase tracking-wide">
                {dict.products.filters.language || "Idioma"}
              </h4>
              <div className="space-y-2">
                {language.map((langOption) => (
                  <label key={langOption.value} className="flex items-center p-4 rounded-xl bg-slate-50 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-300">
                    <input
                      type="radio"
                      name="language-mobile"
                      value={langOption.value}
                      checked={selectedLanguage === langOption.value}
                      onChange={() => {
                        updateFilter("language", langOption.value)
                      }}
                      className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-700 font-medium">{langOption.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <h4 className="font-bold mb-3 text-slate-800 text-sm uppercase tracking-wide">
                {dict.products.filters.category || "Categoría"}
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center p-4 rounded-xl bg-slate-50 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-300">
                    <input
                      type="radio"
                      name="category-mobile"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={() => {
                        updateFilter("category", cat.value)
                      }}
                      className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-700 font-medium">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div className="mb-6">
              <h4 className="font-bold mb-3 text-slate-800 text-sm uppercase tracking-wide">
                {dict.products.filters.brand || "Marca"}
              </h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand.value} className="flex items-center p-4 rounded-xl bg-slate-50 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-300">
                    <input
                      type="radio"
                      name="brand-mobile"
                      value={brand.value}
                      checked={selectedBrand === brand.value}
                      onChange={() => {
                        updateFilter("brand", brand.value)
                      }}
                      className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-700 font-medium">{brand.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-xl transition-all transform hover:scale-105"
            >
              {dict.products.filters.applyFilters || "Aplicar filtros"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}