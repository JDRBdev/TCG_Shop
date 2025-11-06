"use client"
import React, { useMemo } from "react";
import Link from "next/link";
import { Product } from "../../data/products";
import { useProductUpdatesContext } from "@/app/components/atoms/provider/product-updates-context";

interface ProductCardProps {
  product: Product;
  lang?: string;
  quantity?: number;
  showQuantity?: boolean;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

const CartProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  quantity,
  showQuantity = false,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  // Traer actualizaciones en tiempo real desde el contexto global
  const { updates } = useProductUpdatesContext()
  
  /**
   * Mergear producto original con datos actualizados:
   * - Si hay update para este producto ID: usar sus valores (price, discount, inStock)
   * - Si no hay update: mantener valores originales
   * 
   * useMemo: evita recalcular si product y updates no cambian
   */
  const merged = useMemo(() => {
    const u = updates.find((x) => x.id === product.id)
    if (!u) return product
    return {
      ...product,
      price: u.price ?? product.price,
      discount: u.discount ?? product.discount,
      inStock: u.inStock ?? product.inStock,
    }
  }, [product, updates])

    const safeLang = lang ?? 'es';

    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-slate-100">
        <Link href={`/${lang}/productos/${merged.slug}`} className="flex-shrink-0">
          <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
            <img
              src={merged.image || "/placeholder.svg"}
              alt={merged.name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <Link href={`/${safeLang}/productos/${merged.slug}`} className="block">
            <p className="text-sm font-medium text-slate-900 truncate hover:text-blue-600 transition-colors">{merged.name}</p>
          </Link>

          <div className="flex items-center gap-2 mt-1">
            {merged.discount ? (
              <>
                <span className="text-sm font-semibold text-emerald-600">€{(merged.price * (1 - (merged.discount || 0) / 100)).toFixed(2)}</span>
                <span className="text-xs line-through text-slate-400">€{merged.price.toFixed(2)}</span>
                <span className="text-xs ml-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">-{merged.discount}%</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-900">€{merged.price.toFixed(2)}</span>
            )}
          </div>

        </div>

        {showQuantity && typeof quantity === 'number' && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button onClick={onDecrease} aria-label="Disminuir" className="w-7 h-7 flex items-center justify-center bg-white rounded text-lg shadow-sm">−</button>
              <span className="text-sm w-6 text-center">{quantity}</span>
              <button onClick={onIncrease} aria-label="Aumentar" className="w-7 h-7 flex items-center justify-center bg-white rounded text-lg shadow-sm">+</button>
            </div>
            <button onClick={onRemove} aria-label="Eliminar" className="text-gray-500 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    );
};

export default CartProductCard;