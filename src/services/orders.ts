import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Order, OrderStatus, Customer, LoyaltyTier } from "@/types/order";
import type { CreateOrderInput, OrdersQuery } from "@/lib/validations/order";

const MAX_ORDERS_PER_DAY = 15;

// ─── Ghost Slot Reaper ────────────────────────────────────────────────────────
// Cancels awaiting_payment orders whose payment window has expired.
// Called on configurator load so capacity is always accurate.

export async function cancelExpiredOrders(): Promise<number> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("status", "awaiting_payment")
    .lt("payment_expires_at", new Date().toISOString())
    .select("id");

  if (error) throw new Error(`Reaper failed: ${error.message}`);
  return data?.length ?? 0;
}

// ─── Daily capacity check ─────────────────────────────────────────────────────
// PM Hard Constraint 3:
//   Count orders where status = 'confirmed'
//   OR (status = 'awaiting_payment' AND payment_expires_at > now())
// This excludes ghost slots that have already expired.

export async function countOrdersOnDay(date: Date): Promise<number> {
  const supabase = getSupabaseServerClient();

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const now = new Date().toISOString();

  // Count confirmed orders for the day
  const { count: confirmedCount, error: e1 } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("delivery_date", dayStart.toISOString())
    .lte("delivery_date", dayEnd.toISOString())
    .in("status", ["confirmed", "in_progress", "ready", "delivering", "done"]);

  if (e1) throw new Error(`Capacity check failed: ${e1.message}`);

  // Count non-expired awaiting_payment orders for the day
  const { count: awaitingCount, error: e2 } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("delivery_date", dayStart.toISOString())
    .lte("delivery_date", dayEnd.toISOString())
    .eq("status", "awaiting_payment")
    .gt("payment_expires_at", now);

  if (e2) throw new Error(`Capacity check failed: ${e2.message}`);

  return (confirmedCount ?? 0) + (awaitingCount ?? 0);
}

export async function isDayAvailable(date: Date): Promise<boolean> {
  const count = await countOrdersOnDay(date);
  return count < MAX_ORDERS_PER_DAY;
}

// ─── Customer upsert (CRM) ───────────────────────────────────────────────────
// Uses phone as PK. Increments order_count and updates loyalty tier.
// Returns the updated customer record.

export async function upsertCustomer(
  phone: string,
  name: string
): Promise<Customer & { isLoyal: boolean }> {
  const supabase = getSupabaseServerClient();

  // Fetch existing customer
  const { data: existing } = await supabase
    .from("customers")
    .select("*")
    .eq("phone", phone)
    .single();

  const newCount = (existing?.order_count ?? 0) + 1;

  // Determine loyalty tier
  let loyaltyTier: LoyaltyTier = "standard";
  if (newCount >= 15) loyaltyTier = "vip";
  else if (newCount >= 5) loyaltyTier = "loyal";

  const { data, error } = await supabase
    .from("customers")
    .upsert(
      {
        phone,
        name,
        order_count:   newCount,
        loyalty_tier:  loyaltyTier,
        last_order_at: new Date().toISOString(),
        // first_order_at is set by DB default on INSERT, not touched on UPDATE
      },
      { onConflict: "phone" }
    )
    .select()
    .single();

  if (error) throw new Error(`Customer upsert failed: ${error.message}`);

  return { ...(data as Customer), isLoyal: newCount > 5 };
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export async function createOrder(input: CreateOrderInput): Promise<Order & { isLoyal: boolean }> {
  const supabase = getSupabaseServerClient();

  const deliveryDate = new Date(input.delivery_date);

  // 1. Run the reaper first — clears ghost slots so capacity is accurate
  await cancelExpiredOrders().catch(console.error);

  // 2. Check daily capacity
  const available = await isDayAvailable(deliveryDate);
  if (!available) {
    throw new SlotFullError(
      `${deliveryDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} is fully booked (${MAX_ORDERS_PER_DAY} orders). Please choose another date.`
    );
  }

  // 3. Atomic customer upsert — builds CRM record
  const customer = await upsertCustomer(input.customer_phone, input.customer_name);

  // 4. Create the order
  const { data, error } = await supabase
    .from("orders")
    .insert({
      cake_config:       input.cake_config,
      delivery_address:  input.delivery_address,
      delivery_lat:      input.delivery_lat ?? null,
      delivery_lng:      input.delivery_lng ?? null,
      delivery_date:     input.delivery_date,
      customer_name:     input.customer_name,
      customer_phone:    input.customer_phone,
      customer_email:    input.customer_email ?? null,
      notes:             input.notes ?? null,
      total_price:       input.total_price,
      complexity_score:  input.complexity_score ?? 0,
      status:            "pending",
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create order: ${error.message}`);

  return { ...(data as Order), isLoyal: customer.isLoyal };
}

export async function getOrders(query: OrdersQuery = {}): Promise<Order[]> {
  const supabase = getSupabaseServerClient();

  let q = supabase
    .from("orders")
    .select("*")
    .order("delivery_date", { ascending: true });

  if (query.date) {
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

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(`Failed to fetch order: ${error.message}`);
  return data as Order;
}

export async function getOrderByStripeSession(sessionId: string): Promise<Order | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(`Failed to fetch order by session: ${error.message}`);
  return data as Order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: { payment_expires_at?: string; stripe_session_id?: string }
): Promise<Order> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString(), ...extra })
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
