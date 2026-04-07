-- Lenzify Database Patch - Missing Entities & Functions
-- Execute this in the Supabase SQL Editor to resolve systemic synchronization issues.

-- 1. HOMEPAGE CONFIGURATION TABLE
-- Orchestrates the visual matrix of the storefront in real-time.
CREATE TABLE IF NOT EXISTS public.homepage_config (
  id serial PRIMARY KEY,
  section_key text UNIQUE NOT NULL, -- e.g., 'hero', 'categories', 'featured_products'
  content jsonb NOT NULL DEFAULT '{}',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. STORE SETTINGS TABLE
-- Persists brand identity, contact protocols, and economic defaults.
CREATE TABLE IF NOT EXISTS public.store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  store_name text DEFAULT 'LENZIFY',
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#000000',
  brand_color text DEFAULT '#775a19',
  contact_email text,
  contact_phone text,
  address text,
  base_shipping_charge numeric DEFAULT 0,
  free_shipping_threshold numeric DEFAULT 4999,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1) -- Ensure only one settings row exists
);

-- Seed initial settings if empty
INSERT INTO public.store_settings (id, store_name)
VALUES (1, 'LENZIFY')
ON CONFLICT (id) DO NOTHING;

-- 3. INVENTORY LOGS (AUDIT TRAIL)
-- Records every movement within the resource nexus.
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  change_amount integer NOT NULL,
  reason text,
  admin_id uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ATOMIC STOCK CALIBRATION (RPCs)
-- Ensures thread-safe inventory recalibration.

CREATE OR REPLACE FUNCTION public.increment_stock(p_id uuid, p_amount integer)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET stock = COALESCE(stock, 0) + p_amount
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.decrement_inventory(p_id uuid, p_qty integer)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(0, COALESCE(stock, 0) - p_qty)
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. PRODUCT TABLE EXPANSION
-- Synchronizing schema with AI-generated UI expectations.
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sku text UNIQUE,
ADD COLUMN IF NOT EXISTS is_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS images_360 jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS primary_image text, -- Backup for direct image reference
ADD COLUMN IF NOT EXISTS rating numeric(2,1) DEFAULT 4.5,
ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS frame_type text,
ADD COLUMN IF NOT EXISTS shape text,
ADD COLUMN IF NOT EXISTS material text,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS color text,
ADD COLUMN IF NOT EXISTS size text,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]';

-- 6. RLS POLICIES FOR NEW TABLES
ALTER TABLE public.homepage_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Config" ON public.homepage_config FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.store_settings FOR SELECT USING (true);
