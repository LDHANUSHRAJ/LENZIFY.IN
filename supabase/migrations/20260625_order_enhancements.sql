-- ============================================================
-- LENZIFY ORDER ENHANCEMENTS MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. order_status_history — full tracking timeline
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status      TEXT NOT NULL,
  note        TEXT,
  updated_by  TEXT DEFAULT 'admin',
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id
  ON public.order_status_history(order_id);

-- RLS: customers see only their own orders' history
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customer_view_own_history" ON public.order_status_history;
CREATE POLICY "customer_view_own_history"
  ON public.order_status_history FOR SELECT
  USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "admin_manage_history" ON public.order_status_history;
CREATE POLICY "admin_manage_history"
  ON public.order_status_history FOR ALL
  USING (true);

-- 2. New columns on orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
  ADD COLUMN IF NOT EXISTS delivery_notes          TEXT,
  ADD COLUMN IF NOT EXISTS payment_id              TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_at            TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_reason           TEXT,
  ADD COLUMN IF NOT EXISTS return_requested_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS return_reason           TEXT;

-- 3. Expand order status values
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending', 'confirmed',
    'frame_reserved', 'frame_preparing',
    'lens_selected', 'lens_manufacturing', 'lens_fitting',
    'quality_check', 'packed', 'waiting_shipment',
    'shipped', 'out_for_delivery', 'delivered',
    'cancelled', 'returned', 'refunded'
  ));

-- 4. Product availability column
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'available';

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_availability_check;
ALTER TABLE public.products
  ADD CONSTRAINT products_availability_check
  CHECK (availability IN ('available', 'unavailable', 'coming_soon', 'discontinued', 'hidden'));
