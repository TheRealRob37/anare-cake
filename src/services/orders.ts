import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Order, OrderStatus } from "@/types/order";
import type { CreateOrderInput, OrdersQuery } from "@/lib/validations/order";

const MAX_ORDERS_PER_SLOT = 3; // max orders accepted per 1-hour window

// ─── Slot availability ────────────────────────────────────────────────────────

export async function countOrdersInHourSlot(deliveryDate: Date): Promise<number> {
  const supabase = getSupabaseServerClient();

  const slotStart = new Date(deliveryDate);
  slotStart.setMinutes(0, 0, 0);

  const slotEnd = new Date(slotStart);
  slotEnd.setHours(slotEnd.getHours() + 1);

  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("delivery_date", slotStart.toISOString())
    .lt("delivery_date", slotEnd.toISOString())
    .neq("status", "done");

  if (error) throw new Error(`Slot check failed: ${error.message}`);

  return count ?? 0;
}

export async function isSlotAvailable(deliveryDate: Date): Promise<boolean> {
  const count = await countOrdersInHourSlot(deliveryDate);
  return count < MAX_ORDERS_PER_SLOT;
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const supabase = getSupabaseServerClient();

  // Slot availability check
  const available = await isSlotAvailable(new Date(input.delivery_date));
  if (!available) {
    throw new SlotFullError(
      `The ${formatHourSlot(new Date(input.delivery_date))} time slot is fully booked. Please choose a different hour.`
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      cake_config:      input.cake_config,
      delivery_address: input.delivery_address,
      delivery_date:    input.delivery_date,
      customer_name:    input.customer_name,
      customer_phone:   input.customer_phone,
      customer_email:   input.customer_email ?? null,
      notes:            input.notes ?? null,
      total_price:      input.total_price,
      status:           "pending",
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create order: ${error.message}`);
  return data as Order;
}

export async function getOrders(query: OrdersQuery = {}): Promise<Order[]> {
  const supabase = getSupabaseServerClient();

  let q = supabase
    .from("orders")
    .select("*")
    .order("delivery_date", { ascending: true });

  if (query.date) {
    // Filter: delivery_date falls on this calendar day
    const dayStart = new Date(`${query.date}T00:00:00.000Z`);
    const dayEnd   = new Date(`${query.date}T23:59:59.999Z`);
    q = q.gte("delivery_date", dayStart.toISOString())
         .lte("delivery_date", dayEnd.toISOString());
  }

  if (query.status) {
    q = q.eq("status", query.status);
  }

  const { data, error } = await q;
  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return (data ?? []) as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error?.code === "PGRST116") return null; // not found
  if (error) throw new Error(`Failed to fetch order: ${error.message}`);
  return data as Order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error?.code === "PGRST116") throw new NotFoundError(`Order ${id} not found`);
  if (error) throw new Error(`Failed to update order: ${error.message}`);
  return data as Order;
}

// ─── Custom errors ────────────────────────────────────────────────────────────

export class SlotFullError extends Error {
  readonly code = "SLOT_FULL" as const;
}

export class NotFoundError extends Error {
  readonly code = "NOT_FOUND" as const;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatHourSlot(date: Date): string {
  const h = date.getHours();
  return `${String(h).padStart(2, "0")}:00–${String(h + 1).padStart(2, "0")}:00`;
}
