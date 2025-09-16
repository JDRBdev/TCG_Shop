import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import AddToCartButton from '@/app/components/molecules/add-tocart-button';
import Spanish from '@/app/components/atoms/flags/spanish';
import English from '@/app/components/atoms/flags/english';
import French from '@/app/components/atoms/flags/french';
import Deutsch from '@/app/components/atoms/flags/deutsch';
import { JSX } from 'react';
import { getDictionary } from '../../dictionaries'; // Importar getDictionary

interface Props {
  params: { slug: string; lang: string };
}

// Función para obtener producto traducido
async function getTranslatedProduct(slug: string, locale: string) {
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

  try {
    console.log('Buscando producto traducido:', slug, 'para lang:', locale);
    
    // 1️⃣ Obtener el producto por slug
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (productError || !product) {
      console.error('Error al obtener producto:', productError);
      return null;
    }

    // 2️⃣ Obtener las relaciones de traducciones para este producto
    const { data: mappings, error: mappingsError } = await supabase
      .from('products_product_translations')
      .select('product_translations_id')
      .eq('products_id', product.id);

    if (mappingsError) {
      console.error('Error al obtener relaciones de traducciones:', mappingsError);
      return null;
    }

    const translationIds = mappings.map((m: any) => m.product_translations_id);

    // 3️⃣ Obtener la traducción específica para el locale
    const { data: translation, error: translationError } = await supabase
      .from('product_translations')
      .select('*')
      .in('id', translationIds)
      .eq('lang', locale)
      .single();

    if (translationError) {
      console.log('No se encontró traducción para', locale, 'usando datos originales');
    }

    // 4️⃣ Combinar producto con traducción
    return {
      id: product.id,
      name: translation?.name ?? product.name,
      description: translation?.description ?? product.description,
      price: Number(product.price) || 0,
      discount: Number(product.discount) || 0,
      inStock: product.in_stock,
      image: product.image,
      language: product.language,
      category: product.category,
      brand: product.brand,
      slug: product.slug,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };

  } catch (err) {
    console.error('Error inesperado al obtener producto traducido:', err);
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug, lang } = params;
  const product = await getTranslatedProduct(slug, lang);

  return {
    title: product ? `${product.name} - TCG Shop` : 'Producto no encontrado',
    description: product?.description || 'Detalles del producto',
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug, lang } = params;
  const product = await getTranslatedProduct(slug, lang);
  // Define un array constante con los idiomas soportados
  const supportedLangs = ["en", "es", "fr", "de"] as const;

  // Verifica si 'lang' está dentro de los idiomas soportados.
  // Si es así, lo usa; si no, por defecto usa "en" (inglés).
  const safeLang = supportedLangs.includes(lang as any) 
    ? (lang as typeof supportedLangs[number]) 
    : "es";

  // Obtiene el diccionario de traducciones correspondiente al idioma seguro seleccionado
  const dict = await getDictionary(safeLang) // es

  if (!product) {
    notFound();
  }

  // Debug
  console.log('Producto traducido:', product.name, 'para lang:', lang);

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
        {/* Breadcrumb - USANDO DICCIONARIO */}
        <nav className="text-sm text-gray-600 mb-6">
          <a href={`/${lang}`} className="hover:text-blue-600">
            {dict.header.nav.home || "Inicio"}
          </a>
          <span className="mx-2">/</span>
          <a href={`/${lang}/productos`} className="hover:text-blue-600">
            {dict.header.nav.products || "Productos"}
          </a>
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
                    {product.language.toUpperCase()} {dict.products.filters.language || "Language"}
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

              {/* Disponibilidad - USANDO DICCIONARIO */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock 
                    ? dict.products.inStock || "En stock" 
                    : dict.products.outOfStock || "Agotado"}
                </span>
              </div>
            </div>

            {/* Descripción - USANDO DICCIONARIO */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {dict.products.description || "Descripción"}
                </h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Categoría y Marca - USANDO DICCIONARIO */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.category && (
                <div>
                  <span className="font-semibold">
                    {dict.products.filters.category || "Categoría"}:
                  </span>
                  <span className="ml-2 text-gray-600 capitalize">{product.category}</span>
                </div>
              )}
              {product.brand && (
                <div>
                  <span className="font-semibold">
                    {dict.products.filters.brand || "Marca"}:
                  </span>
                  <span className="ml-2 text-gray-600 capitalize">{product.brand}</span>
                </div>
              )}
            </div>

            {/* Botón de añadir al carrito */}
            <div className="pt-4">
                <AddToCartButton
                    inStock={product.inStock}
                    product={{
                    id: product.id.toString(),
                    }}
                    addToCartText={dict.products.add || "Agregar"}
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

  const products = data || [];
  
  // Generar params para todos los idiomas y todos los productos
  const languages = ['es', 'en', 'fr', 'de'];
  const params = [];
  
  for (const product of products) {
    for (const lang of languages) {
      params.push({
        slug: product.slug,
        lang: lang
      });
    }
  }

  return params;
}