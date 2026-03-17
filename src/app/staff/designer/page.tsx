"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Order } from "@/types/order";
import StaffNav from "@/components/staff/StaffNav";

// ─── Designer view — /staff/designer ─────────────────────────────────────────
// Shows confirmed & in-progress orders.
// Displays: frosting, toppings, dedication message, font — decor specs only.
// Hides: sponge, fillings, address.

function formatDelivery(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

const FONT_MAP: Record<string, string> = {
  dancing_script:  "Dancing Script",
  great_vibes:     "Great Vibes",
  pacifico:        "Pacifico",
  playfair_display: "Playfair Display",
  sacramento:      "Sacramento",
  pinyon_script:   "Pinyon Script",
};

export default function DesignerPage() {
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

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    const channel = supabase
      .channel("designer-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders]);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl text-ink-900">🎨 Designer Station</h1>
            <p className="text-xs text-ink-400 mt-0.5">Decoration specs for confirmed orders</p>
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
            No decoration work right now.
          </div>
        ) : (
          orders.map((order) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const cfg = order.cake_config as any;
            const toppings: string[] = cfg?.toppings ?? [];
            const fontName = FONT_MAP[cfg?.messageFont] ?? cfg?.messageFont ?? "Default";
            const dedicationMsg: string = cfg?.dedicationMessage ?? "";

            return (
              <div key={order.id} className="card-cream p-5 border-l-4 border-pink-400 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-100 text-pink-700">
                    🎨 Design
                  </span>
                  <span className="text-xs text-ink-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-xs text-ink-500">Due: <strong>{formatDelivery(order.delivery_date)}</strong></span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Spec label="Size & Shape" value={`${cfg?.size ?? "?"} · ${cfg?.shape ?? "?"}`} />
                  <Spec label="Frosting" value={cfg?.frosting ?? "?"} />
                  <Spec label="Tiers" value={`${cfg?.tiers ?? "?"}T`} />
                </div>

                {/* Toppings */}
                <div className="bg-cream-100 rounded-xl px-4 py-3">
                  <p className="text-[9px] text-ink-400 uppercase tracking-widest mb-2">Toppings</p>
                  {toppings.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {toppings.map((t: string) => (
                        <span key={t} className="text-xs bg-white px-2.5 py-1 rounded-full border border-cream-200 font-medium text-ink-700 capitalize">
                          {t.replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ink-400">No toppings</p>
                  )}
                </div>

                {/* Dedication message */}
                {dedicationMsg ? (
                  <div className="bg-gold-50 border border-gold-200 rounded-xl px-4 py-3">
                    <p className="text-[9px] text-gold-500 uppercase tracking-widest mb-1">Dedication message</p>
                    <p className="text-sm font-semibold text-ink-900">"{dedicationMsg}"</p>
                    <p className="text-[10px] text-ink-400 mt-1">Font: {fontName}</p>
                  </div>
                ) : (
                  <div className="bg-cream-100 rounded-xl px-4 py-3">
                    <p className="text-[9px] text-ink-400 uppercase tracking-widest">No dedication message</p>
                  </div>
                )}

                {order.notes && (
                  <p className="text-xs text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                    📝 {order.notes}
                  </p>
                )}
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
