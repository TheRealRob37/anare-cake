"use client";

import { useEffect, useState, useId } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/types/order";
import { ORDER_STATUSES, STATUS_LABELS, STATUS_COLORS } from "@/types/order";
import { formatAMD } from "@/types/cake";
import { motion, AnimatePresence } from "framer-motion";
import { EASE_SMOOTH } from "@/lib/motion";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "long", day: "2-digit", month: "long",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatCardNumber(raw: string) {
  return raw.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

const STATUS_STEP = Object.fromEntries(
  ORDER_STATUSES.map((s, i) => [s, i])
) as Record<OrderStatus, number>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrackPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [flash, setFlash]     = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.status === 404) { setError("Order not found. Please check your tracking link."); return; }
        if (!res.ok) throw new Error("Failed to load order");
        const { order } = await res.json();
        setOrder(order);
      } catch {
        setError("Could not load order. Please try again later.");
      } finally { setLoading(false); }
    }
    if (id) load();
  }, [id]);

  // ── Realtime ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    const supabase = getSupabaseBrowserClient();
    const channel  = supabase
      .channel(`track-${id}`)
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` },
        (payload) => {
          setOrder(payload.new as Order);
          setFlash(true);
          setTimeout(() => setFlash(false), 2500);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="card-cream p-10 w-full max-w-md text-center space-y-4 animate-pulse">
        <div className="w-16 h-16 rounded-full bg-cream-200 mx-auto" />
        <div className="h-4 bg-cream-200 rounded w-3/4 mx-auto" />
        <div className="h-3 bg-cream-200 rounded w-1/2 mx-auto" />
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="card-cream p-10 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">🎂</div>
        <p className="text-ink-700 font-medium">{error || "Order not found"}</p>
        <Link href="/" className="btn-gold inline-flex justify-center">Back to home</Link>
      </div>
    </div>
  );

  const step = STATUS_STEP[order.status];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg  = order.cake_config as any;

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      <div className="container-site py-12 max-w-2xl">

        <div className="mb-8">
          <p className="text-xs text-ink-400 font-mono mb-2">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <h1 className="font-display text-display-sm text-ink-900">Track your order</h1>
        </div>

        {/* Status card with progress bar */}
        <div className={`card-cream p-6 space-y-6 transition-all duration-500 ${flash ? "ring-2 ring-gold-300 shadow-glow" : ""}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold px-4 py-2 rounded-full ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
            {flash && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-gold-400 font-medium"
              >
                ✓ Just updated!
              </motion.span>
            )}
          </div>

          {/* Progress */}
          <div className="relative pt-2">
            <div className="flex justify-between mb-6">
              {ORDER_STATUSES.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                    i < step  ? "bg-gold-400 border-gold-400" :
                    i === step ? "bg-white border-gold-400 ring-2 ring-gold-200" :
                                 "bg-white border-cream-200"
                  }`}>
                    {i < step && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {i === step && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                  </div>
                  <p className={`text-[9px] font-medium text-center leading-tight ${i <= step ? "text-gold-500" : "text-ink-300"}`}>
                    {STATUS_LABELS[s]}
                  </p>
                </div>
              ))}
            </div>
            {/* Connecting line */}
            <div className="absolute top-5 left-3 right-3 h-0.5 bg-cream-200 -z-10">
              <div
                className="h-full bg-gold-400 transition-all duration-700 rounded-full"
                style={{ width: `${(step / (ORDER_STATUSES.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Status message */}
          <p className="text-xs text-ink-500 text-center leading-relaxed">
            {order.status === "pending"     && "⏳ Your order is being reviewed by our team…"}
            {order.status === "confirmed"   && "✅ Order confirmed! Please complete your payment below."}
            {order.status === "in_progress" && "👩‍🍳 Your cake is being baked with love!"}
            {order.status === "ready"       && "📦 Your cake is ready and waiting for delivery!"}
            {order.status === "delivering"  && "🚗 Your cake is on its way to you!"}
            {order.status === "done"        && "🎉 Delivered! Enjoy every slice!"}
          </p>
        </div>

        {/* Payment section — only when confirmed */}
        <AnimatePresence>
          {order.status === "confirmed" && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: EASE_SMOOTH }}
              className="mt-6"
            >
              <PaymentSection order={order} onPaid={(updated) => setOrder(updated)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order details */}
        <div className="mt-6 grid gap-4">

          <div className="card-cream p-5 space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-ink-400">Delivery</h2>
            <p className="text-sm font-semibold text-ink-900">{formatDateTime(order.delivery_date)}</p>
            <p className="text-sm text-ink-600">{order.delivery_address}</p>
          </div>

          <div className="card-cream p-5 space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-ink-400">Your Cake</h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cream-200 flex items-center justify-center text-3xl flex-shrink-0">🎂</div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-ink-900">
                  {cfg?.size} · {cfg?.tiers} tier{cfg?.tiers > 1 ? "s" : ""} · {cfg?.shape}
                </p>
                <p className="text-xs text-ink-500">{cfg?.sponge} sponge · {cfg?.frosting} frosting</p>
                {cfg?.dedicationMessage && (
                  <p className="text-xs text-gold-400 italic">"{cfg.dedicationMessage}"</p>
                )}
                <p className="text-sm font-bold text-gold-400 mt-1">{formatAMD(order.total_price)}</p>
              </div>
            </div>
          </div>

          <div className="card-cream p-5 space-y-2">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-ink-400">Contact</h2>
            <p className="text-sm text-ink-700">{order.customer_name}</p>
            <p className="text-sm text-ink-500">{order.customer_phone}</p>
          </div>

          {order.notes && (
            <div className="card-cream p-5 space-y-2">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-ink-400">Notes</h2>
              <p className="text-sm text-ink-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-ink-400 hover:text-gold-400 transition-colors">
            ← Back to Anare Cake
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Payment section ──────────────────────────────────────────────────────────

type CardBrand = "visa" | "mastercard" | "arca" | "unknown";
function detectBrand(num: string): CardBrand {
  const n = num.replace(/\s/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  if (/^9/.test(n)) return "arca";
  return "unknown";
}

type PayMethod = "card" | "gpay" | "applepay";

function PaymentSection({ order, onPaid }: { order: Order; onPaid: (updated: Order) => void }) {
  const uid = useId();
  const [payMethod, setPayMethod]   = useState<PayMethod>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv]       = useState("");
  const [cardName, setCardName]     = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [paid, setPaid]             = useState(false);

  const brand = detectBrand(cardNumber);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (payMethod === "card" && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardName.trim())) {
      setError("Please fill in all card details.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`/api/orders/${order.id}/pay`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Payment failed."); return; }
      setPaid(true);
      onPaid(data.order);
    } catch {
      setError("Network error. Please try again.");
    } finally { setLoading(false); }
  }

  if (paid) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card-cream p-6 text-center space-y-3 border-gold-200"
    >
      <div className="text-4xl">🎉</div>
      <p className="font-semibold text-ink-900">Payment received!</p>
      <p className="text-xs text-ink-500">Your cake is now being prepared. We'll keep you updated here.</p>
    </motion.div>
  );

  return (
    <div className="card-cream p-6 space-y-5 border-2 border-gold-200">
      <div>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gold-400 mb-1">Complete Payment</h2>
        <p className="text-xs text-ink-500">Your order is confirmed. Pay to start baking!</p>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between bg-cream-100 rounded-2xl px-5 py-3">
        <span className="text-sm text-ink-700">Total</span>
        <span className="font-display text-xl font-bold text-gold-400">{formatAMD(order.total_price)}</span>
      </div>

      {/* Method tabs */}
      <div className="flex gap-2">
        {(["card", "gpay", "applepay"] as PayMethod[]).map((m) => (
          <button
            key={m} type="button" onClick={() => setPayMethod(m)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 text-xs font-medium transition-all duration-200 ${
              payMethod === m ? "border-gold-300 bg-gold-100 text-ink-900" : "border-cream-200 text-ink-500 hover:border-gold-200"
            }`}
          >
            {m === "card"     && "💳 Card"}
            {m === "gpay"     && "G Pay"}
            {m === "applepay" && " Pay"}
          </button>
        ))}
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        {payMethod === "card" && (
          <>
            {/* Accepted cards */}
            <div className="flex items-center gap-3 text-xs text-ink-400">
              <span className="font-mono font-bold text-blue-700 text-sm">VISA</span>
              <span className="w-8 h-5 rounded inline-flex items-center justify-center bg-gradient-to-r from-red-500 to-yellow-400 text-[8px] font-bold text-white">MC</span>
              <span className="font-bold text-blue-900 text-sm">ARCA</span>
              {brand !== "unknown" && <span className="ml-auto text-[10px] text-gold-400 font-medium capitalize">{brand} detected</span>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`${uid}-cn`} className="block text-xs font-medium text-ink-700">Card number</label>
              <input id={`${uid}-cn`} value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000" inputMode="numeric"
                className="field-input font-mono tracking-widest" maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor={`${uid}-exp`} className="block text-xs font-medium text-ink-700">Expiry</label>
                <input id={`${uid}-exp`} value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY" inputMode="numeric" className="field-input font-mono" maxLength={5} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`${uid}-cvv`} className="block text-xs font-medium text-ink-700">CVV</label>
                <input id={`${uid}-cvv`} value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="•••" type="password" inputMode="numeric"
                  className="field-input font-mono" maxLength={4} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${uid}-cname`} className="block text-xs font-medium text-ink-700">Cardholder name</label>
              <input id={`${uid}-cname`} value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                placeholder="NAME ON CARD"
                className="field-input font-mono uppercase tracking-widest" />
            </div>
          </>
        )}

        {(payMethod === "gpay" || payMethod === "applepay") && (
          <p className="text-xs text-ink-500 bg-cream-100 rounded-2xl px-4 py-3 text-center">
            {payMethod === "gpay" ? "Google" : "Apple"} Pay will open when you click Pay.
          </p>
        )}

        {error && (
          <p className="text-xs text-blush-400 font-medium">{error}</p>
        )}

        <button
          type="submit" disabled={loading}
          className="btn-gold w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Processing…" : `Pay ${formatAMD(order.total_price)}`}
        </button>
      </form>
    </div>
  );
}
