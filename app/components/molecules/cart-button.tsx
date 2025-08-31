"use client";

import React, { useState } from "react";
import { useCart } from "../atoms/provider/cart-context";
import { useUser, SignUpButton } from "@clerk/nextjs";

interface CartButtonProps {
  label?: string;
}

const CartButton: React.FC<CartButtonProps> = ({ label = "Carrito" }) => {
  const { cart, addToCart, removeFromCart, totalItems } = useCart();
  const { isSignedIn } = useUser();
  const [open, setOpen] = useState(false);

  const handleCheckout = () => {
    alert("Redirigiendo a la pasarela de pago...");
  };

  const buttonBase = (
    <button
      onClick={() => setOpen(!open)}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors 
                focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 relative"
    >
      <svg
        className="w-4 h-4 mr-2"
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
      {label}
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
          {totalItems}
        </span>
      )}
    </button>
  );

  // Usuario no logueado → abrir modal Clerk
  if (!isSignedIn) {
    return <SignUpButton mode="modal">{buttonBase}</SignUpButton>;
  }

  return (
    <div className="relative inline-block text-left">
      {buttonBase}

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md p-4 z-50">
          <h3 className="text-sm font-semibold mb-2">Tu carrito</h3>

          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">No hay productos en el carrito.</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">${item.price}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        addToCart({ ...item, quantity: -1 })
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        addToCart({ ...item, quantity: 1 })
                      }
                      className="px-2 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  Ir a pagar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartButton;
