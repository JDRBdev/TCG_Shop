"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import supabase from "@/app/lib/supabaseClient"

export interface ProductUpdate {
  id: string
  price: number
  discount: number
  inStock: boolean
}

export interface UseProductUpdatesOptions {
  enabled?: boolean
  fetchOnMount?: boolean
  visibilityTrigger?: boolean
  intervalMs?: number
  onUpdates?: (updates: ProductUpdate[]) => void
}

export async function fetchUpdatedProductData(): Promise<ProductUpdate[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("id, price, discount, in_stock")
      .order("name")

    if (error) {
      console.error("Error fetching updated products:", error)
      return []
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      price: Number(item.price) || 0,
      discount: Number(item.discount) || 0,
      inStock: !!item.in_stock,
    }))
  } catch (err) {
    console.error("Error in fetchUpdatedProductData:", err)
    return []
  }
}

export function useProductUpdates(options: UseProductUpdatesOptions = {}) {
  const {
    enabled = true,
    fetchOnMount = true,
    visibilityTrigger = true,
    intervalMs = 0,
    onUpdates,
  } = options

  const [updates, setUpdates] = useState<ProductUpdate[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const isMountedRef = useRef(true)
  const isRunningRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const refresh = useCallback(async () => {
    if (!enabled || !isMountedRef.current || isRunningRef.current) return [] as ProductUpdate[]
    isRunningRef.current = true
    setIsUpdating(true)
    setError(null)
    try {
      const data = await fetchUpdatedProductData()
      if (!isMountedRef.current) return data
      setUpdates(data)
      setLastUpdate(new Date())
      onUpdates?.(data)
      return data
    } catch (err: any) {
      if (isMountedRef.current) setError(err)
      return []
    } finally {
      if (isMountedRef.current) setIsUpdating(false)
      isRunningRef.current = false
    }
  }, [enabled, onUpdates])

  useEffect(() => {
    if (!enabled) return

    if (fetchOnMount) {
      // fire and forget
      refresh()
    }

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh()
      }
    }

    let intervalId: any
    if (visibilityTrigger) {
      document.addEventListener("visibilitychange", onVisibility)
    }
    if (intervalMs && intervalMs > 0) {
      intervalId = setInterval(() => {
        refresh()
      }, intervalMs)
    }

    return () => {
      if (visibilityTrigger) {
        document.removeEventListener("visibilitychange", onVisibility)
      }
      if (intervalId) clearInterval(intervalId)
    }
  }, [enabled, fetchOnMount, visibilityTrigger, intervalMs, refresh])

  return { updates, isUpdating, lastUpdate, error, refresh }
}

export default useProductUpdates
