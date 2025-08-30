// app/api/webhooks/clerk/route.js
export const dynamic = 'force-dynamic';

export async function POST(request) {
  console.log('✅ WEBHOOK CLERK INICIADO');
  
  try {
    // 1. Verificar headers de Clerk
    const headers = Object.fromEntries(request.headers.entries());
    console.log('📋 Headers recibidos:', {
      'svix-id': headers['svix-id'] ? 'PRESENTE' : 'FALTANTE',
      'svix-timestamp': headers['svix-timestamp'] ? 'PRESENTE' : 'FALTANTE',
      'svix-signature': headers['svix-signature'] ? 'PRESENTE' : 'FALTANTE'
    });

    // 2. Verificar método HTTP
    if (request.method !== 'POST') {
      console.log('❌ Método incorrecto:', request.method);
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    // 3. Verificar contenido JSON
    let payload;
    try {
      payload = await request.json();
      console.log('📦 Payload JSON válido');
    } catch (jsonError) {
      console.log('❌ Error parsing JSON:', jsonError.message);
      return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    console.log('🎯 Event type:', payload.type);
    console.log('👤 User ID:', payload.data?.id);

    // 4. Respuesta exitosa
    const response = {
      success: true,
      message: 'Webhook Clerk funcionando',
      event: payload.type,
      userId: payload.data?.id,
      receivedAt: new Date().toISOString()
    };

    console.log('✅ Respuesta:', response);
    return Response.json(response);

  } catch (error) {
    console.error('💥 Error inesperado:', error.message);
    return Response.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}