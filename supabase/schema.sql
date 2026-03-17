-- ============================================================
-- Anare Cake — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── Orders table ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.orders (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  cake_config      JSONB       NOT NULL,
  delivery_address TEXT        NOT NULL,
  delivery_date    TIMESTAMPTZ NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN (
                                 'pending', 'confirmed', 'in_progress',
                                 'ready', 'delivering', 'done'
                               )),
  customer_name    TEXT        NOT NULL,
  customer_phone   TEXT        NOT NULL,
  customer_email   TEXT,
  notes            TEXT,
  total_price      INTEGER     NOT NULL CHECK (total_price > 0),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

-- Fetch orders by delivery date (staff dashboard date filter)
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date
  ON public.orders (delivery_date);

-- Slot availability check: count by hour window + status
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status
  ON public.orders (delivery_date, status);

-- Status filter (staff dashboard status filter)
CREATE INDEX IF NOT EXISTS idx_orders_status
  ON public.orders (status);

-- ─── Auto-update updated_at ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- RLS is enabled so the anon key (browser) can only read orders.
-- All writes go through API routes that use the service role key (bypasses RLS).

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can read any order by ID (for tracking page)
-- The order ID acts as a secret token — only share it with the customer
CREATE POLICY "Public can read orders" ON public.orders
  FOR SELECT USING (true);

-- Inserts and updates are performed server-side with the service role key
-- which bypasses RLS entirely — no policies needed for those operations.

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enable Supabase Realtime so clients receive live status updates.
-- In Dashboard: Database → Replication → Source → enable "orders" table.
-- Or run the statement below:

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
