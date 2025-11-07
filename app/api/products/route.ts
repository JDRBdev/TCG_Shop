import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchBaseProducts } from "@/app/data/products";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const locale = url.searchParams.get("locale") || "es";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "9", 10);
    const offset = (Math.max(page, 1) - 1) * limit;

    const language = url.searchParams.get("language");
    const category = url.searchParams.get("category");
    const brand = url.searchParams.get("brand");
    const inStock = url.searchParams.get("inStock");
    const sort = url.searchParams.get("sort");
    const search = url.searchParams.get("search")?.trim();

    const filters: Record<string, any> = {};
    if (language && language !== "all") filters.language = language;
    if (category && category !== "all") filters.category = category;
    if (brand && brand !== "all") filters.brand = brand;
    if (inStock === "true") filters.in_stock = true;

    // Si hay búsqueda, resolvemos IDs de producto por traducciones
    if (search && search.length > 0) {
      const sb = createClient(supabaseUrl, supabaseAnonKey);
      // Buscar traducciones que coincidan con el término de búsqueda
      const { data: translations, error: transError } = await sb
        .from("product_translations")
        .select("id")
        .ilike("name", `%${search}%`)
        .eq("lang", locale);

      console.log(`🔍 Búsqueda "${search}" en idioma ${locale}:`, translations?.length || 0, "traducciones encontradas");

      if (!translations || translations.length === 0) {
        console.log("❌ No se encontraron traducciones para la búsqueda");
        return NextResponse.json({ products: [] });
      }

      const translationIds = translations.map((t: any) => t.id);
      const { data: mappings, error: mapError } = await sb
        .from("products_product_translations")
        .select("products_id")
        .in("product_translations_id", translationIds);

      console.log(`🔗 Mappings encontrados:`, mappings?.length || 0);

      if (!mappings || mappings.length === 0) {
        console.log("❌ No se encontraron productos vinculados a las traducciones");
        return NextResponse.json({ products: [] });
      }

      const productIds = [...new Set(mappings.map((m: any) => m.products_id))]; // Eliminar duplicados
      console.log(`📦 IDs de productos únicos:`, productIds.length);
      filters.id = productIds;
    }

    // Sort mapping (simple mapping for server-side sortable fields)
    let orderBy: string | undefined = undefined;
    let ascending = true;
    const sortByName = sort === "name";
    const sortByDiscount = sort === "discount";
    
    if (sort && !sortByName && !sortByDiscount) {
      switch (sort) {
        case "price-low":
          orderBy = "price";
          ascending = true;
          break;
        case "price-high":
          orderBy = "price";
          ascending = false;
          break;
        default:
          break;
      }
    }

    let products = await fetchBaseProducts({
      locale,
      filters: Object.keys(filters).length ? filters : undefined,
      orderBy,
      ascending,
      // Para name y discount: no usamos limit/offset en la query, los traeremos todos
      limit: (sortByName || sortByDiscount) ? 0 : limit,
      offset: (sortByName || sortByDiscount) ? 0 : offset,
    });

    console.log(`📦 Productos obtenidos de BD: ${products.length}`);

    // Si el ordenamiento es por name, lo hacemos en memoria después de traer los productos traducidos
    if (sortByName && products.length > 0) {
      console.log(`🔤 Ordenando ${products.length} productos por nombre...`);
      products = products
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(offset, offset + limit);
      console.log(`✂️ Slice [${offset}, ${offset + limit}]: ${products.length} productos`);
    }

    // Si el ordenamiento es por discount, tratamos null como 0 y los ponemos al final
    if (sortByDiscount && products.length > 0) {
      console.log(`💰 Ordenando ${products.length} productos por descuento...`);
      products = products
        .sort((a, b) => {
          const discountA = a.discount ?? 0;
          const discountB = b.discount ?? 0;
          return discountB - discountA; // Mayor a menor
        })
        .slice(offset, offset + limit);
      console.log(`✂️ Slice [${offset}, ${offset + limit}]: ${products.length} productos`);
    }

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Error en API /api/products:", err);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
