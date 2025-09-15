import React, { JSX } from "react";
import Link from "next/link";
import AddToCartButton from "./add-tocart-button";
import { Product } from "../../data/products";
import Spanish from "../atoms/flags/spanish";
import English from "../atoms/flags/english";
import Japanese from "../atoms/flags/japanese";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = false }) => {
  const LanguageFlag: Record<string, JSX.Element> = {
    es: <Spanish className="w-7 h-7 rounded-full border" />,
    en: <English className="w-7 h-7 rounded-full border" />,
    jp: <Japanese className="w-7 h-7 rounded-full border" />,
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-t-lg cursor-pointer">
          <img
            src={`https://directus-tcg-shop.onrender.com/assets/${product.image || "placeholder.svg"}`}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute top-2 left-2 flex flex-col items-end gap-1">
            {product.discount! > 0 && (
              <span className="inline-flex items-center justify-center rounded-full w-14.5 border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                -{Math.round(product.discount!)}%
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {product.language && (
              <span className="inline-flex items-center justify-center rounded-full p-1">
                {LanguageFlag[product.language]}
              </span>
            )}
          </div>

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Agotado
              </span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/productos/${product.slug}`} className="block cursor-pointer">
          <h4 className="text-lg text-black font-semibold mb-2 hover:text-blue-600">{product.name}</h4>
        </Link>
        
        {product.description && (
          <Link href={`/productos/${product.slug}`} className="block cursor-pointer">
            <p className="text-sm text-gray-600 mb-3 hover:text-blue-600">{product.description}</p>
          </Link>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <Link href={`/productos/${product.slug}`} className="cursor-pointer">
            <div className="flex items-center gap-2">
              {product.discount ? (
                <>
                  <span className="text-2xl font-bold text-blue-600">
                    €{(product.price * (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    €{product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  €{product.price.toFixed(2)}
                </span>
              )}
            </div>
          </Link>
          
          <AddToCartButton
            inStock={product.inStock}
            product={{
              id: product.id.toString(),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;