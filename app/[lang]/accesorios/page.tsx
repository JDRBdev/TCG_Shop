"use client"

import { useState } from "react"

interface PageProps {
  params: Promise<{ lang: string }>
}

export default function AccesoriosPage({ params }: PageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedMaterial, setSelectedMaterial] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  // Mock data para accesorios
  const accessories = [
    {
      id: 1,
      name: "Protectores Premium Transparentes",
      type: "sleeves",
      material: "plastic",
      price: 12.99,
      originalPrice: 15.99,
      image: "/images/trading-card-accessories-sleeves-binders.png",
      rating: 4.8,
      inStock: true,
      description: "Pack de 100 protectores transparentes de alta calidad",
      brand: "CardGuard Pro",
    },
    {
      id: 2,
      name: "Carpeta Coleccionista 9-Pocket",
      type: "binder",
      material: "leather",
      price: 24.99,
      originalPrice: null,
      image: "/images/trading-card-accessories-sleeves-binders.png",
      rating: 4.9,
      inStock: true,
      description: "Carpeta de cuero sintético con 20 páginas para 360 cartas",
      brand: "CollectorMax",
    },
    {
      id: 3,
      name: "Tapete de Juego Dragón Místico",
      type: "playmat",
      material: "rubber",
      price: 29.99,
      originalPrice: 34.99,
      image: "/images/trading-card-accessories-sleeves-binders.png",
      rating: 4.7,
      inStock: true,
      description: "Tapete de goma antideslizante con diseño exclusivo",
      brand: "GameMat Elite",
    },
    {
      id: 4,
      name: "Set de Dados Metálicos",
      type: "dice",
      material: "metal",
      price: 18.99,
      originalPrice: null,
      image: "/images/trading-card-accessories-sleeves-binders.png",
      rating: 4.6,
      inStock: false,
      description: "Set de 7 dados metálicos con grabado láser",
      brand: "MetalDice Co",
    },
    {
      id: 5,
      name: "Caja de Almacenamiento Deluxe",
      type: "storage",
      material: "wood",
      price: 45.99,
      originalPrice: 52.99,
      image: "/images/trading-card-accessories-sleeves-binders.png",
      rating: 4.8,
      inStock: true,
      description: "Caja de madera con compartimentos ajustables",
      brand: "WoodCraft Storage",
    },
    {
      id: 6,
      name: "Contador de Vida Digital",
      type: "counter",
      material: "plastic",
      price: 15.99,
      originalPrice: null,
      image: "/images/trading-card-accessories-sleeves-binders.png",
      rating: 4.4,
      inStock: true,
      description: "Contador digital con pantalla LED y botones grandes",
      brand: "DigitalCount",
    },
    {
      id: 7,
      name: "Protectores Mate Negro",
      type: "sleeves",
      material: "plastic",
      price: 14.99,
      originalPrice: null,
      image: "/images/trading-card-accessories-sleeves-binders.png",
      rating: 4.5,
      inStock: true,
      description: "Pack de 80 protectores mate para reducir reflejos",
      brand: "CardGuard Pro",
    },
    {
      id: 8,
      name: "Separadores de Cartas Premium",
      type: "dividers",
      material: "cardboard",
      price: 8.99,
      originalPrice: 10.99,
      image: "/images/trading-card-accessories-sleeves-binders.png",
      rating: 4.3,
      inStock: true,
      description: "Set de 25 separadores con etiquetas personalizables",
      brand: "OrganizeMax",
    },
  ]

  const types = [
    { value: "all", label: "Todos los Tipos" },
    { value: "sleeves", label: "Protectores" },
    { value: "binder", label: "Carpetas" },
    { value: "playmat", label: "Tapetes de Juego" },
    { value: "dice", label: "Dados" },
    { value: "storage", label: "Almacenamiento" },
    { value: "counter", label: "Contadores" },
    { value: "dividers", label: "Separadores" },
  ]

  const materials = [
    { value: "all", label: "Todos los Materiales" },
    { value: "plastic", label: "Plástico" },
    { value: "leather", label: "Cuero" },
    { value: "rubber", label: "Goma" },
    { value: "metal", label: "Metal" },
    { value: "wood", label: "Madera" },
    { value: "cardboard", label: "Cartón" },
  ]

  const priceRanges = [
    { value: "all", label: "Todos los Precios" },
    { value: "0-15", label: "$0 - $15" },
    { value: "15-30", label: "$15 - $30" },
    { value: "30-50", label: "$30 - $50" },
    { value: "50+", label: "$50+" },
  ]

  const sortOptions = [
    { value: "name", label: "Nombre A-Z" },
    { value: "price-low", label: "Precio: Menor a Mayor" },
    { value: "price-high", label: "Precio: Mayor a Menor" },
    { value: "rating", label: "Mejor Valorados" },
    { value: "brand", label: "Marca A-Z" },
  ]

  // Filtrar accesorios
  const filteredAccessories = accessories.filter((accessory) => {
    const matchesSearch =
      accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accessory.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || accessory.type === selectedType
    const matchesMaterial = selectedMaterial === "all" || accessory.material === selectedMaterial

    let matchesPrice = true
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map((p) => (p === "+" ? Number.POSITIVE_INFINITY : Number.parseInt(p)))
      matchesPrice = accessory.price >= min && (max === undefined || accessory.price <= max)
    }

    return matchesSearch && matchesType && matchesMaterial && matchesPrice
  })

  // Ordenar accesorios
  const sortedAccessories = [...filteredAccessories].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "brand":
        return a.brand.localeCompare(b.brand)
      default:
        return 0
    }
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "sleeves":
        return "🛡️"
      case "binder":
        return "📁"
      case "playmat":
        return "🎯"
      case "dice":
        return "🎲"
      case "storage":
        return "📦"
      case "counter":
        return "🔢"
      case "dividers":
        return "📑"
      default:
        return "🔧"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Accesorios para TCG</h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto text-pretty">
            Protege y organiza tu colección con nuestros accesorios de alta calidad
          </p>
        </div>
      </section>

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
                  placeholder="Buscar accesorios por nombre o marca..."
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

              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Tipo de Accesorio</h4>
                <div className="space-y-2">
                  {types.map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={selectedType === type.value}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Material</h4>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <label key={material.value} className="flex items-center">
                      <input
                        type="radio"
                        name="material"
                        value={material.value}
                        checked={selectedMaterial === material.value}
                        onChange={(e) => setSelectedMaterial(e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{material.label}</span>
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
                  setSelectedType("all")
                  setSelectedMaterial("all")
                  setPriceRange("all")
                  setSortBy("name")
                }}
                className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 h-10 px-4"
              >
                Limpiar Filtros
              </button>
            </div>
          </aside>

          {/* Accessories Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Mostrando {sortedAccessories.length} de {accessories.length} accesorios
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedAccessories.map((accessory) => (
                <div
                  key={accessory.id}
                  className="rounded-lg border bg-white shadow-sm group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={accessory.image || "/placeholder.svg"}
                        alt={accessory.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border-emerald-200">
                          {getTypeIcon(accessory.type)} {types.find((t) => t.value === accessory.type)?.label}
                        </span>
                      </div>
                      {accessory.originalPrice && (
                        <div className="absolute top-2 right-2">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                            Oferta
                          </span>
                        </div>
                      )}
                      {!accessory.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold leading-none tracking-tight">{accessory.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{accessory.brand}</p>
                    <p className="text-sm text-gray-600 mb-3 text-pretty">{accessory.description}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(accessory.rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({accessory.rating})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-emerald-600">${accessory.price}</span>
                        {accessory.originalPrice && (
                          <span className="text-sm line-through text-gray-400">${accessory.originalPrice}</span>
                        )}
                      </div>
                      <button
                        disabled={!accessory.inStock}
                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 h-9 px-3 ${
                          accessory.inStock
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
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
                        {accessory.inStock ? "Agregar" : "Agotado"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedAccessories.length === 0 && (
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
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron accesorios</h3>
                <p className="text-gray-600">Intenta ajustar tus filtros de búsqueda</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
