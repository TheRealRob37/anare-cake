"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Order, OrderStatus } from "@/types/order";
import {
  ORDER_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_TRANSITIONS,
} from "@/types/order";
import { formatAMD } from "@/types/cake";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [orders, setOrders]             = useState<Order[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [filterDate, setFilterDate]     = useState(todayISO());
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [updating, setUpdating]         = useState<string | null>(null);
  const [connected, setConnected]       = useState(false);

  async function handleLogout() {
    await fetch("/api/staff/login", { method: "DELETE" });
    startTransition(() => router.replace("/staff/login"));
  }

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.set("date", filterDate);
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) throw new Error(await res.text());
      const { orders } = await res.json();
      setOrders(orders);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Realtime ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel("staff-orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newOrder = payload.new as Order;
            setOrders((prev) => {
              // Only add if it matches current date filter
              if (filterDate) {
                const orderDay = newOrder.delivery_date.slice(0, 10);
                if (orderDay !== filterDate) return prev;
              }
              return [newOrder, ...prev].sort(
                (a, b) =>
                  new Date(a.delivery_date).getTime() -
                  new Date(b.delivery_date).getTime()
              );
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Order;
            setOrders((prev) =>
              prev.map((o) => (o.id === updated.id ? updated : o))
            );
          }
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filterDate]);

  // ── Update status ──────────────────────────────────────────────────────────

  async function handleStatusUpdate(order: Order, status: OrderStatus) {
    setUpdating(order.id);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Update failed");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const activeCount = orders.filter((o) => o.status !== "done").length;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-ink-900">Staff Dashboard</h1>
            <p className="text-xs text-ink-400 mt-0.5">
              {activeCount} active order{activeCount !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
                connected
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                }`}
              />
              {connected ? "Live" : "Connecting…"}
            </span>
            <button
              onClick={fetchOrders}
              className="text-xs text-ink-500 hover:text-gold-400 transition-colors px-3 py-1.5 border border-cream-200 rounded-xl"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-blush-400 hover:text-blush-400 transition-colors px-3 py-1.5 border border-blush-200 rounded-xl"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs text-ink-500 font-medium">Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="field-input text-sm py-2 px-3 rounded-xl w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-ink-500 font-medium">Status</label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as OrderStatus | "all")
              }
              className="field-input text-sm py-2 px-3 rounded-xl w-auto"
            >
              <option value="all">All</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status counts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ORDER_STATUSES.map((s) => {
            const count = orders.filter((o) => o.status === s).length;
            return (
              <div
                key={s}
                className="card-cream p-3 text-center cursor-pointer hover:border-gold-300 transition-colors"
                onClick={() =>
                  setFilterStatus((prev) => (prev === s ? "all" : s))
                }
              >
                <p className="text-2xl font-bold text-ink-900">{count}</p>
                <p className={`text-[11px] font-medium mt-1 px-2 py-0.5 rounded-full inline-block ${STATUS_COLORS[s]}`}>
                  {STATUS_LABELS[s]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Orders */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">
            {error}
          </p>
        )}

        {loading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-cream p-5 animate-pulse h-28" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="card-cream p-12 text-center text-ink-400 text-sm">
            No orders for this selection.
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={updating === order.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({
  order,
  onStatusUpdate,
  isUpdating,
}: {
  order: Order;
  onStatusUpdate: (order: Order, status: OrderStatus) => Promise<void>;
  isUpdating: boolean;
}) {
  const nextStatuses = STATUS_TRANSITIONS[order.status];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = order.cake_config as any;

  return (
    <div className="card-cream p-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-start">
      {/* Left: info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Customer */}
        <div>
          <p className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">
            Customer
          </p>
          <p className="text-sm font-semibold text-ink-900">
            {order.customer_name}
          </p>
          <p className="text-xs text-ink-500">{order.customer_phone}</p>
          {order.customer_email && (
            <p className="text-xs text-ink-400 truncate">{order.customer_email}</p>
          )}
        </div>

        {/* Delivery */}
        <div>
          <p className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">
            Delivery
          </p>
          <p className="text-sm font-semibold text-ink-900">
            {formatDateTime(order.delivery_date)}
          </p>
          <p className="text-xs text-ink-500 leading-snug">
            {order.delivery_address}
          </p>
        </div>

        {/* Cake */}
        <div>
          <p className="text-[10px] text-ink-400 uppercase tracking-widest mb-1">
            Cake
          </p>
          <p className="text-sm font-semibold text-ink-900">
            {cfg?.size ?? "—"} · {cfg?.tiers ?? "—"} tier · {cfg?.shape ?? "—"}
          </p>
          <p className="text-xs text-ink-500">
            {cfg?.sponge ?? ""} / {cfg?.frosting ?? ""}
          </p>
          <p className="text-xs text-gold-500 font-semibold mt-0.5">
            {formatAMD(order.total_price)}
          </p>
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex flex-row md:flex-col items-center md:items-end gap-3">
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${STATUS_COLORS[order.status]}`}
        >
          {STATUS_LABELS[order.status]}
        </span>

        <div className="flex flex-wrap gap-2 justify-end">
          {nextStatuses.map((next) => (
            <button
              key={next}
              onClick={() => onStatusUpdate(order, next)}
              disabled={isUpdating}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border-2 border-gold-300 bg-gold-50 text-gold-700 hover:bg-gold-100 transition-colors disabled:opacity-50"
            >
              {isUpdating ? "…" : `→ ${STATUS_LABELS[next]}`}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-ink-300 whitespace-nowrap">
          #{order.id.slice(0, 8).toUpperCase()}
        </p>
        <a
          href={`/track/${order.id}`}
          target="_blank"
          className="text-[10px] text-gold-400 hover:underline"
        >
          Track link ↗
        </a>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="col-span-full text-xs text-ink-500 bg-cream-100 rounded-xl px-4 py-2">
          <span className="font-medium">Note:</span> {order.notes}
        </div>
      )}
    </div>
  );
}
