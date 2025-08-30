// app/api/update-username/route.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req) {
  try {
    const { clerkId, username } = await req.json();
    
    if (!clerkId || !username) {
      return Response.json({ error: 'clerkId and username required' }, { status: 400 });
    }

    // Verificar si el username ya existe
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('clerk_id', clerkId)
      .single();

    if (existingUser) {
      return Response.json({ error: 'Username already taken' }, { status: 409 });
    }

    // Actualizar username
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        username: username,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', clerkId)
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ 
      success: true, 
      message: 'Username updated',
      data 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}