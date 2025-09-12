import React, { JSX } from "react";
import AddToCartButton from "./add-tocart-button";
import { Product } from "../../data/products";
import Spanish from "../atoms/flags/spanish";
import English from "../atoms/flags/english";
import French from "../atoms/flags/french";
import Deutsch from "../atoms/flags/deutsch";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean; // opcional, por ejemplo “Nuevo” o “Oferta”
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = false }) => {
  // Mapeo idioma -> componente bandera
  const LanguageFlag: Record<string, JSX.Element> = {
    es: <Spanish className="w-7 h-7 rounded-full border" />,
    en: <English className="w-7 h-7 rounded-full border" />,
    fr: <French className="w-7 h-7 rounded-full border" />,
    de: <Deutsch className="w-7 h-7 rounded-full border" />,
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={`https://directus-tcg-shop.onrender.com/assets/${product.image || "placeholder.svg"}`}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges container */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {showBadge && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border-emerald-200">
              Nuevo
            </span>
          )}

          {product.discount && product.discount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full w-14.5 border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
              -{Math.round(product.discount)}%
            </span>
          )}

          {/* 👇 Bandera del idioma */}
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
      <div className="p-4">
        <h4 className="text-lg text-black font-semibold mb-2">{product.name}</h4>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        )}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Precio final con descuento */}
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
          <AddToCartButton
            inStock={product.inStock}
            product={{
              id: product.id.toString(),
              name: product.name,
              price: product.price,
              discount: product.discount || 0,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;