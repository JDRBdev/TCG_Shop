"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { products } from "@/app/data/products";
import ProductCard from "@/app/components/molecules/product-card";

interface PageProps {
  params: Promise<{ lang: string }>
}

export default function ProductosPage({ params }: PageProps) {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  // Efecto para procesar parámetros de la URL al cargar el componente
  useEffect(() => {
    const categoryParam = searchParams?.get("category")
    if (categoryParam) {
      // Mapear parámetros de URL a valores de categoría
      const categoryMapping: Record<string, string> = {
        "constructed-decks": "deck",
        "booster-packs": "booster",
        "single-cards": "single",
        "collector-sets": "set"
      }
      
      const mappedCategory = categoryMapping[categoryParam] || categoryParam
      if (categories.some(cat => cat.value === mappedCategory)) {
        setSelectedCategory(mappedCategory)
      }
    }
  }, [searchParams])

  const categories = [
    { value: "all", label: "Todas las Categorías" },
    { value: "booster", label: "Booster Packs" },
    { value: "deck", label: "Decks Construidos" },
    { value: "single", label: "Cartas Individuales" },
    { value: "set", label: "Sets Coleccionista" },
  ]

  const priceRanges = [
    { value: "all", label: "Todos los Precios" },
    { value: "0-25", label: "$0 - $25" },
    { value: "25-50", label: "$25 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100+", label: "$100+" },
  ]

  const sortOptions = [
    { value: "name", label: "Nombre A-Z" },
    { value: "price-low", label: "Precio: Menor a Mayor" },
    { value: "price-high", label: "Precio: Mayor a Menor" },
  ]

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    let matchesPrice = true
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map((p) => (p === "+" ? Number.POSITIVE_INFINITY : Number.parseInt(p)))
      matchesPrice = product.price >= min && (max === undefined || product.price <= max)
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
      {/* Search and Filters Section */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
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
                  type="text"
                  placeholder="Buscar productos por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full flex h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 h-12 px-4"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filtros
            </button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex h-12 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-6">Filtros</h3>

              {/* Category Filter */}
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
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
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
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setPriceRange("all")
                  setSortBy("name")
                }}
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 h-10 px-4"
              >
                Limpiar Filtros
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Mostrando {sortedProducts.length} de {products.length} productos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  showBadge={!!p.price}   // mostrar "Oferta" si tiene precio original
                />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17H9v-2.5A3.5 3.5 0 0112.5 11h0A3.5 3.5 0 0116 14.5V17z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
