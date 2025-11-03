"use client"
import React, { JSX, useMemo } from "react";
import Link from "next/link";
import AddToCartButton from "./add-tocart-button";
import { Product } from "../../data/products";
import Spanish from "../atoms/flags/spanish";
import English from "../atoms/flags/english";
import Japanese from "../atoms/flags/japanese";
import { useProductUpdatesContext } from "@/app/components/atoms/provider/product-updates-context";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  dict: any;
  lang: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = false, dict, lang }) => {
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

  // Mapeo de idiomas a componentes de banderas
  const LanguageFlag: Record<string, JSX.Element> = {
    es: <Spanish className="w-7 h-7 rounded-full border" />,
    en: <English className="w-7 h-7 rounded-full border" />,
    jp: <Japanese className="w-7 h-7 rounded-full border" />,
  };

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-lg group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      {/* Link a detalle usando slug del producto mergeado */}
      <Link href={`/${lang}/productos/${merged.slug}`} className="block">
        <div className="relative overflow-hidden cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          <img
            src={`${merged.image || "placeholder.svg"}`}
            alt={merged.name}
            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badge descuento (solo si discount > 0) */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-20">
            {merged.discount! > 0 && (
              <span className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg border-2 border-white">
                -{Math.round(merged.discount!)}% OFF
              </span>
            )}
          </div>

          {/* Bandera del idioma en esquina derecha */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-20">
            {merged.language && (
              <span className="inline-flex items-center justify-center rounded-full shadow-lg border-2 border-slate-200">
                {LanguageFlag[merged.language]}
              </span>
            )}
          </div>

          {/* Overlay "Agotado" si no hay stock */}
          {!merged.inStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
              <span className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold shadow-xl border-2 border-slate-200">
                {dict.products.outOfStock || "Agotado"}
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-5">
        {/* Título del producto */}
        <Link href={`/${lang}/productos/${merged.slug}`} className="block cursor-pointer">
          <h4 className="text-lg text-slate-900 font-bold mb-3 hover:text-blue-600 transition-colors min-h-[56px] line-clamp-2 leading-tight">
            {merged.name}
          </h4>
        </Link>
        
        {/* Footer: precio + botón */}
        <div className="flex items-center justify-between mb-4">
          <Link href={`/${lang}/productos/${merged.slug}`} className="cursor-pointer">
            <div className="flex items-center gap-3">
              {merged.discount ? (
                <>
                  {/* Mostrar precio final con descuento aplicado */}
                  <span className="text-2xl font-bold text-blue-600">
                    €{(merged.price * (1 - (merged.discount || 0) / 100)).toFixed(2)}
                  </span>
                  {/* Precio original tachado */}
                  <span className="text-sm line-through text-slate-400 font-medium">
                    €{merged.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  €{merged.price.toFixed(2)}
                </span>
              )}
            </div>
          </Link>
          
          {/* Botón agregar al carrito - disabled si agotado */}
          <AddToCartButton
            inStock={merged.inStock}
            product={{
              id: merged.id.toString(),
            }}
            addToCartText={dict.products.add || "Agregar"}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;