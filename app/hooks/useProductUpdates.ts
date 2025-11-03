"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import supabase from "@/app/lib/supabaseClient"

/**
 * Define la estructura de un producto actualizado desde la BD
 * Solo incluye campos que pueden cambiar en tiempo real
 */
export interface ProductUpdate {
  id: string        // Identificador único del producto
  price: number     // Precio actual en euros
  discount: number  // Descuento en porcentaje (0-100)
  inStock: boolean  // Disponibilidad en inventario
}

/**
 * Opciones configurables del hook
 */
export interface UseProductUpdatesOptions {
  enabled?: boolean           // Activar/desactivar el hook globalmente
  fetchOnMount?: boolean      // Traer datos al montar el componente
  visibilityTrigger?: boolean // Actualizar cuando pestaña recupera foco
  intervalMs?: number         // Intervalo de polling (0 = desactivado)
  onUpdates?: (updates: ProductUpdate[]) => void // Callback opcional cuando hay nuevos datos
}

/**
 * Función async que trae de Supabase todos los productos actualizados
 * Retorna id, price, discount, inStock de cada producto
 * Si hay error, retorna array vacío (no rompe la app)
 */
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

    // Transforma datos de Supabase al formato esperado (in_stock → inStock)
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

/**
 * Hook reutilizable que gestiona actualizaciones de productos
 * 
 * Flujo:
 * 1. Al montar: trae datos si fetchOnMount = true
 * 2. Si visibilityTrigger: re-trae datos cuando pestaña recupera foco
 * 3. Si intervalMs > 0: polling automático cada X ms
 * 4. Expone: updates[], isUpdating, lastUpdate, error, refresh()
 * 
 * @example
 * const { updates, refresh } = useProductUpdates({ fetchOnMount: true })
 */
export function useProductUpdates(options: UseProductUpdatesOptions = {}) {
  const {
    enabled = true,
    fetchOnMount = true,
    visibilityTrigger = true,
    intervalMs = 0,
    onUpdates,
  } = options

  // Estado: array de productos actualizados
  const [updates, setUpdates] = useState<ProductUpdate[]>([])
  // Estado: indica si hay una request en vuelo
  const [isUpdating, setIsUpdating] = useState(false)
  // Estado: timestamp del último fetch exitoso
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  // Estado: último error (si lo hay)
  const [error, setError] = useState<Error | null>(null)

  // Ref para saber si componente sigue montado (evita state updates en unmounted)
  const isMountedRef = useRef(true)
  // Ref para evitar race conditions: solo 1 fetch a la vez
  const isRunningRef = useRef(false)

  // Limpiar ref al montar/desmontar
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  /**
   * Función que trae datos de BD y actualiza estado
   * Retorna los datos para usar sincrónicamente si necesario
   * Usa refs para evitar race conditions y updates en componentes desmont ados
   */
  const refresh = useCallback(async () => {
    // No ejecutar si: hook desactivado, componente desmontado o ya hay una request
    if (!enabled || !isMountedRef.current || isRunningRef.current) return [] as ProductUpdate[]

    isRunningRef.current = true
    setIsUpdating(true)
    setError(null)

    try {
      const data = await fetchUpdatedProductData()
      // Doble check: si componente se desmontó durante el fetch, no actualizar
      if (!isMountedRef.current) return data

      setUpdates(data)
      setLastUpdate(new Date())
      // Callback opcional para notificar a consumidores
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

  /**
   * Effect que gestiona:
   * 1. Fetch inicial si fetchOnMount = true
   * 2. Listener de "visibilitychange" para actualizar cuando pestaña recupera foco
   * 3. setInterval para polling periódico si intervalMs > 0
   */
  useEffect(() => {
    if (!enabled) return

    // Ejecutar fetch al montar
    if (fetchOnMount) {
      refresh()
    }

    // Listener: cuando usuario vuelve a la pestaña, traer datos frescos
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh()
      }
    }

    let intervalId: any
    // Registrar listeners y timers
    if (visibilityTrigger) {
      document.addEventListener("visibilitychange", onVisibility)
    }
    if (intervalMs && intervalMs > 0) {
      intervalId = setInterval(() => {
        refresh()
      }, intervalMs)
    }

    // Cleanup: remover listeners y cancelar timers
    return () => {
      if (visibilityTrigger) {
        document.removeEventListener("visibilitychange", onVisibility)
      }
      if (intervalId) clearInterval(intervalId)
    }
  }, [enabled, fetchOnMount, visibilityTrigger, intervalMs, refresh])

  // Exportar estado y control
  return { updates, isUpdating, lastUpdate, error, refresh }
}

export default useProductUpdates
