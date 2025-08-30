// app/api/test-env/route.js
export async function GET() {
  const envVars = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌',
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? '✅' : '❌',
    NODE_ENV: process.env.NODE_ENV
  };

  return Response.json(envVars);
}