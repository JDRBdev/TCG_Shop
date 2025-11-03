"use client"

import { useMemo } from "react"
import { useProductUpdatesContext } from "@/app/components/atoms/provider/product-updates-context"
import AddToCartButton from "./add-tocart-button"

/**
 * Props del componente: datos estáticos del producto (del servidor)
 */
type Props = {
  id: string              // ID del producto
  price: number           // Precio inicial desde el servidor
  discount?: number       // Descuento inicial desde el servidor
  inStock: boolean        // Stock inicial desde el servidor
  dict: any               // Diccionario de traducciones
}

/**
 * Componente cliente que muestra precio, descuento, stock y botón dinámicos
 * 
 * Combina:
 * - Datos iniciales del servidor (props)
 * - Actualizaciones en tiempo real desde contexto global
 * 
 * Se usa en la página de detalle de producto para mantener la info fresca
 * sin necesidad de recargar la página completa
 */
export default function ProductRealtimeInfo({ id, price, discount = 0, inStock, dict }: Props) {
  // Obtener actualizaciones globales del contexto
  const { updates } = useProductUpdatesContext()

  /**
   * Mergear datos: si existe un update para este producto,
   * usar sus valores actualizados; si no, mantener originales
   * 
   * useMemo evita recalcular si id, price, etc. no cambian
   */
  const merged = useMemo(() => {
    const u = updates.find((x) => x.id === id)
    return {
      price: u?.price ?? price,
      discount: u?.discount ?? discount,
      inStock: u?.inStock ?? inStock,
    }
  }, [id, price, discount, inStock, updates])

  // Calcular precio final con descuento aplicado
  const finalPrice = merged.discount > 0 ? merged.price * (1 - merged.discount / 100) : merged.price

  return (
    <>
      {/* SECCIÓN PRECIO: muestra precio actual, original (si hay descuento) y porcentaje OFF */}
      <div className="flex items-center gap-4 mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        {merged.discount > 0 ? (
          // Con descuento: mostrar precio final, original tachado, y badge %
          <>
            <span className="text-4xl font-bold text-blue-600">€{finalPrice.toFixed(2)}</span>
            <span className="text-xl line-through text-slate-400 font-medium">€{merged.price.toFixed(2)}</span>
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              -{Math.round(merged.discount)}%
            </span>
          </>
        ) : (
          // Sin descuento: solo mostrar precio actual
          <span className="text-4xl font-bold text-blue-600">€{merged.price.toFixed(2)}</span>
        )}
      </div>

      {/* SECCIÓN DISPONIBILIDAD + BOTÓN: dinámicos según stock actual */}
      <div className="flex flex-row items-center gap-4 mb-6">
        {/* Badge de disponibilidad: verde si hay stock, rojo si agotado */}
        <span
          className={`flex items-center px-2.5 py-2 w-fit rounded-md text-sm font-bold ${
            merged.inStock
              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
              : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
          }`}
        >
          {merged.inStock ? dict.products.inStock || "En stock" : dict.products.outOfStock || "Agotado"}
        </span>

        {/* Botón "Agregar al carrito": disabled automáticamente si agotado */}
        <div className="flex-1">
          <AddToCartButton
            inStock={merged.inStock}
            product={{ id }}
            addToCartText={dict.products.add || "Agregar"}
          />
        </div>
      </div>
    </>
  )
}
