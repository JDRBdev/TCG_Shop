import { createClient } from "@supabase/supabase-js";

export interface Product {
  id: number;
  name: string;
  slug?: string;
  category?: "booster" | "deck" | "single" | "set" | "accessory";
  brand?: string;
  price: number;
  discount?: number;       
  inStock: boolean;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  timeLeft?: string; 
}

// Inicializa Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey!);

// Función para obtener productos traducidos según idioma
export async function fetchProducts(locale: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      price,
      in_stock,
      category,
      image,
      slug,
      product_translations!inner (
        lang,
        name,
        description
      )
    `)
    .eq('product_translations.lang', locale);

  if (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }

  return (data ?? []).map((item: any) => ({
    id: item.id,
    name: item.product_translations[0]?.name ?? "", // traducción o vacío
    price: item.price,
    description: item.product_translations[0]?.description ?? "",
    image: item.image,
    inStock: item.in_stock,
    category: item.category || "other",
    slug: item.slug,
    type: item.type,
    brand: item.brand,
    originalPrice: item.original_price,
    discount: item.discount,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    timeLeft: item.time_left,
    material: item.material,
  }));
}

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Booster Pack Premium",
    slug: "booster-pack-premium",
    category: "booster",
    price: 15.99,
    inStock: true,
    description: "Pack con 15 cartas aleatorias incluyendo 1 rara garantizada",
    image: "/images/trading-card-booster-pack-premium.png",
  },
  {
    id: 2,
    name: "Deck Competitivo Dragón",
    slug: "deck-competitivo-dragon",
    category: "deck",
    price: 45.99,
    inStock: true,
    description: "Deck listo para torneos con estrategia de dragones",
    image: "/images/competitive-trading-card-deck.png",
  },
  {
    id: 3,
    name: "Carta Holográfica Legendaria",
    slug: "carta-holografica-legendaria",
    category: "single",
    price: 89.99,
    inStock: false,
    description: "Carta única con efectos holográficos y poder legendario",
    image: "/images/holographic-rare-trading-card.png",
  },
  {
    id: 4,
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
    id: 101,
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
    id: 102,
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
    id: 103,
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
    id: 104,
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
    id: 1,
    name: "Booster Pack Premium",
    slug: "booster-pack-premium",
    category: "booster",
    price: 15.99,
    inStock: true,
    description: "Pack con 15 cartas aleatorias incluyendo 1 rara garantizada",
    image: "/images/trading-card-booster-pack-premium.png",
  },
  {
    id: 2,
    name: "Deck Competitivo Dragón",
    slug: "deck-competitivo-dragon",
    category: "deck",
    price: 45.99,
    inStock: true,
    description: "Deck construido listo para torneos con estrategia de dragones",
    image: "/images/competitive-trading-card-deck.png",
  },
  {
    id: 3,
    name: "Carta Holográfica Legendaria",
    slug: "carta-holografica-legendaria",
    category: "single",
    price: 89.99,
    inStock: false,
    description: "Carta única con efectos holográficos y poder legendario",
    image: "/images/holographic-rare-trading-card.png",
  },
  {
    id: 4,
    name: "Set Coleccionista Edición Limitada",
    slug: "set-coleccionista-edicion-limitada",
    category: "set",
    price: 129.99,
    inStock: true,
    description: "Colección completa de 50 cartas con caja especial",
    image: "/images/collector-trading-card-set.png",
  },
  {
    id: 5,
    name: "Booster Box Completa",
    slug: "booster-box-completa",
    category: "booster",
    price: 199.99,
    inStock: true,
    description: "36 packs en caja sellada con cartas exclusivas",
    image: "/images/trading-card-booster-packs-collection.png",
  },
  {
    id: 6,
    name: "Deck Starter Principiante",
    slug: "deck-starter-principiante",
    category: "deck",
    price: 24.99,
    inStock: true,
    description: "Deck perfecto para comenzar a jugar con guía incluida",
    image: "/images/competitive-trading-card-deck.png",
  },
  {
    id: 7,
    name: "Protectores Premium Transparentes",
    category: "accessory",
    price: 12.99,
    inStock: true,
    description: "Pack de 100 protectores transparentes de alta calidad",
    brand: "CardGuard Pro",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 8,
    name: "Carpeta Coleccionista 9-Pocket",
    category: "accessory",
    price: 24.99,
    inStock: true,
    description: "Carpeta de cuero sintético con 20 páginas para 360 cartas",
    brand: "CollectorMax",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 9,
    name: "Tapete de Juego Dragón Místico",
    category: "accessory",
    price: 29.99,
    inStock: true,
    description: "Tapete de goma antideslizante con diseño exclusivo",
    brand: "GameMat Elite",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 10,
    name: "Set de Dados Metálicos",
    category: "accessory",
    price: 18.99,
    inStock: false,
    description: "Set de 7 dados metálicos con grabado láser",
    brand: "MetalDice Co",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 11,
    name: "Caja de Almacenamiento Deluxe",
    category: "accessory",
    price: 45.99,
    inStock: true,
    description: "Caja de madera con compartimentos ajustables",
    brand: "WoodCraft Storage",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 12,
    name: "Contador de Vida Digital",
    category: "accessory",
    price: 15.99,
    inStock: true,
    description: "Contador digital con pantalla LED y botones grandes",
    brand: "DigitalCount",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 13,
    name: "Protectores Mate Negro",
    category: "accessory",
    price: 14.99,
    inStock: true,
    description: "Pack de 80 protectores mate para reducir reflejos",
    brand: "CardGuard Pro",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 14,
    name: "Separadores de Cartas Premium",
    category: "accessory",
    price: 8.99,
    inStock: true,
    description: "Set de 25 separadores con etiquetas personalizables",
    brand: "OrganizeMax",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
];

export const accessories: Product[] = [
  {
    id: 7,
    name: "Protectores Premium Transparentes",
    category: "accessory",
    price: 12.99,
    inStock: true,
    description: "Pack de 100 protectores transparentes de alta calidad",
    brand: "CardGuard Pro",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 8,
    name: "Carpeta Coleccionista 9-Pocket",
    category: "accessory",
    price: 24.99,
    inStock: true,
    description: "Carpeta de cuero sintético con 20 páginas para 360 cartas",
    brand: "CollectorMax",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 9,
    name: "Tapete de Juego Dragón Místico",
    category: "accessory",
    price: 29.99,
    inStock: true,
    description: "Tapete de goma antideslizante con diseño exclusivo",
    brand: "GameMat Elite",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 10,
    name: "Set de Dados Metálicos",
    category: "accessory",
    price: 18.99,
    inStock: false,
    description: "Set de 7 dados metálicos con grabado láser",
    brand: "MetalDice Co",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 11,
    name: "Caja de Almacenamiento Deluxe",
    category: "accessory",
    price: 45.99,
    inStock: true,
    description: "Caja de madera con compartimentos ajustables",
    brand: "WoodCraft Storage",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 12,
    name: "Contador de Vida Digital",
    category: "accessory",
    price: 15.99,
    inStock: true,
    description: "Contador digital con pantalla LED y botones grandes",
    brand: "DigitalCount",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 13,
    name: "Protectores Mate Negro",
    category: "accessory",
    price: 14.99,
    inStock: true,
    description: "Pack de 80 protectores mate para reducir reflejos",
    brand: "CardGuard Pro",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
  {
    id: 14,
    name: "Separadores de Cartas Premium",
    category: "accessory",
    price: 8.99,
    inStock: true,
    description: "Set de 25 separadores con etiquetas personalizables",
    brand: "OrganizeMax",
    image: "/images/trading-card-accessories-sleeves-binders.png",
  },
];
