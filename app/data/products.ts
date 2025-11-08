import { createClient } from "@supabase/supabase-js";

export interface Product {
  id: string;
  name: string;
  slug?: string;
  category?: "booster" | "deck" | "single" | "set" | "accessory";
  brand?: string;
  price: number;
  discount?: number;
  inStock: boolean;
  description: string;
  image: string;
  language?: "es" | "en" | "fr" | "de";
  createdAt?: string;
  updatedAt?: string;
  timeLeft?: string;
}

// Inicializa Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey!);

const BUCKET_NAME = "directus_files";

function getPublicImageUrl(imageId: string | null): string {
  if (!imageId) return "/placeholder.svg";
  if (imageId.startsWith("http")) return imageId;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${imageId}.avif`;
}

// ===========================================================
// 🔧 FUNCIÓN BASE GENÉRICA
// ===========================================================

interface FetchOptions {
  locale: string;
  filters?: Record<string, any>;
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  offset?: number;
  // Permite al llamador ajustar la query base (p. ej. añadir where/not/gt/order)
  modifyQuery?: (query: any) => any;
}

export async function fetchBaseProducts({
  locale,
  filters,
  orderBy,
  ascending = true,
  limit = 0,
  offset,
  modifyQuery,
}: FetchOptions): Promise<Product[]> {
  try {
    // Base query
    let query = supabase.from("products").select("*");

    // Filtros dinámicos
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        // Si el valor es un array usamos `in`, si no `eq`.
        if (Array.isArray(value)) {
          query = query.in(key, value as any[]);
        } else {
          query = query.eq(key, value);
        }
      }
    }

    // Permite al llamador ajustar la query base
    if (modifyQuery) query = modifyQuery(query);

    // Orden y límite (se pueden usar también dentro de modifyQuery si se prefiere)
    if (orderBy) query = query.order(orderBy, { ascending });
    // Si se proporciona offset y limit, usamos range para obtener un slice exacto
    if (typeof limit === "number" && limit > 0 && typeof offset === "number" && offset >= 0) {
      const start = offset;
      const end = offset + limit - 1;
      query = query.range(start, end);
    } else if (typeof limit === "number" && limit > 0) {
      query = query.limit(limit);
    }
    // Si limit === 0 o undefined, no aplicamos límite (traemos todos)

    const { data: products, error } = await query;
    if (error || !products) {
      console.error("Error al obtener productos:", error);
      return [];
    }

    if (!products.length) return [];

    const productIds = products.map((p) => p.id);

    // Relaciones producto ↔ traducción
    const { data: mappings, error: mappingsError } = await supabase
      .from("products_product_translations")
      .select("products_id, product_translations_id")
      .in("products_id", productIds);

    if (mappingsError) {
      console.error("Error en mappings:", mappingsError);
      return [];
    }

    const translationIds = mappings.map((m) => m.product_translations_id);

    const { data: translations, error: translationsError } = await supabase
      .from("product_translations")
      .select("*")
      .in("id", translationIds)
      .eq("lang", locale);

    if (translationsError) {
      console.error("Error en traducciones:", translationsError);
      return [];
    }

    // Combinación final
    return products.map((p) => {
      const related = mappings.filter((m) => m.products_id === p.id);
      const translation = translations.find((t) =>
        related.some((m) => m.product_translations_id === t.id)
      );

      return {
        id: p.id,
        name: translation?.name ?? p.name,
        description: translation?.description ?? p.description,
        price: p.price,
        discount: p.discount,
        inStock: p.in_stock ?? p.stock,
        image: getPublicImageUrl(p.image),
        category: p.category,
        brand: p.brand,
        slug: p.slug,
        language: p.language,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    });
  } catch (err) {
    console.error("Error inesperado en fetchBaseProducts:", err);
    return [];
  }
}

// ===========================================================
// 🚀 FUNCIONES ESPECÍFICAS REUTILIZANDO LA BASE
// ===========================================================

export async function fetchAllProducts(locale: string): Promise<Product[]> {
  return fetchBaseProducts({ locale });
}

export async function fetchNewProducts(locale: string): Promise<Product[]> {
  return fetchBaseProducts({
    locale,
    orderBy: "created_at",
    ascending: false,
    limit: 4,
  });
}

export async function fetchProductsByCategory(
  locale: string,
  category: string
): Promise<Product[]> {
  return fetchBaseProducts({
    locale,
    filters: { category },
    orderBy: "created_at",
    ascending: false,
  });
}

// ===========================================================
// 💾 Ejemplo: export para componentes
// ===========================================================

// Ejemplo de uso: const newProducts = await fetchNewProducts("es");
export const newProducts: Product[] = [];

/**
 * Obtener las mejores ofertas: top N productos por mayor descuento
 * Implementado reutilizando fetchBaseProducts y pasando un `modifyQuery`
 */
export async function fetchSpecialOffers(locale: string, limit = 6): Promise<Product[]> {
  return fetchBaseProducts({
    locale,
    limit,
    modifyQuery: (query: any) =>
      query.not("discount", "is", null).gt("discount", 0).order("discount", { ascending: false }),
  });
}

/**
 * Devuelve variantes (otros productos) enlazados a las mismas traducciones
 * Retorna array de { id, slug, language, name } donde name intenta usar la traducción
 * correspondiente al idioma del producto cuando existe, o bien el nombre del producto.
 */
export async function fetchProductVariants(productId: number | string): Promise<Array<{ id: number | string; slug?: string; language?: string; name?: string }>> {
  try {
    // 1) obtener translationIds vinculados al producto original
    const { data: mappingsForProduct, error: mErr } = await supabase
      .from('products_product_translations')
      .select('product_translations_id')
      .eq('products_id', productId as any);

    if (mErr || !mappingsForProduct || mappingsForProduct.length === 0) return [];

    const translationIds = mappingsForProduct.map((m: any) => m.product_translations_id);

    // 2) obtener todas las mappings que comparten esos translationIds (incluye el original)
    const { data: allMappings, error: allMapErr } = await supabase
      .from('products_product_translations')
      .select('products_id, product_translations_id')
      .in('product_translations_id', translationIds as any[]);

    if (allMapErr || !allMappings || allMappings.length === 0) return [];

    const productIds = Array.from(new Set(allMappings.map((m: any) => m.products_id))).filter((id) => id != productId);
    if (productIds.length === 0) return [];

    // 3) traer productos relacionados
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('id, slug, language, name')
      .in('id', productIds as any[]);

    if (prodErr || !products) return [];

    // 4) traer traducciones por id
    const { data: translations, error: transErr } = await supabase
      .from('product_translations')
      .select('id, name, lang')
      .in('id', translationIds as any[]);

    if (transErr || !translations) return products.map((p: any) => ({ id: p.id, slug: p.slug, language: p.language, name: p.name }));

    const translationsById = new Map(translations.map((t: any) => [t.id, t]));
    const productsById = new Map(products.map((p: any) => [p.id, p]));

    // 5) construir resultado guardando el nombre traducido cuando exista en la traducción ligada
    const resultMap = new Map<string | number, { id: any; slug?: string; language?: string; name?: string }>();
    for (const m of allMappings) {
      const pid = m.products_id;
      if (pid == productId) continue; // omitir original
      const prod = productsById.get(pid);
      if (!prod) continue;
      if (resultMap.has(pid)) continue; // ya procesado

      const trans = translationsById.get(m.product_translations_id);
      let displayName = prod.name;
      if (trans && prod.language && trans.lang === prod.language) displayName = trans.name || prod.name;

      resultMap.set(pid, { id: prod.id, slug: prod.slug, language: prod.language, name: displayName });
    }

    return Array.from(resultMap.values());
  } catch (err) {
    console.error('Error en fetchProductVariants:', err);
    return [];
  }
}