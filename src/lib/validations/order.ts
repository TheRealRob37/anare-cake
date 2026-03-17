import { z } from "zod";
import { ORDER_STATUSES } from "@/types/order";

// ─── Shared ───────────────────────────────────────────────────────────────────

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

// ─── Create order ─────────────────────────────────────────────────────────────

export const CreateOrderSchema = z.object({
  // Zod v4: z.record() requires (keySchema, valueSchema)
  cake_config: z.record(z.string(), z.unknown()),
  delivery_address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters"),
  delivery_lat: z.number().optional(),
  delivery_lng: z.number().optional(),
  delivery_date: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), "delivery_date must be a valid datetime")
    .refine((v) => new Date(v) > new Date(), "Delivery date must be in the future"),
  customer_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  customer_phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Invalid phone number"),
  customer_email: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Invalid email address")
    .optional(),
  notes: z.string().trim().max(500).optional(),
  total_price: z
    .number()
    .int("total_price must be an integer")
    .positive("total_price must be positive"),
  complexity_score: z.number().int().min(0).max(10).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// ─── Update order ─────────────────────────────────────────────────────────────

export const UpdateOrderSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;

// ─── Query filters ────────────────────────────────────────────────────────────

export const OrdersQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD")
    .optional(),
  status: z.enum(ORDER_STATUSES).optional(),
});

export type OrdersQuery = z.infer<typeof OrdersQuerySchema>;
