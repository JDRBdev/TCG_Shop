// app/api/webhooks/clerk/route.js
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';
import { headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req) {
  try {
    const headerPayload = headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error de autenticación', { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(process.env.CLERK_SECRET_KEY);
    
    let evt;
    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return new Response('Error de verificación', { status: 400 });
    }

    const eventType = evt.type;
    const user = evt.data;

    if (eventType === 'user.created') {
      await handleUserCreated(user);
    } 
    else if (eventType === 'user.updated') {
      await handleUserUpdated(user);
    }
    else if (eventType === 'user.deleted') {
      await handleUserDeleted(user);
    }

    return new Response('Webhook recibido', { status: 200 });

  } catch (error) {
    console.error('Error en webhook:', error);
    return new Response('Error interno', { status: 500 });
  }
}

async function handleUserCreated(user) {
  const primaryEmail = user.email_addresses?.find(
    email => email.id === user.primary_email_address_id
  )?.email_address || user.email_addresses?.[0]?.email_address;

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
    console.error('Error creating user profile:', error);
    throw error;
  }

  console.log('Perfil de usuario creado:', user.id);
}

async function handleUserUpdated(user) {
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
    console.error('Error updating user profile:', error);
    throw error;
  }

  console.log('Perfil de usuario actualizado:', user.id);
}

async function handleUserDeleted(user) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('clerk_id', user.id);

  if (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }

  console.log('Perfil de usuario eliminado:', user.id);
}