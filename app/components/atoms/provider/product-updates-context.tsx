"use client"

import { createContext, useContext, ReactNode } from "react"
import useProductUpdates, { ProductUpdate } from "@/app/hooks/useProductUpdates"

/**
 * Shape del contexto: expone datos de actualizaciones globales
 */
type Ctx = {
  updates: ProductUpdate[]           // Array de productos actualizados
  isUpdating: boolean                // Si hay request en vuelo
  lastUpdate: Date | null            // Cuándo fue el último fetch
  error: Error | null                // Error si lo hay
  refresh: () => Promise<ProductUpdate[]>  // Función para refrescar manualmente
}

// Contexto React que será compartido por toda la app
const ProductUpdatesContext = createContext<Ctx | null>(null)

/**
 * Provider: envuelve la app y ejecuta el hook useProductUpdates
 * Todos los componentes hijos pueden acceder a los datos sin pasar props
 * 
 * @param intervalMs - Opcional: polling cada X ms (ej: 60000 = cada minuto)
 */
export function ProductUpdatesProvider({
  children,
  intervalMs = 0,
}: {
  children: ReactNode
  intervalMs?: number
}) {
  // Ejecuta el hook en el proveedor central
  const { updates, isUpdating, lastUpdate, error, refresh } = useProductUpdates({
    enabled: true,
    fetchOnMount: true,
    visibilityTrigger: true,
    intervalMs,  // Customizable desde props
  })

  return (
    <ProductUpdatesContext.Provider
      value={{ updates, isUpdating, lastUpdate, error, refresh }}
    >
      {children}
    </ProductUpdatesContext.Provider>
  )
}

/**
 * Hook para consumir datos del contexto en cualquier componente hijo
 * 
 * Uso:
 * const { updates, isUpdating } = useProductUpdatesContext()
 * 
 * @throws Error si se llama fuera de ProductUpdatesProvider
 */
export function useProductUpdatesContext() {
  const ctx = useContext(ProductUpdatesContext)
  if (!ctx) {
    throw new Error(
      "useProductUpdatesContext debe usarse dentro de ProductUpdatesProvider"
    )
  }
  return ctx
}

export default ProductUpdatesProvider
