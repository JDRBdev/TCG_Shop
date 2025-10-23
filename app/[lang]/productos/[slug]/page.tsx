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
import Japanese from '@/app/components/atoms/flags/japanese';

interface Props {
  params: { slug: string; lang: string };
}

// 🧩 Generador de URLs públicas desde Supabase Storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const BUCKET_NAME = "directus_files"; // cambia si tu bucket se llama distinto

function getPublicImageUrl(imagePath?: string): string {
  if (!imagePath) return "/placeholder.svg"; // fallback local
  if (imagePath.startsWith("http")) return imagePath;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${imagePath}`;
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
    es: <Spanish className="w-5 h-5 rounded-full border" />,
    en: <English className="w-5 h-5 rounded-full border" />,
    jp: <Japanese className="w-5 h-5 rounded-full border" />,

  };

  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb - USANDO DICCIONARIO */}
        <nav className="text-sm mb-8 flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm w-fit">
          <a href={`/${lang}`} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
            {dict.header.nav.home || "Inicio"}
          </a>
          <span className="text-slate-400">/</span>
          <a href={`/${lang}/productos`} className="text-slate-600 hover:text-blue-600 transition-colors font-medium">
            {dict.header.nav.products || "Productos"}
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen del producto */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              <img
                src={`${getPublicImageUrl(product.image)}.avif`}
                alt={product.name}
                width={600}
                height={400}
                loading="lazy"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
              <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
              
              {/* Idioma */}
              {product.language && (
                <div className="flex items-center gap-3 mb-6 bg-slate-50 rounded-full px-4 py-2 w-fit">
                  {LanguageFlag[product.language]}
                  <span className="text-sm text-slate-700 font-medium">
                    {product.language.toUpperCase()} {dict.products.filters.language || "Language"}
                  </span>
                </div>
              )}

              {/* Precio */}
              <div className="flex items-center gap-4 mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                {product.discount > 0 ? (
                  <>
                    <span className="text-4xl font-bold text-blue-600">
                      €{finalPrice.toFixed(2)}
                    </span>
                    <span className="text-xl line-through text-slate-400 font-medium">
                      €{product.price.toFixed(2)}
                    </span>
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      -{Math.round(product.discount)}%
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-blue-600">
                    €{product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Disponibilidad - USANDO DICCIONARIO */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-5 py-2.5 rounded-full text-sm font-bold shadow-md ${
                  product.inStock 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                }`}>
                  {product.inStock 
                    ? dict.products.inStock || "En stock" 
                    : dict.products.outOfStock || "Agotado"}
                </span>
              </div>
            </div>

            {/* Descripción - USANDO DICCIONARIO */}
            {product.description && (
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200">
                <h3 className="text-xl font-bold mb-4 text-slate-900 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                  {dict.products.description || "Descripción"}
                </h3>
                <p className="text-slate-700 leading-relaxed text-base">{product.description}</p>
              </div>
            )}

            {/* Categoría y Marca - USANDO DICCIONARIO */}
            <div className="grid grid-cols-2 gap-4">
              {product.category && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {dict.products.filters.category || "Categoría"}
                  </span>
                  <span className="text-lg font-bold text-slate-900 capitalize">{product.category}</span>
                </div>
              )}
              {product.brand && (
                <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow">
                  <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {dict.products.filters.brand || "Marca"}
                  </span>
                  <span className="text-lg font-bold text-slate-900 capitalize">{product.brand}</span>
                </div>
              )}
            </div>

            {/* Botón de añadir al carrito */}
            <div className="pt-2">
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