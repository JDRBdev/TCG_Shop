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

// 📦 Obtener todos los productos (con imágenes públicas)
export async function fetchProducts(locale: string): Promise<Product[]> {
  try {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*");

    if (productsError) {
      console.error("Error al obtener productos:", productsError);
      return [];
    }

    if (!products?.length) return [];

    const productIds = products.map((p: any) => p.id);

    // Relaciones producto ↔ traducción
    const { data: mappings, error: mappingsError } = await supabase
      .from("products_product_translations")
      .select("products_id, product_translations_id")
      .in("products_id", productIds);

    if (mappingsError) {
      console.error("Error al obtener relaciones de traducciones:", mappingsError);
      return [];
    }

    const translationIds = mappings.map((m: any) => m.product_translations_id);

    const { data: translations, error: translationsError } = await supabase
      .from("product_translations")
      .select("*")
      .in("id", translationIds)
      .eq("lang", locale);

    if (translationsError) {
      console.error("Error al obtener traducciones:", translationsError);
      return [];
    }

    // Combinar productos + traducciones + URLs públicas
    const result = products.map((p: any) => {
      const productMappings = mappings.filter((m: any) => m.products_id === p.id);
      const translation = translations.find((t: any) =>
        productMappings.some((m) => m.product_translations_id === t.id)
      );

      return {
        id: p.id,
        name: translation?.name ?? p.name,
        price: p.price,
        description: translation?.description ?? p.description,
        image: getPublicImageUrl(p.image),
        inStock: p.in_stock ?? p.stock,
        category: p.category || "other",
        language: p.language,
        slug: p.slug,
        brand: p.brand,
        discount: p.discount,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    });

    console.log(`✅ Productos cargados (${result.length}) con imágenes públicas.`);
    return result;
  } catch (err) {
    console.error("Error inesperado al obtener productos:", err);
    return [];
  }
}

// 📦 Obtener un producto traducido individual
export async function fetchTranslatedProduct(
  slug: string,
  locale: string
): Promise<Product | null> {
  try {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*")
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single();

    if (productError || !product) {
      console.error("Error al obtener producto:", productError);
      return null;
    }

    const { data: mappings, error: mappingsError } = await supabase
      .from("products_product_translations")
      .select("product_translations_id")
      .eq("products_id", product.id);

    if (mappingsError) {
      console.error("Error al obtener relaciones de traducciones:", mappingsError);
      return null;
    }

    const translationIds = mappings.map((m: any) => m.product_translations_id);

    const { data: translation, error: translationsError } = await supabase
      .from("product_translations")
      .select("*")
      .in("id", translationIds)
      .eq("lang", locale)
      .single();

    if (translationsError) {
      console.error("Error al obtener traducción:", translationsError);
    }

    return {
      id: product.id,
      name: translation?.name ?? product.name,
      description: translation?.description ?? product.description,
      price: product.price,
      discount: product.discount,
      inStock: product.in_stock ?? product.stock,
      image: getPublicImageUrl(product.image),
      language: product.language,
      category: product.category,
      brand: product.brand,
      slug: product.slug,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
  } catch (err) {
    console.error("Error inesperado al obtener producto traducido:", err);
    return null;
  }
}


export const featuredProducts: Product[] = [
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
    description: "Deck listo para torneos con estrategia de dragones",
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
];

export const specialOffers: Product[] = [
  {
    id: "101",
    name: "Bundle Mega Coleccionista",
    category: "booster",
    inStock: true,
    description: "3 Booster Boxes + Accesorios Premium + Cartas Exclusivas",
    price: 199.99,
    discount: 0.3,
    image: "/images/trading-card-booster-packs-collection.png",
    slug: "bundle-mega-coleccionista",
  },
  {
    id: "102",
    name: "Pack Competitivo Pro",
    category: "deck",
    inStock: true,
    description: "2 Decks Construidos + Guía de Estrategia + Protectores",
    price: 89.99,
    discount: 0.31,
    image: "/images/competitive-trading-card-deck.png",
    slug: "pack-competitivo-pro",
  },
  {
    id: "103",
    name: "Set Coleccionista Premium",
    category: "set",
    inStock: true,
    description: "Cartas Holográficas Raras + Carpeta Coleccionista",
    price: 149.99,
    discount: 0.25,
    image: "/images/holographic-rare-trading-card.png",
    slug: "set-coleccionista-premium",
  },
  {
    id: "104",
    name: "Bundle Accesorios Completo",
    category: "accessory",
    inStock: true,
    description: "Protectores, Carpetas, Dados y Tapete de Juego",
    price: 59.99,
    discount: 0.33,
    image: "/images/trading-card-accessories-sleeves-binders.png",
    slug: "bundle-accesorios-completo",
  },
];

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