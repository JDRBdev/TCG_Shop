import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn("STRIPE_SECRET_KEY not set - Stripe checkout will fail in server route if called.");
}

const stripe = new Stripe(stripeSecret || "", { apiVersion: "2025-10-29.clover" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
  const items = body.items || [];
  const clerkId = body.clerkId || body.clerk_id || null;

    // Build line_items expected by Stripe Checkout
    const line_items = items.map((it: any) => {
      // Expect { name, price, quantity, currency, image } where price is a number in currency units (e.g. 9.99)
      const unit_amount = Math.round((it.price ?? 0) * 100);
      const productData: any = {
        name: it.name || "Product",
        metadata: { productId: it.id ?? "" },
      };
      if (it.image) productData.images = [it.image];

      return {
        price_data: {
          currency: it.currency || "eur",
          product_data: productData,
          unit_amount,
        },
        quantity: it.quantity || 1,
      };
    });

    const origin = new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata: clerkId ? { clerk_id: String(clerkId) } : undefined,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("Error creating Stripe Checkout session:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
