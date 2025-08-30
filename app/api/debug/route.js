// app/api/debug/route.js
export async function GET() {
  console.log('✅ Debug endpoint llamado');
  return Response.json({ 
    message: 'Debug funcionando',
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV
  });
}

export async function POST(request) {
  const body = await request.json();
  console.log('✅ Debug POST:', body);
  return Response.json({ received: true, body });
}