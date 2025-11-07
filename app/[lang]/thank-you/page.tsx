import React from "react";
import Link from "next/link";

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { getDictionary } from "../dictionaries";
import { fetchBaseProducts } from "../../data/products";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "";

export default async function ThankYouPage({ params, searchParams }: { params: { lang: string }, searchParams?: { session_id?: string } }) {
  const locale = (params?.lang || "en") as "en" | "es" | "fr" | "de";
  const dict = await getDictionary(locale)
  const sessionId = searchParams?.session_id;

  // Shared wrapper to match site styles: gradient background and centered card.
  // Add `text-slate-800` so text inside the card is dark and readable even if a parent
  // global text color is different.
  const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-slate-800">{children}</div>
      </main>
    </div>
  );

  if (!sessionId) {
    return (
      <CardWrapper>
        <h1 className="text-3xl font-bold mb-4">{dict.thankYou.title}</h1>
        <p className="mb-6">{dict.thankYou.noSession}</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">{dict.thankYou.backHome}</Link>
      </CardWrapper>
    );
  }

  if (!stripeSecret) {
    return (
      <CardWrapper>
        <h1 className="text-3xl font-bold mb-4">{dict.thankYou.title}</h1>
        <p className="mb-6">{dict.thankYou.noStripe}</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">{dict.thankYou.backHome}</Link>
      </CardWrapper>
    );
  }

  try {
    const stripe = new Stripe(stripeSecret, { apiVersion: "2025-10-29.clover" });
    // Expand line_items and nested price.product so we can access product images
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["line_items", "line_items.data.price.product"] });

    // If the session is paid and includes a clerk_id in metadata, try to clear the user's persisted cart
    try {
      const clerkId = session.metadata?.clerk_id || session.metadata?.clerkId || null;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || null;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || null;
      if (session.payment_status === 'paid' && clerkId && supabaseUrl && supabaseServiceKey) {
        try {
          const sb = createClient(supabaseUrl, supabaseServiceKey);
          const { error } = await sb.from('user_carts').delete().eq('clerk_id', String(clerkId));
          if (error) console.error('Error clearing persisted cart on thank-you page:', error);
          else console.log('Cleared persisted cart for clerk_id via thank-you page:', clerkId);
        } catch (err) {
          console.error('Error running Supabase delete on thank-you page:', err);
        }
      }
    } catch (err) {
      console.error('Error attempting server-side cart clear on thank-you:', err);
    }

    const amount = (session.amount_total ?? 0) as number;
    const currency = (session.currency ?? "eur") as string;

    // Collect product IDs (if any) from Stripe product metadata so we can load localized names
    const productIds: string[] = []
    session.line_items?.data.forEach((li: any) => {
      const prod = li.price?.product
      const metaId = prod && typeof prod === 'object' ? (prod.metadata?.productId || prod.metadata?.productID || prod.metadata?.id) : undefined
      if (metaId) productIds.push(metaId)
    })

    let localizedNames: Record<string, string> = {}
    if (productIds.length) {
      // fetchBaseProducts accepts arrays for filters via `.in`
      const prods = await fetchBaseProducts({ locale, filters: { id: productIds }, limit: productIds.length })
      prods.forEach((p) => (localizedNames[p.id] = p.name))
    }

    return (
      <CardWrapper>
  {/* Cart clearing is handled server-side by the Stripe webhook; no client component needed. */}
        <h1 className="text-3xl font-bold mb-2 text-slate-900">{dict.thankYou.title}</h1>
        <p className="text-sm text-slate-700 mb-6">{dict.thankYou.sessionId} {session.id}</p>

        <div className="mb-6 p-4 bg-slate-50 rounded">
          <p className="mb-2 text-slate-700"><strong>{dict.thankYou.paymentStatus}</strong> {session.payment_status === 'paid' ? dict.thankYou.paid : session.payment_status}</p>
          <p className="mb-2 text-slate-700"><strong>{dict.thankYou.total}</strong> {(amount / 100).toFixed(2)} {currency.toUpperCase()}</p>
          <p className="mb-2 text-slate-700"><strong>{dict.thankYou.method}</strong> {session.payment_method_types?.map((m: string) => (m === 'card' ? dict.thankYou.card : m)).join(', ')}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-slate-900">{dict.thankYou.items}</h2>
          <div className="space-y-3">
            {session.line_items?.data.map((li: any) => (
              <div key={li.id} className="flex items-center gap-4 bg-white p-3 rounded shadow-sm">
                {li.price?.product && typeof li.price.product === 'object' && (li.price.product as any).images?.[0] ? (
                  <img src={(li.price.product as any).images[0]} className="w-16 h-16 object-cover rounded" alt={li.description || ""} />
                ) : null}
                <div className="flex-1">
                  {/* Prefer localized product name when we have a productId mapping, fall back to Stripe description/name */}
                  <div className="font-medium text-slate-900">{(() => {
                    const prod = li.price?.product
                    const metaId = prod && typeof prod === 'object' ? (prod.metadata?.productId || prod.metadata?.productID || prod.metadata?.id) : undefined
                    return (metaId && localizedNames[metaId]) || li.description || (prod && typeof prod === 'object' ? (prod as any).name : undefined) || dict.thankYou.items
                  })()}</div>
                  <div className="text-sm text-slate-600">{`${dict.thankYou.items}: ${li.quantity}`}</div>
                </div>
                <div className="text-right font-semibold text-slate-800">{((li.amount_total ?? 0) / 100).toFixed(2)} {currency.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </section>

        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">{dict.thankYou.backHome}</Link>
      </CardWrapper>
    );
  } catch (err) {
    console.error("Error fetching Stripe session:", err);
    return (
      <CardWrapper>
        <h1 className="text-3xl font-bold mb-4">Gracias por tu compra</h1>
        <p className="mb-6">La compra se completó, pero no pudimos obtener los detalles de la sesión.</p>
        <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">Volver al inicio</Link>
      </CardWrapper>
    );
  }
}
