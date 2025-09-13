"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../atoms/provider/cart-context";
import { createClient } from '@supabase/supabase-js';
import { SignInButton, useUser, useAuth } from "@clerk/nextjs";

interface CartButtonProps {
  label?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  in_stock: boolean;
}

interface CartItem {
  id: string;
  quantity: number;
}

interface CartProduct extends Product {
  quantity: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json'
    }
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Función optimizada para obtener datos actualizados de productos
async function fetchUpdatedProductData(productIds: string[]): Promise<Product[]> {
  if (productIds.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, discount, in_stock')
      .in('id', productIds);

    if (error) {
      console.error('Error fetching product data:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching product data:', error);
    return [];
  }
}

const CartButton: React.FC<CartButtonProps> = ({ label = "Carrito" }) => {
  const { cart, addToCart, removeFromCart, totalItems, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  
  const { isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();

  // Referencias para controlar el polling
  const isMountedRef = useRef(true);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTabVisibleRef = useRef(true);

  // Función para actualizar datos de productos del carrito
  const updateProductData = async () => {
    if (cart.length === 0) {
      setProducts([]);
      return;
    }
    
    const productIds = cart.map(item => item.id);
    const productData = await fetchUpdatedProductData(productIds);
    
    const updatedProducts: CartProduct[] = cart.map(item => {
      const productInfo = productData.find(p => p.id === item.id);
      return {
        id: item.id,
        name: productInfo?.name || 'Producto no disponible',
        price: productInfo?.price || 0,
        discount: productInfo?.discount || 0,
        in_stock: productInfo?.in_stock || false,
        quantity: item.quantity
      };
    });
    
    setProducts(updatedProducts);
    setLastUpdate(Date.now());
  };

  // Efecto para polling inteligente cuando el carrito está abierto
  useEffect(() => {
    isMountedRef.current = true;
    isTabVisibleRef.current = document.visibilityState === 'visible';

    const handleVisibilityChange = () => {
      isTabVisibleRef.current = document.visibilityState === 'visible';
      if (isTabVisibleRef.current && open && cart.length > 0) {
        // Actualizar inmediatamente cuando la pestaña se vuelve visible
        updateProductData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (open && cart.length > 0) {
      // Polling adaptativo: más frecuente cuando la pestaña está visible
      const startPolling = () => {
        if (!isMountedRef.current || !open) return;

        const interval = isTabVisibleRef.current ? 15000 : 30000; // 15s visible, 30s oculta
        
        updateIntervalRef.current = setTimeout(() => {
          if (isMountedRef.current && open && cart.length > 0) {
            updateProductData();
            startPolling(); // Continuar el polling
          }
        }, interval);
      };

      // Iniciar polling y actualizar inmediatamente
      updateProductData();
      startPolling();
    }

    return () => {
      isMountedRef.current = false;
      if (updateIntervalRef.current) {
        clearTimeout(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [open, cart.length]);

  // Actualizar datos cuando cambia el carrito
  useEffect(() => {
    updateProductData();
  }, [cart]);

  // Sincronización de usuario con Supabase (mantenido igual)
  useEffect(() => {
    const syncUserWithSupabase = async () => {
      if (isSignedIn && clerkUser) {
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              clerk_id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress,
              full_name: clerkUser.fullName,
              avatar_url: clerkUser.imageUrl,
              updated_at: new Date().toISOString()
            }, { 
              onConflict: 'clerk_id'
            });

          if (profileError && profileError.code !== '42501') {
            console.error('Error creating profile:', profileError);
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    };

    syncUserWithSupabase();
  }, [isSignedIn, clerkUser]);

  const handleDecreaseQuantity = (item: CartProduct) => {
    if (item.quantity === 1) {
      removeFromCart(item.id);
    } else {
      addToCart({ id: item.id, quantity: -1 });
    }
  };

  // Funciones de carga/guardado del carrito (mantenidas igual)
  const loadCartFromSupabase = async () => {
    if (!clerkUser?.id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_carts')
        .select('cart_data')
        .eq('clerk_id', clerkUser.id)
        .single();

      if (error && error.code !== 'PGRST116' && error.code !== '42P17') {
        console.error('Error loading cart:', error);
        return;
      }
      
      if (data?.cart_data) {
        clearCart();
        data.cart_data.forEach((item: CartItem) => addToCart(item));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToSupabase = async () => {
    if (!clerkUser?.id) return;
    
    try {
      const validCart = cart.filter(item => item.quantity > 0);
      const { error } = await supabase
        .from('user_carts')
        .upsert({
          clerk_id: clerkUser.id,
          cart_data: validCart,
          updated_at: new Date().toISOString(),
        }, { 
          onConflict: 'clerk_id'
        });

      if (error) {
        console.error('Error saving cart:', error);
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const clearCartFromSupabase = async () => {
    if (!clerkUser?.id) return;
    
    try {
      const { error } = await supabase
        .from('user_carts')
        .delete()
        .eq('clerk_id', clerkUser.id);

      if (error && error.code !== '42P17') {
        console.error('Error clearing cart:', error);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Sincronización del carrito con Supabase (mantenida igual)
  useEffect(() => {
    if (!clerkUser?.id) return;

    const handleCartSync = async () => {
      if (cart.length > 0) {
        await saveCartToSupabase();
      } else {
        await clearCartFromSupabase();
      }
    };

    const timeoutId = setTimeout(handleCartSync, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart, clerkUser?.id]);

  useEffect(() => {
    if (clerkUser?.id) {
      loadCartFromSupabase();
    }
  }, [clerkUser?.id]);

  const handleClearCart = () => {
    clearCart();
    if (clerkUser?.id) clearCartFromSupabase();
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      setOpen(false);
      return;
    }
    
    setLoading(true);
    alert("Redirigiendo a la pasarela de pago...");
    clearCart();
    if (clerkUser?.id) await clearCartFromSupabase();
    setLoading(false);
    setOpen(false);
  };

  // Calcular total actualizado
  const total = products
    .filter(item => item.quantity > 0)
    .reduce(
      (total, item) => total + item.quantity * (item.price * (1 - item.discount / 100)),
      0
    )
    .toFixed(2);

  return (
    <div className="relative inline-block text-left text-black">
      {!isSignedIn ? (
        <SignInButton mode="modal">
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 relative"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            </svg>
            {label}
          </button>
        </SignInButton>
      ) : (
        <button
          onClick={() => setOpen(!open)}
          disabled={loading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 h-9 px-3 relative"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
          {label}
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
              {totalItems}
            </span>
          )}
        </button>
      )}

      {open && isSignedIn && (
        <div className="absolute -left-40 mt-4 w-80 bg-white shadow-lg rounded-md p-4 z-50 border border-blue-600">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Tu carrito</h3>
          </div>

          {products.filter(item => item.quantity > 0).length === 0 ? (
            <p className="text-sm text-gray-500">No hay productos en el carrito.</p>
          ) : (
            <div className="space-y-3">
              {products.filter(item => item.quantity > 0).map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        €{(item.price * (1 - item.discount / 100)).toFixed(2)} x {item.quantity}
                      </p>
                      {!item.in_stock && (
                        <span className="text-xs text-red-500">Sin stock</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDecreaseQuantity(item)} className="px-2 bg-gray-200 rounded">-</button>
                    <span className="text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart({ id: item.id, quantity: 1 })} className="px-2 bg-gray-200 rounded">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">✕</button>
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t flex flex-col gap-2 text-black">
                <p className="text-sm font-medium">
                  Total: €{total}
                </p>
                
                <button onClick={handleClearCart} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md text-sm font-medium">
                  Vaciar carrito
                </button>
                
                <button onClick={handleCheckout} disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium disabled:opacity-50">
                  {loading ? "Procesando..." : "Ir a pagar"}
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