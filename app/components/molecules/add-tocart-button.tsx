"use client";

import { SignUpButton, useUser } from "@clerk/nextjs";
import { useCart } from "../atoms/provider/cart-context"; // 👈 importa el hook, no el provider

interface AddToCartButtonProps {
  inStock: boolean;
  product: {
    id: string;
    name: string;
    price: number;
  };
}

export default function AddToCartButton({ inStock, product }: AddToCartButtonProps) {
  const { isSignedIn } = useUser();
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({ ...product, quantity: 1 });
  };

  const buttonClasses = `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 h-9 px-3 ${
    inStock
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`;

  const buttonContent = (
    <>
      <svg
        className="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        />
      </svg>
      {inStock ? "Agregar" : "Agotado"}
    </>
  );

  if (!inStock) {
    return <button className={buttonClasses} disabled>{buttonContent}</button>;
  }

  // 🔒 Usuario NO logueado → abre modal de Clerk
  if (!isSignedIn) {
    return (
      <SignUpButton mode="modal">
        <button className={buttonClasses}>{buttonContent}</button>
      </SignUpButton>
    );
  }

  // ✅ Usuario logueado → añade al carrito
  return (
    <button onClick={handleAdd} className={buttonClasses}>
      {buttonContent}
    </button>
  );
}
