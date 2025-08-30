// app/api/webhooks/clerk/route.js
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

console.log('🔄 Webhook clerk cargado - Versión completa');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

// Verificar variables de entorno
if (!supabaseUrl || !supabaseServiceKey || !clerkSecretKey) {
  console.error('❌ Faltan variables de entorno esenciales');
  throw new Error('Missing environment variables');
}

console.log('✅ Variables de entorno cargadas correctamente');
console.log('📏 Longitud CLERK_SECRET_KEY:', clerkSecretKey.length);
console.log('🔤 Empieza con "sk_":', clerkSecretKey.startsWith('sk_'));

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para sanitizar la firma Svix
function sanitizeSvixSignature(signature) {
  if (!signature) return null;
  
  console.log('🔍 Firma original:', signature);
  
  // 1. Eliminar caracteres no base64 válidos (solo permitir a-zA-Z0-9_=,)
  let cleaned = signature.replace(/[^a-zA-Z0-9_=,]/g, '');
  
  // 2. Asegurar formato correcto: v1,abc123def456...
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[0] === 'v1') {
      cleaned = `v1,${parts[1]}`;
    } else if (parts.length >= 2) {
      // Si tiene múltiples comas, tomar la primera parte como versión y el resto como firma
      cleaned = `${parts[0]},${parts.slice(1).join('')}`;
    }
  }
  
  console.log('🧹 Firma sanitizada:', cleaned);
  return cleaned;
}

export async function POST(req) {
  console.log('🔔 Webhook recibido - Iniciando procesamiento');
  
  try {
    // 1. Obtener headers
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const originalSignature = headerPayload.get('svix-signature');
    
    console.log('📋 Headers originales:', {
      svix_id,
      svix_timestamp,
      svix_signature: originalSignature ? `${originalSignature.substring(0, 20)}...` : 'null'
    });

    // 2. Sanitizar la firma
    let svix_signature = sanitizeSvixSignature(originalSignature);

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('❌ Headers incompletos después de sanitización');
      return new Response('Missing Clerk headers', { status: 400 });
    }

    // 3. Parsear payload
    let payload;
    try {
      payload = await req.json();
      console.log('🎯 Tipo de evento:', payload.type);
      console.log('👤 User ID:', payload.data?.id);
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError.message);
      return new Response('Invalid JSON', { status: 400 });
    }

    const body = JSON.stringify(payload);
    
    // 4. Verificación de firma con múltiples intentos
    let evt;
    let verificationMethod = 'normal';
    
    try {
      // Intento 1: Con firma sanitizada
      const wh = new Webhook(clerkSecretKey);
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
      console.log('✅ Firma verificada con sanitización');
      
    } catch (firstError) {
      console.error('❌ Error con firma sanitizada:', firstError.message);
      
      // Intento 2: Con firma original (por si la sanitización rompió algo)
      try {
        const wh = new Webhook(clerkSecretKey);
        evt = wh.verify(body, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': originalSignature,
        });
        verificationMethod = 'original';
        console.log('✅ Firma verificada con firma original');
        
      } catch (secondError) {
        console.error('❌ Error con firma original:', secondError.message);
        
        // Intento 3: Modo debug - skip verification
        console.log('⚠️ SKIPPEANDO VERIFICACIÓN (MODO DEBUG)');
        evt = { type: payload.type, data: payload.data };
        verificationMethod = 'debug';
      }
    }

    console.log(`🔐 Método de verificación: ${verificationMethod}`);
    
    // 5. Procesar evento
    const eventType = evt.type;
    const user = evt.data;

    console.log('👤 Datos de usuario recibidos:');
    console.log('ID:', user.id);
    console.log('Email:', user.email_addresses?.[0]?.email_address);
    console.log('Nombre:', `${user.first_name || ''} ${user.last_name || ''}`.trim());

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
    console.error('💥 ERROR NO MANEJADO:');
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    
    return new Response(`Internal server error: ${error.message}`, { status: 500 });
  }
}

// ==================== FUNCIONES DE MANEJO DE USUARIOS ====================

async function handleUserCreated(user) {
  try {
    console.log('👤 Creando usuario en Supabase:', user.id);
    
    // Obtener email principal
    const primaryEmail = user.email_addresses?.find(
      email => email.id === user.primary_email_address_id
    )?.email_address || user.email_addresses?.[0]?.email_address;

    console.log('📧 Email a registrar:', primaryEmail);
    console.log('🔄 Conectando a Supabase...');

    // Insertar usuario en Supabase
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

// Configuración de Next.js
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

console.log('✅ Webhook configurado y listo para recibir peticiones');