import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Función para obtener el perfil basado en Clerk ID
export async function getProfileByClerkId(clerkId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('clerk_id', clerkId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getProfileByClerkId:', error);
    return null;
  }
}

// Función para crear o actualizar perfil desde el cliente
export async function upsertProfileFromClerk(user) {
  try {
    const primaryEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress;
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        clerk_id: user.id,
        email: primaryEmail,
        full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        avatar_url: user.imageUrl,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'clerk_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in upsertProfileFromClerk:', error);
    throw error;
  }
}