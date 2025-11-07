// app/productos/page.tsx (Server Component)
import { cookies } from 'next/headers'
import React, { Suspense } from 'react'
import ProductosClientPage from './client-side'
import { fetchAllProducts } from '@/app/data/products'
import { getDictionary } from '../../hooks/dictionaries' // Importar getDictionary

export const revalidate = 60

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
  const initialProducts = await fetchAllProducts(lang)
  
  // Define un array constante con los idiomas soportados
  const supportedLangs = ["en", "es", "fr", "de"] as const;

  // Verifica si 'lang' está dentro de los idiomas soportados.
  // Si es así, lo usa; si no, por defecto usa "en" (inglés).
  const safeLang = supportedLangs.includes(lang as any) 
    ? (lang as typeof supportedLangs[number]) 
    : "es";

  // Obtiene el diccionario de traducciones correspondiente al idioma seguro seleccionado
  const dict = await getDictionary(safeLang) // es
  
  // Parsear los parámetros de búsqueda
  const filters = {
    language: typeof searchParamsObj.language === 'string' ? searchParamsObj.language : "all",
    category: typeof searchParamsObj.category === 'string' ? searchParamsObj.category : "all",
    brand: typeof searchParamsObj.brand === 'string' ? searchParamsObj.brand : "all",
    sort: typeof searchParamsObj.sort === 'string' ? searchParamsObj.sort : "name",
    inStock: typeof searchParamsObj.inStock === 'string' ? searchParamsObj.inStock === "true" : false
  }

  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">{/* loading */}</div>}>
      <ProductosClientPage 
        initialProducts={initialProducts}
        initialFilters={filters}
        dict={dict} // Pasar el diccionario como prop
        lang={safeLang || "es"} // Pasar el idioma actual como prop
      />
    </Suspense>
  )
}