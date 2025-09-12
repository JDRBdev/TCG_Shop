"use client"

import { use, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProductCard from "@/app/components/molecules/product-card"
import { fetchProducts, Product } from "@/app/data/products"

export default function ProductosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Estado local
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar productos según idioma
  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      const data = await fetchProducts(lang)
      setAllProducts(data)
      setLoading(false)
    }
    loadProducts()
  }, [lang])

  // Inicializar filtros desde URL solo al montar
  const langParam = searchParams.get("language") || "all"
  const catParam = searchParams.get("category") || "all"
  const brandParam = searchParams.get("brand") || "all"
  const sortParam = searchParams.get("sort") || "name"
  const stockParam = searchParams.get("inStock") === "true"

  useEffect(() => {
    setSelectedLanguage(langParam)
    setSelectedCategory(catParam)
    setSelectedBrand(brandParam)
    setSortBy(sortParam)
    setShowOnlyInStock(stockParam)
  }, [langParam, catParam, brandParam, sortParam, stockParam])

  // Actualizar estado local y URL al cambiar filtro
  const updateFilter = (key: "language" | "category" | "brand" | "sort" | "inStock", value: string | boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value.toString())
    router.push(`/productos?${params.toString()}`)

    if (key === "language") setSelectedLanguage(value as string)
    if (key === "category") setSelectedCategory(value as string)
    if (key === "brand") setSelectedBrand(value as string)
    if (key === "sort") setSortBy(value as string)
    if (key === "inStock") setShowOnlyInStock(value as boolean)
  }

  // Datos para filtros
  const language = [
    { value: "all", label: "Todos los idiomas" },
    { value: "es", label: "Español" },
    { value: "en", label: "Inglés" },
    { value: "fr", label: "Francés" },
    { value: "de", label: "Alemán" },
  ]

  const categories = [
    { value: "all", label: "Todas las Categorías" },
    { value: "booster-packs", label: "Booster Packs" },
    { value: "deck", label: "Decks Construidos" },
    { value: "booster-box", label: "Booster Box" },
    { value: "set", label: "Sets Coleccionista" },
  ]

  const brands = [
    { value: "all", label: "Todas las Marcas" },
    { value: "pokemon", label: "Pokémon" },
    { value: "magic-the-gathering", label: "Magic: The Gathering" },
    { value: "yugioh", label: "Yu-Gi-Oh!" },
    { value: "one-piece", label: "One Piece" },
    { value: "digimon", label: "Digimon" },
  ]

  const sortOptions = [
    { value: "name", label: "Nombre A-Z" },
    { value: "price-low", label: "Precio: Menor a Mayor" },
    { value: "price-high", label: "Precio: Mayor a Menor" },
    { value: "discount", label: "Descuento: Mayor a Menor" },
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
    <div className="min-h-screen bg-white text-black">
      {/* Search y Sort */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 w-full h-12 rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative inline-block w-64">
            <select
              value={sortBy}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 pr-10 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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

          {/* Checkbox disponibilidad */}
          <label className="flex items-center ml-4">
            <input
              type="checkbox"
              checked={showOnlyInStock}
              onChange={(e) => updateFilter("inStock", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Solo disponibles</span>
          </label>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar filtros (idioma, categoría, marca) */}
        <aside className="lg:w-64 hidden lg:block">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-6">Filtros</h3>

            {/* Idioma */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Idioma</h4>
              <div className="space-y-2">
                {language.map((lang) => (
                  <label key={lang.value} className="flex items-center">
                    <input
                      type="radio"
                      name="language"
                      value={lang.value}
                      checked={selectedLanguage === lang.value}
                      onChange={() => updateFilter("language", lang.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{lang.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categoría */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categoría</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.value} className="flex items-center">
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
              <h4 className="font-medium mb-3">Marca</h4>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand.value} className="flex items-center">
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
          {loading ? (
            <div className="text-center py-12">Cargando productos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} showBadge={!!p.price}/>
              ))}
            </div>
          )}

          {sortedProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}