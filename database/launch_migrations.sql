-- ============================================================
-- LENZIFY LAUNCH MIGRATIONS
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- Wrapped in a single transaction: all-or-nothing. If any statement
-- fails, the entire script rolls back and no table is left half-applied.
-- ============================================================

BEGIN;

-- -------------------------------------------------------
-- 1. RLS for addresses
-- -------------------------------------------------------
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own addresses" ON public.addresses;
CREATE POLICY "Users can manage own addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all addresses" ON public.addresses;
CREATE POLICY "Admins can manage all addresses" ON public.addresses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------
-- 2. RLS for payments
-- -------------------------------------------------------
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------
-- 3. RLS for order_items
-- -------------------------------------------------------
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
CREATE POLICY "Admins can manage all order items" ON public.order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------
-- 4. RLS for prescriptions
-- -------------------------------------------------------
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own prescriptions" ON public.prescriptions;
CREATE POLICY "Users can manage own prescriptions" ON public.prescriptions
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all prescriptions" ON public.prescriptions;
CREATE POLICY "Admins can manage all prescriptions" ON public.prescriptions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------
-- 5. Try-at-home bookings table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.try_at_home_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  pincode text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  frame_preference text,
  notes text,
  status text DEFAULT 'pending',
  admin_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.try_at_home_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create bookings" ON public.try_at_home_bookings;
CREATE POLICY "Anyone can create bookings" ON public.try_at_home_bookings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own bookings" ON public.try_at_home_bookings;
CREATE POLICY "Users can view own bookings" ON public.try_at_home_bookings
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.try_at_home_bookings;
CREATE POLICY "Admins can manage all bookings" ON public.try_at_home_bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- -------------------------------------------------------
-- 6. Service-role bypass policies
--    placeOrder() uses the service-role key (adminSupabase). Without
--    these, the service role is still unrestricted by RLS — Supabase
--    service role bypasses RLS by default — so these are not needed.
--    Documented here for clarity, not applied.
-- -------------------------------------------------------

-- -------------------------------------------------------
-- 7. Safe inventory decrement (prevents concurrent oversell)
--    Returns TRUE if stock was decremented, FALSE if insufficient.
--    Called by placeOrder() in src/lib/db/order_actions.ts.
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decrement_inventory_safe(p_id uuid, p_qty integer)
RETURNS boolean AS $$
DECLARE
  rows_updated integer;
BEGIN
  UPDATE public.products
  SET stock = stock - p_qty
  WHERE id = p_id AND stock >= p_qty;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
