"use client";

import React, { useState, useEffect } from "react";
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
  quantity: number;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}

// ✅ CORRECCIÓN: Inicialización de Supabase con headers correctos
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

const CartButton: React.FC<CartButtonProps> = ({ label = "Carrito" }) => {
  const { cart, addToCart, removeFromCart, totalItems, clearCart } = useCart();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  
  const { isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const syncUserWithSupabase = async () => {
      if (isSignedIn && clerkUser) {
        try {
          console.log('Syncing user with Supabase:', clerkUser.id);
          
          // 1. Asegurar que el perfil existe en Supabase
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

          if (profileError) {
            if (profileError.code === '42501') {
              console.warn('RLS policy error - continuing anyway');
            } else {
              console.error('Error creating profile:', profileError);
            }
          } else {
            console.log('Profile upserted successfully');
          }

          // 2. Establecer el usuario como el clerk_id
          setSupabaseUser({ id: clerkUser.id });
          console.log('Supabase user set successfully');

        } catch (error) {
          console.error('Error syncing user:', error);
          setSupabaseUser({ id: clerkUser.id });
        }
      } else {
        console.log('User signed out');
        setSupabaseUser(null);
      }
    };

    syncUserWithSupabase();
  }, [isSignedIn, clerkUser]);

  const handleDecreaseQuantity = (item: Product) => {
    if (item.quantity === 1) {
      removeFromCart(item.id);
    } else {
      addToCart({ ...item, quantity: -1 });
    }
  };

  const loadCartFromSupabase = async () => {
    if (!clerkUser?.id) {
      console.log('No clerk user ID, skipping cart load');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Loading cart from Supabase for user:', clerkUser.id);
      
      const { data, error } = await supabase
        .from('user_carts')
        .select('cart_data')
        .eq('clerk_id', clerkUser.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No cart found for user');
        } else if (error.code === '42P17') {
          console.warn('RLS recursion error - skipping cart load');
        } else {
          console.error('Error loading cart:', error);
          console.error('Error details:', error.details);
        }
        return;
      }
      
      if (data?.cart_data) {
        console.log('Cart loaded successfully');
        clearCart();
        data.cart_data.forEach((item: Product) => addToCart(item));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCartToSupabase = async () => {
    if (!clerkUser?.id) {
      console.log('No clerk user ID, skipping cart save');
      return;
    }
    
    try {
      const validCart = cart.filter(item => item.quantity > 0);
      console.log('Saving cart to Supabase for user:', clerkUser.id);
      
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
      } else {
        console.log('Cart saved successfully');
      }
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const clearCartFromSupabase = async () => {
    if (!clerkUser?.id) return;
    
    try {
      console.log('Clearing cart from Supabase for user:', clerkUser.id);
      const { error } = await supabase
        .from('user_carts')
        .delete()
        .eq('clerk_id', clerkUser.id);

      if (error && error.code === '42P17') {
        console.warn('RLS recursion error - skipping cart clear');
      } else if (error) {
        console.error('Error clearing cart:', error);
      } else {
        console.log('Cart cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    if (!clerkUser?.id) return;

    const handleCartSync = async () => {
      console.log('Syncing cart with Supabase...');
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
      console.log('User changed, loading cart:', clerkUser.id);
      loadCartFromSupabase();
    }
  }, [clerkUser?.id]);

  const handleClearCart = () => {
    console.log('Clearing cart manually');
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
          <h3 className="text-sm font-semibold mb-2">Tu carrito</h3>

          {cart.filter(item => item.quantity > 0).length === 0 ? (
            <p className="text-sm text-gray-500">No hay productos en el carrito.</p>
          ) : (
            <div className="space-y-3">
              {cart.filter(item => item.quantity > 0).map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">${item.price} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDecreaseQuantity(item)} className="px-2 bg-gray-200 rounded">-</button>
                    <span className="text-sm">{item.quantity}</span>
                    <button onClick={() => addToCart({ ...item, quantity: 1 })} className="px-2 bg-gray-200 rounded">+</button>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs">✕</button>
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t flex flex-col gap-2 text-black">
                <p className="text-sm font-medium">
                  Total: ${cart
                    .filter(item => item.quantity > 0)
                    .reduce((total, item) => total + (item.price * item.quantity), 0)
                    .toFixed(2)}
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