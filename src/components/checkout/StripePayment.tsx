"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Load Stripe once (outside component to avoid re-creating)
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

// ─── Props ────────────────────────────────────────────────────────────────────
interface StripePaymentProps {
  amountAMD: number;
  contactData: { name: string; phone: string; email: string; address: string };
  onSuccess: (paymentIntentId: string) => void;
  submitLabel: string;
  processingLabel: string;
}

// ─── Outer wrapper — fetches clientSecret, provides Elements context ──────────
export default function StripePayment(props: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!stripePromise) return;
    setClientSecret(null);
    setFetchError("");

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: props.amountAMD,            // AMD is zero-decimal in Stripe
        currency: "amd",
        metadata: {
          customer_name:  props.contactData.name,
          customer_phone: props.contactData.phone,
          customer_email: props.contactData.email,
          delivery_address: props.contactData.address,
        },
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setFetchError(data.error);
        else setClientSecret(data.clientSecret);
      })
      .catch(() => setFetchError("Network error. Please try again."));
  }, [props.amountAMD]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!stripePromise) return null; // Stripe not configured — caller shows fallback

  if (fetchError) {
    return <p className="text-xs text-red-500">{fetchError}</p>;
  }

  if (!clientSecret) {
    return (
      <div className="h-36 flex items-center justify-center">
        <span className="text-xs text-ink-400 animate-pulse">Loading payment…</span>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#B8862A",
            colorBackground: "#FFFDF9",
            colorText: "#1A1410",
            colorDanger: "#DC2626",
            fontFamily: "Inter, system-ui, sans-serif",
            borderRadius: "1rem",
            spacingUnit: "4px",
          },
        },
      }}
    >
      <PaymentForm {...props} />
    </Elements>
  );
}

// ─── Inner form — uses Stripe hooks (must be inside <Elements>) ───────────────
function PaymentForm({
  onSuccess,
  submitLabel,
  processingLabel,
}: StripePaymentProps) {
  const stripe   = useStripe();
  const elements = useElements();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed.");
      setLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setError("Unexpected payment status. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ["google_pay", "apple_pay", "card"],
        }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-gold w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? processingLabel : submitLabel}
      </button>
    </form>
  );
}
