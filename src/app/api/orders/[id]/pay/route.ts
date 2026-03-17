import { NextResponse } from "next/server";

// POST /api/orders/:id/pay — DEPRECATED
//
// This endpoint is no longer the authoritative payment confirmation path.
// Payment is now confirmed exclusively via the Stripe webhook:
//   POST /api/webhooks/stripe
//
// The webhook uses stripe.webhooks.constructEvent() to verify the Stripe
// signature before moving an order from awaiting_payment → confirmed.
//
// Keeping this route alive returns a clear error so any old client code
// fails loudly rather than silently passing unverified payments through.

export async function POST() {
  return NextResponse.json(
    {
      error:
        "This endpoint is deprecated. Payment is confirmed automatically via the Stripe webhook. " +
        "Use POST /api/webhooks/stripe.",
    },
    { status: 410 } // 410 Gone
  );
}
