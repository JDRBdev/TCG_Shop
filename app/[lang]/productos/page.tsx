// app/productos/page.tsx (Server Component)
import { cookies } from 'next/headers'
import ProductosClientPage from './client-side'
import { fetchProducts } from '@/app/data/products' // Importar la función de traducción

export const revalidate = 60 // Revalida cada 60 segundos

export default async function ProductosPage({ 
  searchParams,
  params 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  params: Promise<{ lang: string }>
}) {
  const searchParamsObj = await searchParams
  const { lang } = await params
  
  // Obtener productos TRADUCIDOS según el lang
  const initialProducts = await fetchProducts(lang)
  
  // Parsear los parámetros de búsqueda
  const filters = {
    language: typeof searchParamsObj.language === 'string' ? searchParamsObj.language : "all",
    category: typeof searchParamsObj.category === 'string' ? searchParamsObj.category : "all",
    brand: typeof searchParamsObj.brand === 'string' ? searchParamsObj.brand : "all",
    sort: typeof searchParamsObj.sort === 'string' ? searchParamsObj.sort : "name",
    inStock: typeof searchParamsObj.inStock === 'string' ? searchParamsObj.inStock === "true" : false
  }

  // Log para debugging
  console.log('lang:', lang)
  console.log('Productos traducidos:', initialProducts.length)
  if (initialProducts.length > 0) {
    console.log('Primer producto traducido:', initialProducts[0].name)
  }

  return (
    <ProductosClientPage 
      initialProducts={initialProducts}
      initialFilters={filters}
    />
  )
}