import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2026-02-25.clover" });

  const { amount, currency = "amd", metadata } = await req.json() as {
    amount: number;
    currency?: string;
    metadata?: Record<string, string>;
  };

  if (!amount || amount < 50) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount), // AMD in minor units (tiyn) — AMD has no minor unit, Stripe uses *100 for AMD
    currency,
    automatic_payment_methods: { enabled: true },
    metadata: metadata ?? {},
  });

  return NextResponse.json({ clientSecret: paymentIntent.client_secret });
}
