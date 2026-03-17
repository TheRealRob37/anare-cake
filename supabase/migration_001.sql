-- ============================================================
-- Migration 001 — PM Architecture Sprint
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── 1. Extend status constraint on orders ───────────────────────────────────
-- Drop old constraint and add new one with awaiting_payment + cancelled

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending',
    'awaiting_payment',
    'confirmed',
    'in_progress',
    'ready',
    'delivering',
    'done',
    'cancelled'
  ));

-- ─── 2. Add new columns to orders ────────────────────────────────────────────

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_lat       FLOAT8,
  ADD COLUMN IF NOT EXISTS delivery_lng       FLOAT8,
  ADD COLUMN IF NOT EXISTS complexity_score   INT2 NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS stripe_session_id  TEXT;

-- ─── 3. Customers table (phone as primary key — CRM) ─────────────────────────

CREATE TABLE IF NOT EXISTS public.customers (
  phone          TEXT        PRIMARY KEY,
  name           TEXT        NOT NULL,
  order_count    INT4        NOT NULL DEFAULT 0,
  loyalty_tier   TEXT        NOT NULL DEFAULT 'standard'
                             CHECK (loyalty_tier IN ('standard', 'loyal', 'vip')),
  first_order_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_order_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 4. RLS for customers ────────────────────────────────────────────────────
-- Only server-side (service role) reads/writes. No public access.

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- No public SELECT — customers data is internal only
-- All access via service role key (bypasses RLS)

-- ─── 5. New indexes ───────────────────────────────────────────────────────────

-- For the ghost slot reaper query
CREATE INDEX IF NOT EXISTS idx_orders_awaiting_payment_expiry
  ON public.orders (status, payment_expires_at)
  WHERE status = 'awaiting_payment';

-- For daily capacity check
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date_status
  ON public.orders (delivery_date, status);

-- For Stripe session lookup (webhook)
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session
  ON public.orders (stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;

-- ─── 6. Realtime for customers (optional — staff only) ───────────────────────
-- Uncomment if you want staff dashboard to update when customer loyalty changes
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
