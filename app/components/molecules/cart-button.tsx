"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../atoms/provider/cart-context";
import CheckoutButton from "./checkout-button";
import { createClient } from '@supabase/supabase-js';
import { SignInButton, useUser, useAuth } from "@clerk/nextjs";
import CartProductCard from "./cart-product-card";

interface CartButtonProps {
  label?: string;
}

interface Product {
  id: string;
  name: string;
  slug?: string;
  price: number;
  discount: number;
  in_stock: boolean;
  image?: string;
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
      .select('id, name, slug, price, discount, in_stock, image')
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
  const [isClient, setIsClient] = useState(false);
  
  const { isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();

  // Referencias para controlar el polling
  const isMountedRef = useRef(true);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTabVisibleRef = useRef(true);
  const cartRef = useRef<HTMLDivElement>(null);

  // Detectar cuando estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cerrar el carrito al hacer clic fuera de él
  useEffect(() => {
    if (!isClient) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      // Deshabilitar scroll del body cuando el carrito está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [open, isClient]);

  // Función para actualizar datos de productos del carrito
  const updateProductData = async () => {
    if (cart.length === 0) {
      // Avoid setting a new empty array on every call (causes re-renders)
      if (products.length !== 0) setProducts([]);
      return;
    }
    
    const productIds = cart.map(item => item.id);
    const productData = await fetchUpdatedProductData(productIds);
    
    const updatedProducts: CartProduct[] = cart.map(item => {
      const productInfo = productData.find(p => p.id === item.id);

      // Build a safe image URL:
      // - If productInfo.image is a full URL (http) or starts with '/', prefer it (we'll prefix origin later when sending to Stripe)
      // - If it's an id/reference, build Supabase public URL
      // - Fallback to placeholder
      let imageUrl = undefined as string | undefined;
      const rawImg = productInfo?.image;
      if (rawImg) {
        if (typeof rawImg === 'string' && (rawImg.startsWith('http') || rawImg.startsWith('/'))) {
          imageUrl = rawImg;
        } else {
          imageUrl = `${supabaseUrl}/storage/v1/object/public/directus_files/${rawImg}.avif`;
        }
      }

      return {
        id: item.id,
        name: productInfo?.name || 'Producto no disponible',
        slug: productInfo?.slug,
        price: productInfo?.price || 0,
        discount: productInfo?.discount || 0,
        in_stock: productInfo?.in_stock || false,
        image: imageUrl ?? '/placeholder.svg',
        quantity: item.quantity
      };
    });
    
    // Only update state when there is an actual change to avoid render loops
    const areEqual = (a: CartProduct[], b: CartProduct[]) => {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        const x = a[i];
        const y = b[i];
        if (
          x.id !== y.id ||
          x.quantity !== y.quantity ||
          x.price !== y.price ||
          x.discount !== y.discount ||
          x.in_stock !== y.in_stock ||
          x.image !== y.image ||
          x.name !== y.name
        ) return false;
      }
      return true;
    };

    if (!areEqual(products, updatedProducts)) {
      setProducts(updatedProducts);
      setLastUpdate(Date.now());
    }
  };

  // Efecto para polling inteligente cuando el carrito está abierto
  useEffect(() => {
    if (!isClient) return;
    
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
  }, [open, cart.length, isClient]);

  // Actualizar datos cuando cambia el carrito
  useEffect(() => {
    if (!isClient) return;
    updateProductData();
  }, [cart, isClient]);

  // Sincronización de usuario con Supabase (mantenido igual)
  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isSignedIn, clerkUser, isClient]);

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
    if (!clerkUser?.id || !isClient) return;

    const handleCartSync = async () => {
      if (cart.length > 0) {
        await saveCartToSupabase();
      } else {
        await clearCartFromSupabase();
      }
    };

    const timeoutId = setTimeout(handleCartSync, 1000);
    return () => clearTimeout(timeoutId);
  }, [cart, clerkUser?.id, isClient]);

  useEffect(() => {
    if (clerkUser?.id && isClient) {
      loadCartFromSupabase();
    }
  }, [clerkUser?.id, isClient]);

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
    // fallback: open CheckoutButton by leaving the aside open — but we clear cart on success via webhook
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

      {/* Overlay de fondo - solo en cliente */}
      {isClient && open && (
        <div className="fixed inset-0 bg-opacity-50 z-40 transition-opacity duration-300"></div>
      )}

      {/* Aside del carrito - solo en cliente */}
      {isClient && (
        <div
          ref={cartRef}
          className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header del carrito */}
            <div className="flex justify-between items-center p-4 pb-6 border-b">
              <h2 className="text-lg font-semibold">Tu carrito</h2>
              <button 
                onClick={() => setOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del carrito */}
            <div className="flex-1 overflow-y-auto p-4">
              {products.filter(item => item.quantity > 0).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h7M9.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                  <p className="text-gray-500">No hay productos en el carrito.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.filter(item => item.quantity > 0).map((item) => (
                    <CartProductCard
                      key={item.id}
                      product={item as any}
                      quantity={item.quantity}
                      showQuantity
                      onIncrease={() => addToCart({ id: item.id, quantity: 1 })}
                      onDecrease={() => handleDecreaseQuantity(item)}
                      onRemove={() => removeFromCart(item.id)}
                      onProductClick={() => setOpen(false)}
                      lang={'es'}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer del carrito */}
            {products.filter(item => item.quantity > 0).length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-semibold">€{total}</span>
                </div>
                
                <div className="space-y-2">
                  <button 
                    onClick={handleClearCart} 
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md text-sm font-medium transition-colors"
                  >
                    Vaciar carrito
                  </button>

                  {/* CheckoutButton: envía los items actuales al endpoint de Stripe y redirige */}
                  <CheckoutButton
                    items={products.filter(item => item.quantity > 0).map(item => ({
                      id: item.id,
                      name: item.name,
                      price: Number((item.price * (1 - (item.discount ?? 0) / 100)).toFixed(2)),
                      quantity: item.quantity,
                      currency: 'eur',
                      image: item.image ? (item.image.startsWith('/') ? `${window.location.origin}${item.image}` : item.image) : undefined
                    }))}
                    clerkId={clerkUser?.id}
                    label={isSignedIn ? (loading ? 'Procesando...' : 'Ir a pagar') : 'Inicia sesión para pagar'}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartButton;