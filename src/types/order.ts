import type { CakeConfig } from "./cake";

// ─── Status ──────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  "pending",
  "awaiting_payment",
  "confirmed",
  "in_progress",
  "ready",
  "delivering",
  "done",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:          "Pending Review",
  awaiting_payment: "Awaiting Payment",
  confirmed:        "Confirmed",
  in_progress:      "In Progress",
  ready:            "Ready",
  delivering:       "Delivering",
  done:             "Done",
  cancelled:        "Cancelled",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:          "bg-amber-100 text-amber-800",
  awaiting_payment: "bg-blue-100 text-blue-800",
  confirmed:        "bg-indigo-100 text-indigo-800",
  in_progress:      "bg-purple-100 text-purple-800",
  ready:            "bg-green-100 text-green-800",
  delivering:       "bg-orange-100 text-orange-800",
  done:             "bg-gray-100 text-gray-600",
  cancelled:        "bg-red-100 text-red-600",
};

// Staff dashboard manual transitions.
// pending → awaiting_payment is normally done by Telegram bot [Approve].
// awaiting_payment → confirmed is normally done by Stripe webhook.
// Manual buttons are kept as emergency overrides only.
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:          ["awaiting_payment", "cancelled"],
  awaiting_payment: ["confirmed", "cancelled"],
  confirmed:        ["in_progress"],
  in_progress:      ["ready"],
  ready:            ["delivering"],
  delivering:       ["done"],
  done:             [],
  cancelled:        [],
};

// Statuses that count toward the daily 15-cake capacity.
// Ghost slots (awaiting_payment past expiry) are excluded by the query itself.
export const CAPACITY_STATUSES: OrderStatus[] = [
  "awaiting_payment",
  "confirmed",
  "in_progress",
  "ready",
  "delivering",
  "done",
];

// ─── Order ───────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  cake_config: CakeConfig;
  delivery_address: string;
  delivery_lat: number | null;
  delivery_lng: number | null;
  delivery_date: string; // ISO 8601
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
  total_price: number; // AMD integer
  complexity_score: number;
  payment_expires_at: string | null; // ISO 8601 — set when Telegram approves
  stripe_session_id: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Customer (CRM) ──────────────────────────────────────────────────────────

export type LoyaltyTier = "standard" | "loyal" | "vip";

export interface Customer {
  phone: string;
  name: string;
  order_count: number;
  loyalty_tier: LoyaltyTier;
  first_order_at: string;
  last_order_at: string;
}

// ─── API payloads ─────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  cake_config: CakeConfig;
  delivery_address: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_date: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  notes?: string;
  total_price: number;
  complexity_score?: number;
}

export interface UpdateOrderPayload {
  status: OrderStatus;
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
