// app/productos/page.tsx (Server Component)
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import ProductosClientPage from './client-side'

export const revalidate = 60 // Revalida cada 60 segundos

async function getProducts() {
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
  )

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: Number(item.price) || 0,
    discount: Number(item.discount) || 0,
    inStock: item.in_stock,
    image: item.image,
    language: item.language,
    category: item.category,
    brand: item.brand,
    slug: item.slug,
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }))
}

export default async function ProductosPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParamsObj = await searchParams
  
  const initialProducts = await getProducts()
  
  // Parsear los parámetros de búsqueda
  const filters = {
    language: typeof searchParamsObj.language === 'string' ? searchParamsObj.language : "all",
    category: typeof searchParamsObj.category === 'string' ? searchParamsObj.category : "all",
    brand: typeof searchParamsObj.brand === 'string' ? searchParamsObj.brand : "all",
    sort: typeof searchParamsObj.sort === 'string' ? searchParamsObj.sort : "name",
    inStock: typeof searchParamsObj.inStock === 'string' ? searchParamsObj.inStock === "true" : false
  }

  return (
    <ProductosClientPage 
      initialProducts={initialProducts}
      initialFilters={filters}
    />
  )
}