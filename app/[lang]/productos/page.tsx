"use client"

import { useState } from "react"

interface PageProps {
  params: Promise<{ lang: string }>
}

export default function ProductosPage({ params }: PageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRarity, setSelectedRarity] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - en una app real vendría de una API
  const products = [
    {
      id: 1,
      name: "Booster Pack Premium",
      category: "booster",
      rarity: "common",
      price: 15.99,
      originalPrice: 18.99,
      image: "/images/trading-card-booster-pack-premium.png",
      rating: 4.8,
      inStock: true,
      description: "Pack con 15 cartas aleatorias incluyendo 1 rara garantizada",
    },
    {
      id: 2,
      name: "Deck Competitivo Dragón",
      category: "deck",
      rarity: "rare",
      price: 45.99,
      originalPrice: null,
      image: "/images/competitive-trading-card-deck.png",
      rating: 4.9,
      inStock: true,
      description: "Deck construido listo para torneos con estrategia de dragones",
    },
    {
      id: 3,
      name: "Carta Holográfica Legendaria",
      category: "single",
      rarity: "legendary",
      price: 89.99,
      originalPrice: 99.99,
      image: "/images/holographic-rare-trading-card.png",
      rating: 5.0,
      inStock: false,
      description: "Carta única con efectos holográficos y poder legendario",
    },
    {
      id: 4,
      name: "Set Coleccionista Edición Limitada",
      category: "set",
      rarity: "epic",
      price: 129.99,
      originalPrice: null,
      image: "/images/collector-trading-card-set.png",
      rating: 4.7,
      inStock: true,
      description: "Colección completa de 50 cartas con caja especial",
    },
    {
      id: 5,
      name: "Booster Box Completa",
      category: "booster",
      rarity: "rare",
      price: 199.99,
      originalPrice: 229.99,
      image: "/images/trading-card-booster-packs-collection.png",
      rating: 4.6,
      inStock: true,
      description: "36 packs en caja sellada con cartas exclusivas",
    },
    {
      id: 6,
      name: "Deck Starter Principiante",
      category: "deck",
      rarity: "common",
      price: 24.99,
      originalPrice: null,
      image: "/images/competitive-trading-card-deck.png",
      rating: 4.3,
      inStock: true,
      description: "Deck perfecto para comenzar a jugar con guía incluida",
    },
  ]

  const categories = [
    { value: "all", label: "Todas las Categorías" },
    { value: "booster", label: "Booster Packs" },
    { value: "deck", label: "Decks Construidos" },
    { value: "single", label: "Cartas Individuales" },
    { value: "set", label: "Sets Coleccionista" },
  ]

  const rarities = [
    { value: "all", label: "Todas las Rarezas" },
    { value: "common", label: "Común" },
    { value: "rare", label: "Rara" },
    { value: "epic", label: "Épica" },
    { value: "legendary", label: "Legendaria" },
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
    { value: "rating", label: "Mejor Valorados" },
  ]

  // Filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesRarity = selectedRarity === "all" || product.rarity === selectedRarity

    let matchesPrice = true
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map((p) => (p === "+" ? Number.POSITIVE_INFINITY : Number.parseInt(p)))
      matchesPrice = product.price >= min && (max === undefined || product.price <= max)
    }

    return matchesSearch && matchesCategory && matchesRarity && matchesPrice
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
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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

              {/* Rarity Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Rareza</h4>
                <div className="space-y-2">
                  {rarities.map((rarity) => (
                    <label key={rarity.value} className="flex items-center">
                      <input
                        type="radio"
                        name="rarity"
                        value={rarity.value}
                        checked={selectedRarity === rarity.value}
                        onChange={(e) => setSelectedRarity(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{rarity.label}</span>
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
                  setSelectedRarity("all")
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
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border bg-white shadow-sm group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRarityColor(product.rarity)}`}
                        >
                          {product.rarity}
                        </span>
                      </div>
                      {product.originalPrice && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                            Oferta
                          </span>
                        </div>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold leading-none tracking-tight mb-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 text-pretty">{product.description}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm line-through text-gray-400">${product.originalPrice}</span>
                        )}
                      </div>
                      <button
                        disabled={!product.inStock}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 h-9 px-3 ${
                          product.inStock
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                          />
                        </svg>
                        {product.inStock ? "Agregar" : "Agotado"}
                      </button>
                    </div>
                  </div>
                </div>
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
