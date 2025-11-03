import { createClient } from "@supabase/supabase-js"

// Centraliza la instancia de Supabase para uso en el cliente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan variables de entorno de Supabase")
}

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
