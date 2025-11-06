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
  // Permite al llamador ajustar la query base (p. ej. añadir where/not/gt/order)
  modifyQuery?: (query: any) => any;
}

async function fetchBaseProducts({
  locale,
  filters,
  orderBy,
  ascending = true,
  limit = 0,
  modifyQuery,
}: FetchOptions): Promise<Product[]> {
  try {
    // Base query
    let query = supabase.from("products").select("*");

    // Filtros dinámicos
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value);
      }
    }

    // Permite al llamador ajustar la query base
    if (modifyQuery) query = modifyQuery(query);

    // Orden y límite (se pueden usar también dentro de modifyQuery si se prefiere)
    if (orderBy) query = query.order(orderBy, { ascending });
    if (limit) query = query.limit(limit);

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

export const products: Product[] = [
  {
    id: "1",
    name: "Booster Pack Premium",
    slug: "booster-pack-premium",
    category: "booster",
    price: 15.99,
    inStock: true,
    description: "Pack con 15 cartas aleatorias incluyendo 1 rara garantizada",
    image: "/images/trading-card-booster-pack-premium.png",
  },
  {
    id: "2",
    name: "Deck Competitivo Dragón",
    slug: "deck-competitivo-dragon",
    category: "deck",
    price: 45.99,
    inStock: true,
    description: "Deck construido listo para torneos con estrategia de dragones",
    image: "/images/competitive-trading-card-deck.png",
  },
  {
    id: "3",
    name: "Carta Holográfica Legendaria",
    slug: "carta-holografica-legendaria",
    category: "single",
    price: 89.99,
    inStock: false,
    description: "Carta única con efectos holográficos y poder legendario",
    image: "/images/holographic-rare-trading-card.png",
  },
  {
    id: "4",
    name: "Set Coleccionista Edición Limitada",
    slug: "set-coleccionista-edicion-limitada",
    category: "set",
    price: 129.99,
    inStock: true,
    description: "Colección completa de 50 cartas con caja especial",
    image: "/images/collector-trading-card-set.png",
  },
  {
    id: "5",
    name: "Booster Box Completa",
    slug: "booster-box-completa",
    category: "booster",
    price: 199.99,
    inStock: true,
    description: "36 packs en caja sellada con cartas exclusivas",
    image: "/images/trading-card-booster-packs-collection.png",
  },
  {
    id: "6",
    name: "Deck Starter Principiante",
    slug: "deck-starter-principiante",
    category: "deck",
    price: 24.99,
    inStock: true,
    description: "Deck perfecto para comenzar a jugar con guía incluida",
    image: "/images/competitive-trading-card-deck.png",
  },
  {
    id: "7",
    name: "Protectores Premium Transparentes",
    category: "accessory",
    price: 12.99,
    inStock: true,
    description: "Pack de 100 protectores transparentes de alta calidad",
    brand: "CardGuard Pro",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: "8",
    name: "Carpeta Coleccionista 9-Pocket",
    category: "accessory",
    price: 24.99,
    inStock: true,
    description: "Carpeta de cuero sintético con 20 páginas para 360 cartas",
    brand: "CollectorMax",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: "9",
    name: "Tapete de Juego Dragón Místico",
    category: "accessory",
    price: 29.99,
    inStock: true,
    description: "Tapete de goma antideslizante con diseño exclusivo",
    brand: "GameMat Elite",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: "10",
    name: "Set de Dados Metálicos",
    category: "accessory",
    price: 18.99,
    inStock: false,
    description: "Set de 7 dados metálicos con grabado láser",
    brand: "MetalDice Co",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: "11",
    name: "Caja de Almacenamiento Deluxe",
    category: "accessory",
    price: 45.99,
    inStock: true,
    description: "Caja de madera con compartimentos ajustables",
    brand: "WoodCraft Storage",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: "12",
    name: "Contador de Vida Digital",
    category: "accessory",
    price: 15.99,
    inStock: true,
    description: "Contador digital con pantalla LED y botones grandes",
    brand: "DigitalCount",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: "13",
    name: "Protectores Mate Negro",
    category: "accessory",
    price: 14.99,
    inStock: true,
    description: "Pack de 80 protectores mate para reducir reflejos",
    brand: "CardGuard Pro",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: "14",
    name: "Separadores de Cartas Premium",
    category: "accessory",
    price: 8.99,
    inStock: true,
    description: "Set de 25 separadores con etiquetas personalizables",
    brand: "OrganizeMax",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
];