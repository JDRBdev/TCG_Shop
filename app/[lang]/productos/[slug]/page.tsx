import { notFound } from 'next/navigation';
import { fetchProductVariants, fetchBaseProducts, supabase } from '@/app/data/products';
import ProductRealtimeInfo from '@/app/components/molecules/product-realtime-info';
import Spanish from '@/app/components/atoms/flags/spanish';
import English from '@/app/components/atoms/flags/english';
import French from '@/app/components/atoms/flags/french';
import Deutsch from '@/app/components/atoms/flags/deutsch';
import Link from 'next/link';
import { JSX } from 'react';
import { getDictionary } from '../../../hooks/dictionaries'; // Importar getDictionary
import Japanese from '@/app/components/atoms/flags/japanese';

interface Props {
  params: { slug: string; lang: string };
  searchParams?: { [key: string]: string | string[] | undefined };
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
  // Reuse fetchBaseProducts which already resolves translations for a locale.
  const list = await fetchBaseProducts({ locale, modifyQuery: (q: any) => q.eq('slug', slug).limit(1) });
  return list[0] ?? null;
}

export async function generateMetadata({ params }: Props) {
  // `params` may be a promise in Next.js dynamic APIs — await it before use
  const { slug, lang } = await params as any;
  const product = await getTranslatedProduct(slug, lang);

  // If product has an image, make an absolute URL to include in OG metadata.
  const imageUrl = product ? getPublicImageUrl((product as any).image) : undefined;

  return {
    title: product ? `${product.name} - TCG Shop` : 'Producto no encontrado',
    description: product?.description || 'Detalles del producto',
    openGraph: product
      ? {
          title: `${product.name} — TCG Shop`,
          description: product.description || undefined,
          images: imageUrl ? [{ url: imageUrl, alt: product.name }] : undefined,
        }
      : undefined,
    twitter: product
      ? {
          card: 'summary_large_image',
          title: product.name,
          description: product.description || undefined,
          images: imageUrl ? [imageUrl] : undefined,
        }
      : undefined,
  };
}

