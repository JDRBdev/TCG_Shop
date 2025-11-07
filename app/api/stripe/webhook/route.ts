import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Webhook secret (set this in production). If not set, the route will still attempt to parse
// but will not verify the signature (not recommended for prod).
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const stripeSecret = process.env.STRIPE_SECRET_KEY || "";

const stripe = new Stripe(stripeSecret || "", { apiVersion: "2025-10-29.clover" });

// Use the service role key on the server to perform deletes on user_carts
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export async function POST(req: Request) {
  try {
    const buf = await req.arrayBuffer();
    const rawBody = Buffer.from(buf);
    const sig = req.headers.get("stripe-signature") || "";

    let event: Stripe.Event;

    if (stripeWebhookSecret) {
      // Verify signature
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, stripeWebhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return new Response("Signature verification failed", { status: 400 });
      }
    } else {
      // No webhook secret configured: attempt to parse body as JSON (less secure)
      const text = rawBody.toString();
      try {
        event = JSON.parse(text) as Stripe.Event;
      } catch (err) {
        console.error("Failed to parse webhook body without verification:", err);
        return new Response("Invalid payload", { status: 400 });
      }
    }

    // Only handle checkout.session.completed for now
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const clerkId = session.metadata?.clerk_id || session.metadata?.clerkId || null;

      if (clerkId && supabaseUrl && supabaseServiceKey) {
        try {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          const { error } = await supabase.from("user_carts").delete().eq("clerk_id", clerkId);
          if (error) {
            console.error("Error clearing user_carts for clerk_id", clerkId, error);
          } else {
            console.log("Cleared user_carts for clerk_id", clerkId);
          }
        } catch (err) {
          console.error("Error clearing persisted cart in webhook:", err);
        }
      } else {
        console.warn("No clerk_id or Supabase credentials available; skipping cart clear");
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response("Webhook handler error", { status: 500 });
  }
}
