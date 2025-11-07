"use client"

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

// Cambiamos la interfaz para no almacenar precios en el carrito
interface CartItem {
  id: string;
  quantity: number;
}

// Nueva interfaz para productos con precios actualizados
interface ProductWithPrice {
  id: string;
  name: string;
  price: number;
  discount: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + product.quantity } : p
        );
      }
      return [...prev, product];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totalItems = cart.reduce((sum, p) => sum + p.quantity, 0);

  const value = useMemo(() => ({ cart, addToCart, removeFromCart, clearCart, totalItems }), [cart, addToCart, removeFromCart, clearCart, totalItems]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};