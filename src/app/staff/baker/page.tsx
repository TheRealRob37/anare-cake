"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Order } from "@/types/order";
import StaffNav from "@/components/staff/StaffNav";

// ─── Baker view — /staff/baker ────────────────────────────────────────────────
// Shows confirmed orders that need baking.
// Displays: size, tiers, sponge, fillings (the flavour/base specs).
// Hides: decor, text, address — not the baker's concern.

function formatDelivery(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function BakerPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/orders?status=confirmed"),
        fetch("/api/orders?status=in_progress"),
      ]);
      const [d1, d2] = await Promise.all([r1.json(), r2.json()]);
      const all: Order[] = [...(d1.orders ?? []), ...(d2.orders ?? [])];
      all.sort(
        (a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime()
      );
      setOrders(all);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Live updates
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("baker-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders]);

  async function markInProgress(id: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "in_progress" }),
    });
    fetchOrders();
  }

  async function markReady(id: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ready" }),
    });
    fetchOrders();
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl text-ink-900">👩‍🍳 Baker Station</h1>
            <p className="text-xs text-ink-400 mt-0.5">Confirmed &amp; in-progress orders</p>
          </div>
          <StaffNav />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="card-cream p-5 h-32 animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="card-cream p-12 text-center text-ink-400 text-sm">
            No cakes to bake right now. 🎉
          </div>
        ) : (
          orders.map((order) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cfg = order.cake_config as any;
            const isInProgress = order.status === "in_progress";

            return (
              <div key={order.id} className={`card-cream p-5 border-l-4 ${isInProgress ? "border-purple-400" : "border-blue-400"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isInProgress ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {isInProgress ? "🔥 Baking" : "✅ Start"}
                      </span>
                      <span className="text-xs text-ink-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-xs text-ink-500">Due: <strong>{formatDelivery(order.delivery_date)}</strong></span>
                    </div>

                    {/* Cake specs — what the baker needs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Spec label="Size" value={cfg?.size ?? "?"} />
                      <Spec label="Tiers" value={`${cfg?.tiers ?? "?"}T · ${cfg?.shape ?? "?"}`} />
                      <Spec label="Sponge" value={cfg?.sponge ?? "?"} />
                      <Spec label="Fillings" value={(cfg?.fillings ?? []).join(" + ") || "none"} />
                    </div>

                    {order.notes && (
                      <p className="text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                        📝 {order.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {!isInProgress && (
                      <button
                        onClick={() => markInProgress(order.id)}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                      >
                        Start Baking →
                      </button>
                    )}
                    {isInProgress && (
                      <button
                        onClick={() => markReady(order.id)}
                        className="text-xs font-semibold px-4 py-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                      >
                        Mark Ready ✓
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream-100 rounded-xl px-3 py-2">
      <p className="text-[9px] text-ink-400 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-semibold text-ink-900 mt-0.5 capitalize">{value}</p>
    </div>
  );
}
