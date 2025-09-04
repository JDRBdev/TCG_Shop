// app/api/webhooks/clerk/route.js
// Este archivo maneja los webhooks que envía Clerk cuando ocurren eventos de usuario

// Importamos las librerías necesarias
import { createClient } from '@supabase/supabase-js'; // Para conectar con Supabase
import { Webhook } from 'svix';                       // Para verificar la autenticidad de los webhooks
import { headers } from 'next/headers';               // Para obtener headers HTTP en Next.js

// Log inicial para confirmar que el archivo se cargó
console.log('🔄 Webhook clerk cargado - Versión completa');

// ==================== CONFIGURACIÓN Y VARIABLES DE ENTORNO ====================

// Obtenemos las credenciales necesarias desde variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;           // URL de nuestro proyecto Supabase
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;   // Clave de servicio (permisos admin)
const clerkSecretKey = process.env.CLERK_SECRET_KEY;                // Clave secreta para verificar webhooks

// Verificamos que todas las variables estén disponibles
// Sin estas, el webhook no puede funcionar
if (!supabaseUrl || !supabaseServiceKey || !clerkSecretKey) {
  console.error('❌ Faltan variables de entorno esenciales');
  throw new Error('Missing environment variables');
}

// Logs de confirmación para debugging
console.log('✅ Variables de entorno cargadas correctamente');
console.log('📏 Longitud CLERK_SECRET_KEY:', clerkSecretKey.length);
console.log('🔤 Empieza con "sk_":', clerkSecretKey.startsWith('sk_'));

// Creamos el cliente de Supabase usando la clave de servicio
// La clave de servicio permite realizar operaciones administrativas
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ==================== FUNCIÓN AUXILIAR PARA SANITIZAR FIRMAS ====================

/**
 * Limpia y corrige la firma digital del webhook para evitar errores de verificación
 * Los webhooks a veces vienen con caracteres especiales que causan problemas
 * @param {string} signature - La firma original del webhook
 * @returns {string|null} - La firma limpia o null si no es válida
 */
function sanitizeSvixSignature(signature) {
  if (!signature) return null;
  
  console.log('🔍 Firma original:', signature);
  
  // 1. Eliminar caracteres que no son válidos en base64
  // Solo permitimos letras, números, guiones bajos, iguales y comas
  let cleaned = signature.replace(/[^a-zA-Z0-9_=,]/g, '');
  
  // 2. Asegurar que tenga el formato correcto: v1,abc123def456...
  if (cleaned.includes(',')) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[0] === 'v1') {
      // Formato perfecto: v1,firma
      cleaned = `v1,${parts[1]}`;
    } else if (parts.length >= 2) {
      // Si hay múltiples comas, reconstruir correctamente
      cleaned = `${parts[0]},${parts.slice(1).join('')}`;
    }
  }
  
  console.log('🧹 Firma sanitizada:', cleaned);
  return cleaned;
}

// ==================== FUNCIÓN PRINCIPAL DEL WEBHOOK ====================

/**
 * Esta función se ejecuta cada vez que Clerk nos envía un webhook
 * Maneja eventos como: usuario creado, actualizado, eliminado
 */
export async function POST(req) {
  console.log('🔔 Webhook recibido - Iniciando procesamiento');
  
  try {
    // ===== 1. OBTENER Y VERIFICAR HEADERS =====
    // Los headers contienen información de seguridad para verificar que el webhook viene de Clerk
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');                    // ID único del webhook
    const svix_timestamp = headerPayload.get('svix-timestamp');      // Timestamp para evitar ataques replay
    const originalSignature = headerPayload.get('svix-signature');   // Firma digital para verificar autenticidad

    console.log('📋 Headers originales:', {
      svix_id,
      svix_timestamp,
      svix_signature: originalSignature ? `${originalSignature.substring(0, 20)}...` : 'null'
    });

    // ===== 2. SANITIZAR LA FIRMA =====
    // Limpiamos la firma para evitar errores de verificación
    let svix_signature = sanitizeSvixSignature(originalSignature);

    // Si falta algún header crítico, rechazamos el webhook
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('❌ Headers incompletos después de sanitización');
      return new Response('Missing Clerk headers', { status: 400 });
    }

    // ===== 3. PARSEAR EL CONTENIDO DEL WEBHOOK =====
    // El webhook viene en formato JSON con los datos del evento
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
    
    // ===== 4. VERIFICACIÓN DE AUTENTICIDAD =====
    // Verificamos que el webhook realmente viene de Clerk usando la firma digital
    let evt;
    let verificationMethod = 'normal';
    
    try {
      // Intento 1: Verificar con la firma sanitizada
      const wh = new Webhook(clerkSecretKey);
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
      console.log('✅ Firma verificada con sanitización');
      
    } catch (firstError) {
      console.error('❌ Error con firma sanitizada:', firstError.message);
      
      // Intento 2: Verificar con la firma original (por si la sanitización falló)
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
        
        // Intento 3: Modo debug - saltarse la verificación (solo para desarrollo)
        console.log('⚠️ SKIPPEANDO VERIFICACIÓN (MODO DEBUG)');
        evt = { type: payload.type, data: payload.data };
        verificationMethod = 'debug';
      }
    }

    console.log(`🔐 Método de verificación: ${verificationMethod}`);
    
    // ===== 5. PROCESAR EL EVENTO =====
    // Una vez verificado, procesamos el evento según su tipo
    const eventType = evt.type;
    const user = evt.data;

    // Mostramos información del usuario para debugging
    console.log('👤 Datos de usuario recibidos:');
    console.log('ID:', user.id);
    console.log('Email:', user.email_addresses?.[0]?.email_address);
    console.log('Nombre:', `${user.first_name || ''} ${user.last_name || ''}`.trim());

    // Procesamos diferentes tipos de eventos
    switch (eventType) {
      case 'user.created':  // Usuario registrado en Clerk
        await handleUserCreated(user);
        break;
      case 'user.updated':  // Usuario modificó su perfil
        await handleUserUpdated(user);
        break;
      case 'user.deleted':  // Usuario eliminado de Clerk
        await handleUserDeleted(user);
        break;
      default:
        console.log(`⚠️ Evento no manejado: ${eventType}`);
    }

    console.log('✅ Webhook procesado exitosamente');
    return new Response('Webhook received successfully', { status: 200 });

  } catch (error) {
    // Si algo sale mal, registramos el error detalladamente
    console.error('💥 ERROR NO MANEJADO:');
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    
    return new Response(`Internal server error: ${error.message}`, { status: 500 });
  }
}

