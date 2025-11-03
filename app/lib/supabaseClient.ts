import { createClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase centralizado para toda la aplicación
 * Esto evita crear múltiples instancias en cada componente/página
 * 
 * Variables de entorno requeridas:
 * - NEXT_PUBLIC_SUPABASE_URL: URL base de tu base de datos Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Clave pública anónima
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validar que las variables existan antes de crear el cliente
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase")
}

// Exportar instancia de Supabase con config:
// - headers: Incluir autenticación y content-type en todas las requests
// - auth: Desactivar persistencia de sesión (solo queries públicas)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      Accept: "application/json",
      apikey: supabaseAnonKey,
      "Content-Type": "application/json",
    },
  },
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

export default supabase
