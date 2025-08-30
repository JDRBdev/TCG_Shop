// app/api/webhooks/clerk/route.js
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verificar variables de entorno
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Faltan variables de entorno de Supabase');
  throw new Error('Supabase configuration missing');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req) {
  console.log('🔔 Webhook de Clerk recibido');

  try {
    // 1. Verificar headers de Clerk
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    console.log('📦 Headers de Clerk:', {
      svix_id: svix_id ? '✅ Presente' : '❌ Faltante',
      svix_timestamp: svix_timestamp ? '✅ Presente' : '❌ Faltante',
      svix_signature: svix_signature ? '✅ Presente' : '❌ Faltante'
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('❌ Faltan headers requeridos de Clerk');
      return new Response('Missing Clerk headers', { status: 400 });
    }

    // 2. Parsear y verificar el payload
    const payload = await req.json();
    console.log('🎯 Tipo de evento:', payload.type);
    console.log('👤 ID de usuario:', payload.data?.id);

    const body = JSON.stringify(payload);
    const wh = new Webhook(process.env.CLERK_SECRET_KEY);
    
    let evt;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
      console.log('✅ Firma de webhook verificada correctamente');
    } catch (err) {
      console.error('❌ Error verificando webhook:', err.message);
      return new Response('Invalid webhook signature', { status: 401 });
    }

    // 3. Procesar el evento
    const eventType = evt.type;
    const user = evt.data;

    console.log(`🔄 Procesando evento: ${eventType}`);
    console.log(`📧 Email: ${user.email_addresses?.[0]?.email_address}`);

    switch (eventType) {
      case 'user.created':
        await handleUserCreated(user);
        break;
      case 'user.updated':
        await handleUserUpdated(user);
        break;
      case 'user.deleted':
        await handleUserDeleted(user);
        break;
      default:
        console.log(`⚠️ Evento no manejado: ${eventType}`);
    }

    console.log('✅ Webhook procesado exitosamente');
    return new Response('Webhook received successfully', { status: 200 });

  } catch (error) {
    console.error('💥 Error grave en webhook:', error.message);
    console.error(error.stack);
    return new Response(`Internal server error: ${error.message}`, { status: 500 });
  }
}

// Función para crear usuario
async function handleUserCreated(user) {
  try {
    console.log('👤 Creando usuario en Supabase:', user.id);

    // Obtener email principal
    const primaryEmail = user.email_addresses?.find(
      email => email.id === user.primary_email_address_id
    )?.email_address || user.email_addresses?.[0]?.email_address;

    console.log('📧 Email a registrar:', primaryEmail);

    // Insertar en Supabase
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
      
      // Si es error de duplicado, intentar actualizar
      if (error.code === '23505') {
        console.log('🔄 Usuario ya existe, actualizando...');
        await handleUserUpdated(user);
        return;
      }
      
      throw error;
    }

    console.log('✅ Usuario creado exitosamente en Supabase:', data);
    return data;

  } catch (error) {
    console.error('💥 Error en handleUserCreated:', error.message);
    throw error;
  }
}

// Función para actualizar usuario
async function handleUserUpdated(user) {
  try {
    console.log('🔄 Actualizando usuario en Supabase:', user.id);

    const primaryEmail = user.email_addresses?.find(
      email => email.id === user.primary_email_address_id
    )?.email_address || user.email_addresses?.[0]?.email_address;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        email: primaryEmail,
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        avatar_url: user.image_url,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_id', user.id)
      .select();

    if (error) {
      console.error('❌ Error actualizando usuario:', error);
      throw error;
    }

    if (data && data.length > 0) {
      console.log('✅ Usuario actualizado exitosamente:', data);
    } else {
      console.log('⚠️ Usuario no encontrado, creando nuevo...');
      await handleUserCreated(user);
    }

    return data;

  } catch (error) {
    console.error('💥 Error en handleUserUpdated:', error.message);
    throw error;
  }
}

// Función para eliminar usuario
async function handleUserDeleted(user) {
  try {
    console.log('🗑️ Eliminando usuario de Supabase:', user.id);

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('clerk_id', user.id);

    if (error) {
      console.error('❌ Error eliminando usuario:', error);
      throw error;
    }

    console.log('✅ Usuario eliminado exitosamente de Supabase');
    
  } catch (error) {
    console.error('💥 Error en handleUserDeleted:', error.message);
    throw error;
  }
}

// Configuración adicional para Next.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';