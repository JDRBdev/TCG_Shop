import React from "react";
import AddToCartButton from "./add-tocart-button";
import { Product } from "../../data/products";
import { getRarityColor } from "@/app/utils/get-rarity-colors";

interface ProductCardProps {
  product: Product;
  showBadge?: boolean; // opcional, por ejemplo “Nuevo” o “Oferta”
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showBadge = false }) => {
  return (
    <div className="rounded-lg border bg-white shadow-sm group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
            src={product.image || "/placeholder.svg"}
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
            {product.originalPrice && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                Oferta
            </span>
            )}
        </div>

        {product.rarity && (
            <span
            className={`absolute top-2 left-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRarityColor(product.rarity)}`}
            >
            {product.rarity}
            </span>
        )}

        {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Agotado
            </span>
            </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="text-lg font-semibold mb-2">{product.name}</h4>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        )}
        <div className="flex items-center mb-3">
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
          <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm line-through text-gray-400">${product.originalPrice}</span>
            )}
          </div>
          <AddToCartButton
            inStock={product.inStock}
            product={{
              id: product.id.toString(),
              name: product.name,
              price: product.price,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
