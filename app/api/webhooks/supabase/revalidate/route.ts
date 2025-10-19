// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("🔔 Webhook recibido de Supabase:", body)

    // Revalida la ruta de productos
    revalidatePath('/productos')
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    console.error('❌ Error al revalidar:', error)
    return NextResponse.json({ revalidated: false })
  }
}
