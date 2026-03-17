"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/types/order";
import { ORDER_STATUSES, STATUS_LABELS, STATUS_COLORS } from "@/types/order";
import { formatAMD } from "@/types/cake";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Status step index for the progress bar
const STATUS_STEP = Object.fromEntries(
  ORDER_STATUSES.map((s, i) => [s, i])
) as Record<OrderStatus, number>;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrackPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [flash, setFlash]   = useState(false); // highlight on realtime update

  // ── Initial fetch ──────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.status === 404) {
          setError("Order not found. Please check your tracking link.");
          return;
        }
        if (!res.ok) throw new Error("Failed to load order");
        const { order } = await res.json();
        setOrder(order);
      } catch {
        setError("Could not load order. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  // ── Realtime ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel(`track-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
          setFlash(true);
          setTimeout(() => setFlash(false), 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="card-cream p-10 w-full max-w-md text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-cream-200 mx-auto" />
          <div className="h-4 bg-cream-200 rounded w-3/4 mx-auto" />
          <div className="h-3 bg-cream-200 rounded w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="card-cream p-10 max-w-md w-full text-center space-y-4">
          <div className="text-5xl">🎂</div>
          <p className="text-ink-700 font-medium">{error || "Order not found"}</p>
          <Link href="/" className="btn-gold inline-flex justify-center">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const step = STATUS_STEP[order.status];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = order.cake_config as any;

  return (
    <div className="min-h-screen bg-cream-50 pt-16">
      <div className="container-site py-12 max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs text-ink-400 font-mono mb-2">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
          <h1 className="font-display text-display-sm text-ink-900">
            Track your order
          </h1>
        </div>

        {/* Status card */}
        <div
          className={`card-cream p-6 space-y-6 transition-all duration-500 ${
            flash ? "ring-2 ring-gold-300 shadow-lg" : ""
          }`}
        >
          {/* Current status badge */}
          <div className="flex items-center justify-between">
            <span
              className={`text-sm font-semibold px-4 py-2 rounded-full ${STATUS_COLORS[order.status]}`}
            >
              {STATUS_LABELS[order.status]}
            </span>
            {flash && (
              <span className="text-xs text-gold-500 font-medium animate-pulse">
                Just updated!
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex justify-between">
              {ORDER_STATUSES.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      i <= step
                        ? "bg-gold-400 border-gold-400"
                        : "bg-white border-cream-200"
                    }`}
                  >
                    {i < step && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {i === step && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <p className={`text-[9px] font-medium text-center leading-tight ${
                    i <= step ? "text-gold-500" : "text-ink-300"
                  }`}>
                    {STATUS_LABELS[s]}
                  </p>
                </div>
              ))}
            </div>
            {/* Connecting line */}
            <div className="relative h-1 bg-cream-200 rounded-full -mt-8 mx-3 -z-10">
              <div
                className="absolute inset-y-0 left-0 bg-gold-400 rounded-full transition-all duration-700"
                style={{ width: `${(step / (ORDER_STATUSES.length - 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Order details */}
        <div className="mt-6 grid gap-4">

          {/* Delivery info */}
          <div className="card-cream p-5 space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-ink-400">
              Delivery
            </h2>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-ink-900">
                {formatDateTime(order.delivery_date)}
              </p>
              <p className="text-sm text-ink-600">{order.delivery_address}</p>
            </div>
          </div>

          {/* Cake summary */}
          <div className="card-cream p-5 space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-ink-400">
              Your Cake
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cream-200 flex items-center justify-center text-3xl flex-shrink-0">
                🎂
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-ink-900">
                  {cfg?.size} · {cfg?.tiers} tier{cfg?.tiers > 1 ? "s" : ""} ·{" "}
                  {cfg?.shape}
                </p>
                <p className="text-xs text-ink-500">
                  {cfg?.sponge} sponge · {cfg?.frosting} frosting
                </p>
                {cfg?.dedicationMessage && (
                  <p className="text-xs text-gold-500 italic">
                    "{cfg.dedicationMessage}"
                  </p>
                )}
                <p className="text-sm font-bold text-gold-400 mt-1">
                  {formatAMD(order.total_price)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="card-cream p-5 space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-ink-400">
              Contact
            </h2>
            <p className="text-sm text-ink-700">{order.customer_name}</p>
            <p className="text-sm text-ink-500">{order.customer_phone}</p>
          </div>

          {order.notes && (
            <div className="card-cream p-5 space-y-2">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-ink-400">
                Notes
              </h2>
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
