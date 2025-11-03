"use client"

import { useMemo } from "react"
import { useProductUpdatesContext } from "@/app/components/atoms/provider/product-updates-context"
import AddToCartButton from "./add-tocart-button"

type Props = {
  id: string
  price: number
  discount?: number
  inStock: boolean
  dict: any
}

export default function ProductRealtimeInfo({ id, price, discount = 0, inStock, dict }: Props) {
  const { updates } = useProductUpdatesContext()
  const merged = useMemo(() => {
    const u = updates.find((x) => x.id === id)
    return {
      price: u?.price ?? price,
      discount: u?.discount ?? discount,
      inStock: u?.inStock ?? inStock,
    }
  }, [id, price, discount, inStock, updates])

  const finalPrice = merged.discount > 0 ? merged.price * (1 - merged.discount / 100) : merged.price

  return (
    <>
      {/* Precio */}
      <div className="flex items-center gap-4 mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        {merged.discount > 0 ? (
          <>
            <span className="text-4xl font-bold text-blue-600">€{finalPrice.toFixed(2)}</span>
            <span className="text-xl line-through text-slate-400 font-medium">€{merged.price.toFixed(2)}</span>
            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
              -{Math.round(merged.discount)}%
            </span>
          </>
        ) : (
          <span className="text-4xl font-bold text-blue-600">€{merged.price.toFixed(2)}</span>
        )}
      </div>

      {/* Disponibilidad y Botón */}
      <div className="flex flex-row items-center gap-4 mb-6">
        <span
          className={`flex items-center px-2.5 py-2 w-fit rounded-md text-sm font-bold ${
            merged.inStock
              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
              : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
          }`}
        >
          {merged.inStock ? dict.products.inStock || "En stock" : dict.products.outOfStock || "Agotado"}
        </span>

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
