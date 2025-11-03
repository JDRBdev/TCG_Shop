"use client"

import { createContext, useContext, ReactNode } from "react"
import useProductUpdates, { ProductUpdate } from "@/app/hooks/useProductUpdates"

type Ctx = {
  updates: ProductUpdate[]
  isUpdating: boolean
  lastUpdate: Date | null
  error: Error | null
  refresh: () => Promise<ProductUpdate[]>
}

const ProductUpdatesContext = createContext<Ctx | null>(null)

export function ProductUpdatesProvider({
  children,
  intervalMs = 0,
}: {
  children: ReactNode
  intervalMs?: number
}) {
  const { updates, isUpdating, lastUpdate, error, refresh } = useProductUpdates({
    enabled: true,
    fetchOnMount: true,
    visibilityTrigger: true,
    intervalMs,
  })

  return (
    <ProductUpdatesContext.Provider
      value={{ updates, isUpdating, lastUpdate, error, refresh }}
    >
      {children}
    </ProductUpdatesContext.Provider>
  )
}

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
