// app/api/test-supabase/route.js
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseKey) {
      return Response.json({ 
        error: 'SUPABASE_SERVICE_ROLE_KEY no configurada',
        variables: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test de conexión
    const { data, error } = await supabase
      .from('profiles')
      .select('count(*)')
      .limit(1);

    if (error) {
      return Response.json({ 
        error: 'Error de Supabase', 
        details: error,
        supabaseUrl: supabaseUrl
      }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Conexión a Supabase exitosa',
      data,
      tableExists: true
    });

  } catch (error) {
    return Response.json({ 
      error: 'Error inesperado', 
      message: error.message 
    }, { status: 500 });
  }
}