export default async function ProductDetailPage({ params, searchParams }: Props) {
  // `params` may be a promise — await it before using its properties
  const { slug, lang } = await params as any;

  // `searchParams` may be a promise in Next.js dynamic APIs — await it before use
  const resolvedSearchParams = searchParams ? (searchParams instanceof Promise ? await searchParams : searchParams) : {};

  // If a query param 'variant' or 'variant_lang' is present, use it to fetch the product translation
  const variantParam = Array.isArray(resolvedSearchParams.variant)
    ? resolvedSearchParams.variant[0]
    : (resolvedSearchParams.variant as string | undefined) ||
      (Array.isArray(resolvedSearchParams.variant_lang) ? resolvedSearchParams.variant_lang[0] : (resolvedSearchParams.variant_lang as string | undefined));

  // Determine which locale to use when fetching the translated product
  const translationLocale = variantParam || lang;

  const product = await getTranslatedProduct(slug, translationLocale);
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

  // Use centralized helper that reuses the same Supabase client logic
  // Pass translationIds from getTranslatedProduct to avoid re-querying mappings
  const translationIds = (product as any).translationIds ?? [];
  const relatedProducts = await fetchProductVariants(product.id, translationIds);

  // Debug
  console.log('Producto traducido:', product.name, 'para lang:', lang);

  const LanguageFlag: Record<string, JSX.Element> = {
    es: <Spanish className="w-5 h-5 rounded-full border" />,
    en: <English className="w-5 h-5 rounded-full border" />,
    fr: <French className="w-5 h-5 rounded-full border" />,
    de: <Deutsch className="w-5 h-5 rounded-full border" />,
    jp: <Japanese className="w-5 h-5 rounded-full border" />,

  };

  

  // Productos recomendados: tomar hasta 50 candidatos traducidos y seleccionar 4 aleatorios (excluyendo el actual)
  function shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const candidates = await fetchBaseProducts({ locale: safeLang, limit: 50 });
  const filtered = (candidates || []).filter((p) => String(p.id) !== String(product.id));
  const recommended = shuffle(filtered).slice(0, 4);

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
          <div className="relative group h-full">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
              <img
                src={getPublicImageUrl(product.image)}
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

 
                {relatedProducts && relatedProducts.length > 0 && (
                  <div className="mb-4">
                    <details className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
                      <summary className="font-medium cursor-pointer px-3 py-2 rounded-md flex items-center justify-between hover:bg-slate-50 transition">
                        <span className='text-slate-900'>Ver en otros idiomas</span>
                        <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </summary>
                      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 list-none">
                        {(relatedProducts || []).map((r) => {
                          const langCode = (r.language || 'es') as string;
                          const languageNames: Record<string, string> = {
                            es: 'Español',
                            en: 'English',
                            fr: 'Français',
                            de: 'Deutsch',
                            jp: '日本語'
                          };
                          const label = languageNames[langCode] || langCode;
                          const Flag = (LanguageFlag[langCode] as any) || <span className="w-6 h-6 inline-block" />;
                          return (
                            <li key={r.id}>
                              <Link
                                // Keep the current UI language in the path (safeLang) and compute the slug for the target language
                                href={`/${safeLang}/productos/${computeVariantSlug(product.slug, langCode, r.slug)}`}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors bg-white border border-slate-100 shadow-sm"
                              >
                                <span className="w-6 h-6 flex-shrink-0">{Flag}</span>
                                <div className="flex-1 text-left">
                                  <div className="text-sm font-medium text-slate-900">{label}</div>
                                  <div className="text-xs text-slate-500">{r.slug}</div>
                                </div>
                                <div className="text-xs text-slate-400">Abrir</div>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </div>
                )}

              {/* Precio, stock y CTA dinámicos con contexto global */}
              <ProductRealtimeInfo
                id={product.id.toString()}
                price={product.price}
                discount={product.discount}
                inStock={product.inStock}
                dict={dict}
              />
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
            <div className="grid sm:grid-cols-2 gap-4">
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

          </div>
        </div>
          {/* Productos recomendados */}
            {recommended && recommended.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-slate-900">{dict.products.recommend || 'Productos Recomendados'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommended.map((p) => {
                    const pDiscount = Number((p as any).discount) || 0;
                    const pPrice = Number((p as any).price) || 0;
                    const pFinal = pDiscount > 0 ? pPrice * (1 - pDiscount / 100) : pPrice;
                    return (
                      <Link key={p.id} href={`/${safeLang}/productos/${p.slug}`} className="flex flex-col justify-between bg-white rounded-xl p-3 border border-slate-100 shadow-sm hover:shadow-md">
                        <div className="w-full h-36 overflow-hidden rounded-md mb-3 bg-slate-50">
                          <img src={getPublicImageUrl((p as any).image)} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-sm font-medium text-slate-900">{p.name}</div>
                        <div className="text-sm text-slate-600">{p.category}</div>
                        <div className="mt-2 text-sm font-semibold text-slate-900">
                          {pDiscount > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-blue-600">€{pFinal.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span className='text-sm font-bold text-blue-600'>€{pPrice.toFixed(2)}</span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const { data } = await supabase.from('products').select('slug').not('slug', 'is', null);

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

// Construye un slug variante reemplazando el sufijo de idioma si existe
function computeVariantSlug(currentSlug: string | undefined, targetLang: string, fallbackSlug?: string) {
  if (!currentSlug && fallbackSlug) return `${fallbackSlug}-${targetLang}`;
  if (!currentSlug) return fallbackSlug || `product-${targetLang}`;

  // Detecta sufijo -en, -es, -fr, -de, -jp, -ja u otros de 2-3 letras
  const m = currentSlug.match(/^(.*?)-([a-z]{2,3})$/i);
  if (m) {
    const base = m[1];
    return `${base}-${targetLang}`;
  }

  // Si no hay sufijo, simplemente agregar el sufijo del idioma
  return `${currentSlug}-${targetLang}`;
}