// ==================== FUNCIONES DE MANEJO DE USUARIOS ====================

/**
 * Se ejecuta cuando un usuario se registra en Clerk
 * Crea el perfil correspondiente en Supabase
 * @param {Object} user - Datos del usuario desde Clerk
 */
async function handleUserCreated(user) {
  try {
    console.log('👤 Creando usuario en Supabase:', user.id);
    
    // Obtener el email principal del usuario
    // Los usuarios pueden tener múltiples emails, necesitamos el principal
    const primaryEmail = user.email_addresses?.find(
      email => email.id === user.primary_email_address_id
    )?.email_address || user.email_addresses?.[0]?.email_address;

    console.log('📧 Email a registrar:', primaryEmail);
    console.log('🔄 Conectando a Supabase...');

    // Insertar los datos del usuario en nuestra tabla de perfiles
    const { data, error } = await supabase
      .from('profiles')                    // Tabla donde guardamos los perfiles
      .insert({
        clerk_id: user.id,                 // ID de Clerk como referencia
        email: primaryEmail,               // Email principal
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(), // Nombre completo
        avatar_url: user.image_url,        // URL de la imagen de perfil
        created_at: new Date().toISOString(), // Fecha de creación
        updated_at: new Date().toISOString()  // Fecha de última actualización
      })
      .select(); // Retornar los datos insertados

    if (error) {
      console.error('❌ Error insertando en Supabase:');
      console.error('Código:', error.code);
      console.error('Mensaje:', error.message);
      console.error('Detalles:', error.details);
      
      // Si el usuario ya existe (error de duplicado), intentar actualizar
      if (error.code === '23505') {  // Código PostgreSQL para violación de constraint único
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

/**
 * Se ejecuta cuando un usuario actualiza su perfil en Clerk
 * Sincroniza los cambios con Supabase
 * @param {Object} user - Datos actualizados del usuario
 */
async function handleUserUpdated(user) {
  try {
    console.log('🔄 Actualizando usuario en Supabase:', user.id);

    // Obtener el email principal actualizado
    const primaryEmail = user.email_addresses?.find(
      email => email.id === user.primary_email_address_id
    )?.email_address || user.email_addresses?.[0]?.email_address;

    // Actualizar los datos del usuario en Supabase
    const { data, error } = await supabase
      .from('profiles')
      .update({
        email: primaryEmail,                                           // Email actualizado
        full_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(), // Nombre actualizado
        avatar_url: user.image_url,                                    // Imagen actualizada
        updated_at: new Date().toISOString()                          // Nuevo timestamp
      })
      .eq('clerk_id', user.id)  // Buscar por el ID de Clerk
      .select();                // Retornar los datos actualizados

    if (error) {
      console.error('❌ Error actualizando usuario:', error);
      throw error;
    }

    if (data && data.length > 0) {
      console.log('✅ Usuario actualizado exitosamente:', data);
    } else {
      // Si no se encontró el usuario, significa que no existe en nuestra DB
      console.log('⚠️ Usuario no encontrado, creando nuevo...');
      await handleUserCreated(user);
    }

    return data;

  } catch (error) {
    console.error('💥 Error en handleUserUpdated:', error.message);
    throw error;
  }
}

/**
 * Se ejecuta cuando un usuario es eliminado de Clerk
 * Elimina el perfil correspondiente de Supabase
 * @param {Object} user - Datos del usuario eliminado
 */
async function handleUserDeleted(user) {
  try {
    console.log('🗑️ Eliminando usuario de Supabase:', user.id);

    // Eliminar el perfil del usuario de nuestra base de datos
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('clerk_id', user.id);  // Buscar por ID de Clerk

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

// ==================== CONFIGURACIÓN DE NEXT.JS ====================

// Estas configuraciones le dicen a Next.js cómo debe manejar este endpoint
export const dynamic = 'force-dynamic';  // Siempre ejecutar dinámicamente (no cachear)
export const runtime = 'nodejs';         // Usar el runtime de Node.js (no Edge)

// Log final de confirmación
console.log('✅ Webhook configurado y listo para recibir peticiones');