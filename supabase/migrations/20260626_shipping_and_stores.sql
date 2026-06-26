-- ============================================================
-- LENZIFY: SHIPPING PARTNERS, SHIPPING ZONES & STORES
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Shipping Partners
CREATE TABLE IF NOT EXISTS public.shipping_partners (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  partner_id TEXT NOT NULL UNIQUE,
  coverage   TEXT NOT NULL DEFAULT 'Pan-India',
  speed      TEXT NOT NULL DEFAULT '48-72h',
  status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shipping_partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_manage_partners" ON public.shipping_partners;
CREATE POLICY "admin_manage_partners" ON public.shipping_partners FOR ALL USING (true);

INSERT INTO public.shipping_partners (name, partner_id, coverage, speed, status) VALUES
  ('BlueDart Express', 'BLU-01', 'Pan-India', '24-48h', 'active'),
  ('Delhivery Pro',   'DEL-02', 'Global Tier 1', '48-72h', 'active'),
  ('Shadowfax Local', 'SHA-03', 'Inter-City', '12-24h', 'maintenance')
ON CONFLICT (partner_id) DO NOTHING;

-- 2. Shipping Zones
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city       TEXT NOT NULL,
  state      TEXT NOT NULL,
  charge     NUMERIC NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_manage_zones" ON public.shipping_zones;
CREATE POLICY "admin_manage_zones" ON public.shipping_zones FOR ALL USING (true);

INSERT INTO public.shipping_zones (city, state, charge, is_active) VALUES
  ('Mumbai',    'Maharashtra', 0,  true),
  ('Delhi',     'NCR',         49, true),
  ('Bangalore', 'Karnataka',   49, true),
  ('Chennai',   'Tamil Nadu',  99, false)
ON CONFLICT DO NOTHING;

-- 3. Stores
CREATE TABLE IF NOT EXISTS public.stores (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  address    TEXT NOT NULL,
  city       TEXT NOT NULL,
  state      TEXT NOT NULL,
  pincode    TEXT,
  phone      TEXT,
  email      TEXT,
  lat        TEXT,
  lng        TEXT,
  status     TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'coming_soon', 'closed')),
  hours      TEXT DEFAULT 'Mon–Sat: 10 AM – 8 PM',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_view_stores" ON public.stores;
CREATE POLICY "public_view_stores" ON public.stores FOR SELECT USING (true);
DROP POLICY IF EXISTS "admin_manage_stores" ON public.stores;
CREATE POLICY "admin_manage_stores" ON public.stores FOR ALL USING (true);

INSERT INTO public.stores (name, address, city, state, lat, lng, status, sort_order) VALUES
  ('Lenzify Bangalore', 'Alpha Sector 4, Silicon Valley', 'Bangalore', 'Karnataka', '12.9716', '77.5946', 'operational', 1),
  ('Lenzify Mumbai',    'Marine Drive Promenade',          'Mumbai',    'Maharashtra', '18.9220', '72.8347', 'operational', 2),
  ('Lenzify Delhi',     'Connaught Outer Ring',            'Delhi',     'NCR',         '28.6139', '77.2090', 'coming_soon', 3)
ON CONFLICT DO NOTHING;
