// app/api/webhooks/clerk/route.js
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

console.log('🔄 Webhook clerk cargado');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
console.log('Service Key:', supabaseServiceKey ? '✅ Configurada' : '❌ Faltante');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req) {
  console.log('🔔 Webhook recibido de Clerk - Iniciando procesamiento');
  
  try {
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    console.log('📦 Headers recibidos:', { 
      svix_id: svix_id ? '✅ Presente' : '❌ Faltante',
      svix_timestamp: svix_timestamp ? '✅ Presente' : '❌ Faltante', 
      svix_signature: svix_signature ? '✅ Presente' : '❌ Faltante'
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('❌ Faltan headers de Clerk necesarios');
      return new Response('Error de autenticación', { status: 400 });
    }

    const payload = await req.json();
    console.log('📨 Tipo de evento:', payload.type);
    console.log('👤 User ID:', payload.data?.id);
    console.log('📧 Email:', payload.data?.email_addresses?.[0]?.email_address);

    const body = JSON.stringify(payload);
    const wh = new Webhook(process.env.CLERK_SECRET_KEY);
    
    let evt;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
      console.log('✅ Webhook verificado correctamente');
    } catch (err) {
      console.error('❌ Error verifying webhook:', err.message);
      return new Response('Error de verificación', { status: 400 });
    }

    const eventType = evt.type;
    const user = evt.data;

    console.log(`🎯 Procesando evento: ${eventType}`);
    console.log(`👤 Usuario: ${user.id}`);
    console.log(`📧 Email: ${user.email_addresses?.[0]?.email_address}`);

    if (eventType === 'user.created') {
      console.log('🔄 Ejecutando handleUserCreated');
      await handleUserCreated(user);
    } 
    else if (eventType === 'user.updated') {
      console.log('🔄 Ejecutando handleUserUpdated');
      await handleUserUpdated(user);
    }
    else if (eventType === 'user.deleted') {
      console.log('🔄 Ejecutando handleUserDeleted');
      await handleUserDeleted(user);
    }

    console.log('✅ Webhook procesado exitosamente');
    return new Response('Webhook recibido', { status: 200 });

  } catch (error) {
    console.error('💥 Error grave en webhook:', error.message);
    console.error('Stack:', error.stack);
    return new Response('Error interno: ' + error.message, { status: 500 });
  }
}

async function handleUserCreated(user) {
  try {
    console.log('👤 Creando usuario en Supabase:', user.id);
    
    const primaryEmail = user.email_addresses?.find(
      email => email.id === user.primary_email_address_id
    )?.email_address || user.email_addresses?.[0]?.email_address;

    console.log('📧 Email a guardar:', primaryEmail);
    console.log('🔄 Conectando a Supabase...');

    // Testear conexión primero
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('❌ Error de conexión a Supabase:', testError);
      throw testError;
    }
    console.log('✅ Conexión a Supabase exitosa');

    // Insertar usuario
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        clerk_id: user.id,
        email: primaryEmail,
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        avatar_url: user.image_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('❌ Error insertando en Supabase:');
      console.error('Código:', error.code);
      console.error('Mensaje:', error.message);
      console.error('Detalles:', error.details);
      console.error('Hint:', error.hint);
      throw error;
    }

    console.log('✅ Usuario creado exitosamente en Supabase:', data);
    return data;

  } catch (error) {
    console.error('💥 Error en handleUserCreated:', error.message);
    throw error;
  }
}

// ... (handleUserUpdated y handleUserDeleted similares con logging)