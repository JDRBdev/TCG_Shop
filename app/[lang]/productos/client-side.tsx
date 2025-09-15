// app/productos/ProductosClientPage.tsx
"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
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
  dict: any // Agregar el diccionario como prop
  lang: string // Agregar el idioma actual como prop
}

// Función optimizada para obtener solo precios y stock actualizados
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

  // Estado local
  const [searchTerm, setSearchTerm] = useState("")
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isUpdating, setIsUpdating] = useState(false)

  // Usar filtros iniciales desde SSR
  const [selectedLanguage, setSelectedLanguage] = useState(initialFilters.language)
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category)
  const [selectedBrand, setSelectedBrand] = useState(initialFilters.brand)
  const [sortBy, setSortBy] = useState(initialFilters.sort)
  const [showOnlyInStock, setShowOnlyInStock] = useState(initialFilters.inStock)

  // POLLING OPTIMIZADO para actualizaciones
  useEffect(() => {
    isMountedRef.current = true
    let timeoutId: NodeJS.Timeout
    let isTabVisible = true

    // Función para actualizar datos
    const updateProductData = async () => {
      if (!isMountedRef.current || !isTabVisible || isUpdating) return

      setIsUpdating(true)
      try {
        const updatedData = await fetchUpdatedProductData()
        
        if (isMountedRef.current && updatedData.length > 0) {
          setAllProducts(prevProducts => 
            prevProducts.map(product => {
              const updated = updatedData.find(p => p.id === product.id)
              if (updated && (
                updated.price !== product.price || 
                updated.discount !== product.discount ||
                updated.inStock !== product.inStock
              )) {
                console.log(`📊 Producto actualizado: ${product.name}`)
                return { 
                  ...product, 
                  price: updated.price,
                  discount: updated.discount,
                  inStock: updated.inStock
                }
              }
              return product
            })
          )
          setLastUpdate(new Date())
        }
      } catch (error) {
        console.error('Error en polling:', error)
      } finally {
        setIsUpdating(false)
      }
    }

    // Detectar visibilidad de la pestaña
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible'
      if (isTabVisible) {
        // Si la pestaña se vuelve visible, actualizar inmediatamente
        updateProductData()
      }
    }

    // Configurar listener de visibilidad
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Función recursiva para polling inteligente
    const startPolling = () => {
      if (!isMountedRef.current) return

      updateProductData()
      
      // Polling adaptativo: más frecuente cuando la pestaña está visible
      const interval = isTabVisible ? 15000 : 30000 // 15s visible, 30s oculta
      timeoutId = setTimeout(startPolling, interval)
    }

    // Iniciar polling
    startPolling()

    // Cleanup
    return () => {
      isMountedRef.current = false
      clearTimeout(timeoutId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isUpdating])

  // Actualizar URL al cambiar filtro
  const updateFilter = useCallback((key: keyof Filters, value: string | boolean) => {
    // Actualizar estado local
    if (key === 'language') {
      setSelectedLanguage(value as string)
    } else if (key === 'category') {
      setSelectedCategory(value as string)
    } else if (key === 'brand') {
      setSelectedBrand(value as string)
    } else if (key === 'sort') {
      setSortBy(value as string)
    } else if (key === 'inStock') {
      setShowOnlyInStock(value as boolean)
    }

    // Actualizar URL
    const params = new URLSearchParams(window.location.search)
    params.set(key, value.toString())
    router.push(`/productos?${params.toString()}`, { scroll: false })
  }, [router])

  // Datos para filtros - AHORA USANDO EL DICCIONARIO
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
    { value: "yugioh", label: "Yu-Gi-Oh!" },
    { value: "one-piece", label: "One Piece" },
    { value: "digimon", label: "Digimon" },
  ]

  const sortOptions = [
    { value: "name", label: dict.products.filters.sortName || "Nombre A-Z" },
    { value: "price-low", label: dict.products.filters.sortPriceLow || "Precio: Menor a Mayor" },
    { value: "price-high", label: dict.products.filters.sortPriceHigh || "Precio: Mayor a Menor" },
    { value: "discount", label: dict.products.filters.sortDiscount || "Descuento: Mayor a Menor" },
  ]

  // Filtrar productos
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = selectedLanguage === "all" || product.language === selectedLanguage
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand
    const matchesStock = !showOnlyInStock || product.inStock

    return matchesSearch && matchesLanguage && matchesCategory && matchesBrand && matchesStock
  })

  // Ordenar productos
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      {/* Header con búsqueda y controles - USANDO DICCIONARIO */}
      <section className="py-8 shadow-lg">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 items-center">
          <div className="flex-1 relative">
            <div className="relative">
              <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                placeholder={dict.products.search.placeholder || "Buscar productos..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-12 rounded-lg border-0 shadow-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <div className="relative inline-block w-full lg:w-64">
            <select
              value={sortBy}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="h-12 w-full rounded-lg border-0 bg-white shadow-md px-4 pr-10 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 appearance-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.243a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar filtros - Desktop - USANDO DICCIONARIO */}
        <aside className="lg:w-64 hidden lg:block">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-2">
              {dict.products.filters.title || "Filtros"}
            </h3>

            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">
                {dict.products.filters.availability || "Disponibilidad"}
              </h4>
              <div className="space-y-2">
                  <label className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnlyInStock}
                      onChange={(e) => updateFilter("inStock", e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {dict.products.filters.onlyInStock || "Solo productos disponibles"}
                    </span>
                  </label>
              </div>
            </div>

            {/* Idioma */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">
                {dict.products.filters.language || "Idioma"}
              </h4>
              <div className="space-y-2">
                {language.map((langOption) => (
                  <label key={langOption.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value={langOption.value}
                      checked={selectedLanguage === langOption.value}
                      onChange={() => updateFilter("language", langOption.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{langOption.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">
                {dict.products.filters.category || "Categoría"}
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={() => updateFilter("category", cat.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">
                {dict.products.filters.brand || "Marca"}
              </h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand.value} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      value={brand.value}
                      checked={selectedBrand === brand.value}
                      onChange={() => updateFilter("brand", brand.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{brand.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Productos */}
        <main className="flex-1">
          {/* Info de resultados - USANDO DICCIONARIO */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600 text-sm">
              {dict.products.results.showing || "Mostrando"} <span className="font-semibold">{sortedProducts.length}</span> {dict.products.results.products || "productos"}
            </p>
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                  dict={dict}       // ✅ pasa el diccionario
                  lang={lang || "en"} // ✅ pasa el idioma actual
                />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 mb-2">
                {dict.products.results.noProducts || "No se encontraron productos"}
              </h3>
              <p className="text-sm text-gray-500">
                {dict.products.results.tryAdjusting || "Intenta ajustar los filtros o términos de búsqueda"}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Botón flotante para móviles */}
      <button 
        onClick={() => setIsMobileFiltersOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-all transform hover:scale-110"
        aria-label={dict.products.filters.openFilters || "Abrir filtros"}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
        </svg>
      </button>

      {/* Panel de filtros móviles - USANDO DICCIONARIO */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute inset-0 bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)}></div>
        <div className="absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {dict.products.filters.title || "Filtros"}
              </h2>
              <button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label={dict.products.filters.closeFilters || "Cerrar filtros"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">
                {dict.products.filters.availability || "Disponibilidad"}
              </h4>
              <div className="space-y-2">
                  <label className="flex items-center p-3 rounded-lg bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showOnlyInStock}
                      onChange={(e) => updateFilter("inStock", e.target.checked)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">
                      {dict.products.filters.onlyInStock || "Solo productos disponibles"}
                    </span>
                  </label>
              </div>
            </div>

            {/* Idioma */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">
                {dict.products.filters.language || "Idioma"}
              </h4>
              <div className="space-y-2">
                {language.map((langOption) => (
                  <label key={langOption.value} className="flex items-center p-3 rounded-lg bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="language-mobile"
                      value={langOption.value}
                      checked={selectedLanguage === langOption.value}
                      onChange={() => {
                        updateFilter("language", langOption.value)
                      }}
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{langOption.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">
                {dict.products.filters.category || "Categoría"}
              </h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center p-3 rounded-lg bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="category-mobile"
                      value={cat.value}
                      checked={selectedCategory === cat.value}
                      onChange={() => {
                        updateFilter("category", cat.value)
                      }}
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-gray-700">
                {dict.products.filters.brand || "Marca"}
              </h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand.value} className="flex items-center p-3 rounded-lg bg-gray-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="brand-mobile"
                      value={brand.value}
                      checked={selectedBrand === brand.value}
                      onChange={() => {
                        updateFilter("brand", brand.value)
                      }}
                      className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{brand.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              {dict.products.filters.applyFilters || "Aplicar filtros"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}