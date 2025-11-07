"use client"

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

interface Item {
  id?: string;
  name: string;
  price: number; // units (e.g. 9.99)
  image?: string;
  quantity?: number;
  currency?: string;
}

interface Props {
  items: Item[];
  className?: string;
  label?: string;
  clerkId?: string | null;
}

export default function CheckoutButton({ items, className, label = "Pagar", clerkId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
  const body: any = { items };
  // include clerkId if provided (caller can pass null/undefined)
  if (clerkId) body.clerkId = clerkId;

      const res = await fetch(`/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.error) {
        console.error("Stripe session error:", json);
        setLoading(false);
        return;
      }

      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY not set");
        setLoading(false);
        return;
      }

      const stripe = await loadStripe(publishableKey);
      if (!stripe) {
        console.error("stripe.js failed to load");
        setLoading(false);
        return;
      }

      // If session url is provided (newer API) redirect there, else use redirectToCheckout
      if (json.url) {
        window.location.href = json.url;
        return;
      }

      await (stripe as any).redirectToCheckout({ sessionId: json.id });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className || "px-4 py-2 rounded bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold"}
    >
      {loading ? "Redirigiendo…" : label}
    </button>
  );
}
