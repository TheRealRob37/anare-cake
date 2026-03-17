import type { CakeConfig } from "./cake";

// ─── Status ──────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "ready",
  "delivering",
  "done",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:     "Pending",
  confirmed:   "Confirmed",
  in_progress: "In Progress",
  ready:       "Ready",
  delivering:  "Delivering",
  done:        "Done",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:     "bg-amber-100 text-amber-800",
  confirmed:   "bg-blue-100 text-blue-800",
  in_progress: "bg-purple-100 text-purple-800",
  ready:       "bg-green-100 text-green-800",
  delivering:  "bg-orange-100 text-orange-800",
  done:        "bg-gray-100 text-gray-600",
};

// Next allowed transitions for each status
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:     ["confirmed"],
  confirmed:   ["in_progress"],
  in_progress: ["ready"],
  ready:       ["delivering"],
  delivering:  ["done"],
  done:        [],
};

// ─── Order ───────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  cake_config: CakeConfig;
  delivery_address: string;
  delivery_date: string; // ISO 8601
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
  total_price: number; // AMD integer
  created_at: string;
  updated_at: string;
}

// ─── API payloads ─────────────────────────────────────────────────────────────

export interface CreateOrderPayload {
  cake_config: CakeConfig;
  delivery_address: string;
  delivery_date: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  notes?: string;
  total_price: number;
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
