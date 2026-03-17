"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Order } from "@/types/order";
import { formatAMD } from "@/types/cake";

// ─── Driver View — /staff/delivery ───────────────────────────────────────────
// Mobile-optimised, high-contrast view for drivers.
// Shows only "ready" and "delivering" orders.
// Each card has a one-tap call button and a Yandex Maps deep link.

function yandexDeepLink(lat: number | null, lng: number | null, address: string): string {
  if (lat && lng) {
    return `yandexmaps://maps.yandex.ru/?pt=${lng},${lat}&z=12&l=map`;
  }
  // Fallback to browser Yandex Maps if no coords
  return `https://maps.yandex.ru/?text=${encodeURIComponent(address)}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
}

export default function DeliveryPage() {
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both ready and delivering
      const [r1, r2] = await Promise.all([
        fetch("/api/orders?status=ready"),
        fetch("/api/orders?status=delivering"),
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

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Live updates
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel  = supabase
      .channel("driver-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            const updated = payload.new as Order;
            setOrders((prev) => {
              if (updated.status === "ready" || updated.status === "delivering") {
                const exists = prev.find((o) => o.id === updated.id);
                if (exists) return prev.map((o) => (o.id === updated.id ? updated : o));
                return [...prev, updated].sort(
                  (a, b) => new Date(a.delivery_date).getTime() - new Date(b.delivery_date).getTime()
                );
              }
              // Order moved out of ready/delivering — remove from list
              return prev.filter((o) => o.id !== updated.id);
            });
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function markDelivering(order: Order) {
    setUpdating(order.id);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "delivering" }),
    });
    setUpdating(null);
  }

  async function markDone(order: Order) {
    setUpdating(order.id);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
    setUpdating(null);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 px-4 py-5 flex items-center justify-between border-b border-gray-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Deliveries</h1>
          <p className="text-xs text-gray-400 mt-0.5">{orders.length} active run{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl font-medium active:scale-95 transition-transform"
        >
          Refresh
        </button>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-900 rounded-2xl h-44 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">🚗</p>
            <p className="text-lg font-medium">No deliveries right now</p>
            <p className="text-sm mt-1">Pull to refresh</p>
          </div>
        ) : (
          orders.map((order) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cfg = order.cake_config as any;
            const isDelivering = order.status === "delivering";
            const busy = updating === order.id;

            return (
              <div
                key={order.id}
                className={`rounded-2xl overflow-hidden border-2 ${
                  isDelivering ? "border-orange-500 bg-gray-900" : "border-green-500 bg-gray-900"
                }`}
              >
                {/* Status banner */}
                <div
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${
                    isDelivering ? "bg-orange-500" : "bg-green-500"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  {isDelivering ? "On Route" : "Ready for Pickup"}
                </div>

                <div className="p-4 space-y-4">
                  {/* Time */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tabular-nums">{formatTime(order.delivery_date)}</span>
                    <span className="text-gray-400 text-sm">{formatDate(order.delivery_date)}</span>
                  </div>

                  {/* Cake summary */}
                  <p className="text-sm text-gray-300">
                    {cfg?.size} · {cfg?.tiers}T {cfg?.shape} · <span className="text-yellow-400 font-semibold">{formatAMD(order.total_price)}</span>
                  </p>

                  {/* Customer + Call button */}
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-base">{order.customer_name}</p>
                      <p className="text-gray-400 text-sm">{order.customer_phone}</p>
                    </div>
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="flex-shrink-0 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-3 rounded-2xl text-sm active:scale-95 transition-transform flex items-center gap-2"
                    >
                      📞 Call
                    </a>
                  </div>

                  {/* Address + Map button */}
                  <div className="flex items-start gap-3">
                    <p className="text-sm text-gray-300 flex-1 leading-snug">{order.delivery_address}</p>
                    <a
                      href={yandexDeepLink(order.delivery_lat, order.delivery_lng, order.delivery_address)}
                      className="flex-shrink-0 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-2xl text-sm active:scale-95 transition-transform flex items-center gap-1.5"
                    >
                      🗺 Navigate
                    </a>
                  </div>

                  {/* Notes */}
                  {order.notes && (
                    <p className="text-xs text-yellow-300 bg-yellow-900/30 rounded-xl px-3 py-2 leading-relaxed">
                      📝 {order.notes}
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {!isDelivering && (
                      <button
                        onClick={() => markDelivering(order)}
                        disabled={busy}
                        className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-2xl text-sm active:scale-95 transition-transform disabled:opacity-60 col-span-2"
                      >
                        {busy ? "Updating…" : "🚗 Start Delivery"}
                      </button>
                    )}
                    {isDelivering && (
                      <button
                        onClick={() => markDone(order)}
                        disabled={busy}
                        className="bg-white text-gray-900 font-bold py-4 rounded-2xl text-sm active:scale-95 transition-transform disabled:opacity-60 col-span-2"
                      >
                        {busy ? "Updating…" : "✅ Mark Delivered"}
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
