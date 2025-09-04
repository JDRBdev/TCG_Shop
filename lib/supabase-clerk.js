// Importamos la función para crear un cliente de Supabase
import { createClient } from '@supabase/supabase-js';

// Obtenemos las credenciales de Supabase desde las variables de entorno
// NEXT_PUBLIC_ indica que estas variables estarán disponibles en el frontend
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Creamos y exportamos el cliente de Supabase para usar en toda la aplicación
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Función para obtener el perfil de un usuario basado en su ID de Clerk
 * @param {string} clerkId - El ID único del usuario en Clerk
 * @returns {Object|null} - Los datos del perfil o null si no existe/hay error
 */
export async function getProfileByClerkId(clerkId) {
  try {
    // Realizamos una consulta a la tabla 'profiles' en Supabase
    const { data, error } = await supabase
      .from('profiles')           // Especificamos la tabla
      .select('*')                // Seleccionamos todas las columnas
      .eq('clerk_id', clerkId)    // Filtramos por clerk_id igual al parámetro
      .single();                  // Esperamos solo un resultado (lanza error si hay más de uno)

    // Verificamos si hubo algún error en la consulta
    if (error) {
      // PGRST116 es el código específico de "No rows found" en Supabase
      if (error.code === 'PGRST116') {
        return null; // Retornamos null si el usuario no existe (no es un error real)
      }
      // Para otros errores, los registramos y retornamos null
      console.error('Error fetching profile:', error);
      return null;
    }

    // Si todo salió bien, retornamos los datos del perfil
    return data;
  } catch (error) {
    // Capturamos cualquier error inesperado (problemas de red, etc.)
    console.error('Error in getProfileByClerkId:', error);
    return null;
  }
}

/**
 * Función para crear o actualizar un perfil de usuario usando datos de Clerk
 * Utiliza "upsert" que significa: actualiza si existe, crea si no existe
 * @param {Object} user - Objeto de usuario que viene de Clerk
 * @returns {Object} - Los datos del perfil creado/actualizado
 */
export async function upsertProfileFromClerk(user) {
  try {
    // Obtenemos el email primario del usuario
    // Clerk puede tener el email en diferentes propiedades, así que probamos ambas
    const primaryEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress;
    
    // Realizamos un "upsert" (insert + update) en la tabla profiles
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        // Datos que vamos a insertar/actualizar:
        clerk_id: user.id,                                                    // ID único de Clerk
        email: primaryEmail,                                                  // Email primario
        full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),  // Nombre completo (manejamos nulls)
        avatar_url: user.imageUrl,                                           // URL del avatar
        updated_at: new Date().toISOString()                                 // Timestamp de actualización
      }, {
        // Configuración del upsert:
        onConflict: 'clerk_id',     // Si hay conflicto, usar la columna clerk_id para identificar el registro
        ignoreDuplicates: false     // No ignorar duplicados, sino actualizarlos
      })
      .select()  // Seleccionar los datos después de la operación
      .single(); // Esperamos un solo resultado

    // Verificamos si hubo error en la operación
    if (error) {
      console.error('Error upserting profile:', error);
      throw error; // Lanzamos el error para que el código que llama esta función lo maneje
    }

    // Retornamos los datos del perfil creado/actualizado
    return data;
  } catch (error) {
    // Capturamos cualquier error inesperado
    console.error('Error in upsertProfileFromClerk:', error);
    throw error; // Re-lanzamos el error
  }
}