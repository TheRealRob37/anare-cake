import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrderByStripeSession, updateOrderStatus } from "@/services/orders";
import { sendOrderConfirmedEmail } from "@/lib/email";

// ─── Stripe Webhook ───────────────────────────────────────────────────────────
// POST /api/webhooks/stripe
//
// This is the ONLY authoritative source of payment confirmation.
// The old /api/orders/:id/pay route is deprecated — it cannot be trusted
// because it relies on the client reporting success.
//
// Setup in Stripe Dashboard → Developers → Webhooks:
//   Endpoint URL: https://yourdomain.com/api/webhooks/stripe
//   Events to listen: checkout.session.completed, payment_intent.succeeded
//
// Set STRIPE_WEBHOOK_SECRET from the signing secret shown in that panel.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
});

// Next.js App Router: disable body parsing — Stripe needs the raw body
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Read raw body for signature verification
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  // ── Handle events ──────────────────────────────────────────────────────────

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      // Session completed but not yet paid (e.g. bank transfer) — skip
      return NextResponse.json({ received: true });
    }

    const sessionId = session.id;
    const order = await getOrderByStripeSession(sessionId);

    if (!order) {
      console.error(`[stripe/webhook] No order found for session ${sessionId}`);
      // Return 200 to prevent Stripe from retrying — this is not Stripe's fault
      return NextResponse.json({ received: true });
    }

    if (order.status !== "awaiting_payment") {
      // Already processed or cancelled — idempotent, ignore
      return NextResponse.json({ received: true });
    }

    // Move order to confirmed — baking can begin
    const confirmed = await updateOrderStatus(order.id, "confirmed");
    sendOrderConfirmedEmail(confirmed);

    console.log(`[stripe/webhook] Order ${order.id} confirmed via Stripe session ${sessionId}`);
  }

  return NextResponse.json({ received: true });
}
