"use client"

import { use, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProductCard from "@/app/components/molecules/product-card"
import { fetchProducts, Product } from "@/app/data/products"

export default function ProductosPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)

  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar productos según idioma
  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      const data = await fetchProducts(lang)
      console.log("Productos recibidos de Supabase:", data)
      setAllProducts(data)
      setLoading(false)
    }
    loadProducts()
  }, [lang])

  // Sincronizar estado con parámetros de la URL al cargar / recargar
  useEffect(() => {
    const catParam = searchParams.get("category") || "all"
    const priceParam = searchParams.get("price") || "all"
    const sortParam = searchParams.get("sort") || "name"

    // Mapping URL → valor interno
    const categoryMapping: Record<string, string> = {
      "constructed-decks": "deck",
      "booster-packs": "booster-packs",
      "single-cards": "single",
      "collector-sets": "set",
    }

    const mappedCategory = categoryMapping[catParam] || catParam

    setSelectedCategory(mappedCategory)
    setPriceRange(priceParam)
    setSortBy(sortParam)
  }, [searchParams])

  // Función para actualizar la URL y estado al cambiar filtro
  const updateFilter = (key: "category" | "price" | "sort", value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`/productos?${params.toString()}`)

    if (key === "category") setSelectedCategory(value)
    if (key === "price") setPriceRange(value)
    if (key === "sort") setSortBy(value)
  }

  const categories = [
    { value: "all", label: "Todas las Categorías" },
    { value: "booster-packs", label: "Booster Packs" },
    { value: "deck", label: "Decks Construidos" },
    { value: "single", label: "Cartas Individuales" },
    { value: "set", label: "Sets Coleccionista" },
  ]

  const priceRanges = [
    { value: "all", label: "Todos los Precios" },
    { value: "0-25", label: "€0 - €25" },
    { value: "25-50", label: "€25 - €50" },
    { value: "50-100", label: "€50 - €100" },
    { value: "100+", label: "€100+" },
  ]

  const sortOptions = [
    { value: "name", label: "Nombre A-Z" },
    { value: "price-low", label: "Precio: Menor a Mayor" },
    { value: "price-high", label: "Precio: Mayor a Menor" },
  ]

  // Filtrar productos
  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    let matchesPrice = true
    if (priceRange !== "all") {
      if (priceRange === "100+") {
        matchesPrice = product.price >= 100
      } else {
        const [min, max] = priceRange.split("-").map(Number)
        matchesPrice = product.price >= min && product.price <= max
      }
    }

    return matchesSearch && matchesCategory && matchesPrice
  })

  // Ordenar productos
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Search y Filtros */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 w-full h-12 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar Filtros */}
        <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-6">Filtros</h3>

            {/* Categoría */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Categoría</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.value} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={() => updateFilter("category", category.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Precio */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Precio</h4>
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label key={range.value} className="flex items-center">
                    <input
                      type="radio"
                      name="price"
                      value={range.value}
                      checked={priceRange === range.value}
                      onChange={() => updateFilter("price", range.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{range.label}</span>
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
