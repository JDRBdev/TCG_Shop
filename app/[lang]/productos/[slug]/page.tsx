import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import AddToCartButton from '@/app/components/molecules/add-tocart-button';
import Spanish from '@/app/components/atoms/flags/spanish';
import English from '@/app/components/atoms/flags/english';
import French from '@/app/components/atoms/flags/french';
import Deutsch from '@/app/components/atoms/flags/deutsch';
import { JSX } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: Number(data.price) || 0,
    discount: Number(data.discount) || 0,
    inStock: data.in_stock,
    image: data.image,
    language: data.language,
    category: data.category,
    brand: data.brand,
    slug: data.slug,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  return {
    title: product ? `${product.name} - TCG Shop` : 'Producto no encontrado',
    description: product?.description || 'Detalles del producto',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const LanguageFlag: Record<string, JSX.Element> = {
    es: <Spanish className="w-10 h-10 rounded-full border" />,
    en: <English className="w-10 h-10 rounded-full border" />,
    fr: <French className="w-10 h-10 rounded-full border" />,
    de: <Deutsch className="w-10 h-10 rounded-full border" />,
  };

  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-white text-black py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-blue-600">Inicio</a>
          <span className="mx-2">/</span>
          <a href="/productos" className="hover:text-blue-600">Productos</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="relative">
            <div className="rounded-lg border bg-white p-4">
              <Image
                src={`https://directus-tcg-shop.onrender.com/assets/${product.image || "placeholder.svg"}`}
                alt={product.name}
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Idioma */}
              {product.language && (
                <div className="flex items-center gap-2 mb-4">
                  {LanguageFlag[product.language]}
                  <span className="text-sm text-gray-600">
                    {product.language.toUpperCase()} Language
                  </span>
                </div>
              )}

              {/* Precio */}
              <div className="flex items-center gap-3 mb-4">
                {product.discount > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-blue-600">
                      €{finalPrice.toFixed(2)}
                    </span>
                    <span className="text-xl line-through text-gray-400">
                      €{product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold">
                      -{Math.round(product.discount)}%
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    €{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Disponibilidad */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'En stock' : 'Agotado'}
                </span>
              </div>
            </div>

            {/* Descripción */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Categoría y Marca */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.category && (
                <div>
                  <span className="font-semibold">Categoría:</span>
                  <span className="ml-2 text-gray-600 capitalize">{product.category}</span>
                </div>
              )}
              {product.brand && (
                <div>
                  <span className="font-semibold">Marca:</span>
                  <span className="ml-2 text-gray-600 capitalize">{product.brand}</span>
                </div>
              )}
            </div>

            {/* Botón de añadir al carrito */}
            <div className="pt-4">
                <AddToCartButton
                    inStock={product.inStock}
                    product={{
                    id: product.id.toString(), // Solo pasamos el ID
                    }}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        }
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );

  const { data } = await supabase
    .from('products')
    .select('slug')
    .not('slug', 'is', null);

  return (data || []).map((product) => ({
    slug: product.slug,
  }));
}