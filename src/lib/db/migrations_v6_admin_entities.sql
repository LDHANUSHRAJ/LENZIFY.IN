-- ============================================================
-- LENZIFY ADMIN ENTITIES MIGRATION (V6)
-- Brands and Collections Management
-- ============================================================

-- 1. Create Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  logo_url text,
  description text,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  banner_url text,
  description text,
  type text DEFAULT 'standard', -- e.g., 'trending', 'season', 'featured'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Public Read, Admin Write)
CREATE POLICY "Allow public read on brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Allow admin write on brands" ON brands FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read on collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Allow admin write on collections" ON collections FOR ALL USING (true) WITH CHECK (true);

-- 5. Prepopulate Brands from existing products
INSERT INTO brands (name)
SELECT DISTINCT brand FROM products WHERE brand IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- 6. Prepopulate Collections from existing categories of type 'collection'
INSERT INTO collections (name, type)
SELECT name, 'featured' FROM categories WHERE type = 'collection'
ON CONFLICT (name) DO NOTHING;

-- 7. Add foreign key columns to products (optional metadata)
-- For now, we keep the text columns for compatibility but we can link them later if UI requires.
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES brands(id);
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS collection_ids uuid[];

-- 8. Finalize Store Settings (Singleton Schema)
-- We perform a clean recreate to ensure compatibility with the Admin Panel 
-- and avoid constraint violations from old key-value schemas.
DROP TABLE IF EXISTS public.store_settings CASCADE;

CREATE TABLE public.store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  store_name text DEFAULT 'Lenzify',
  logo_url text,
  favicon_url text,
  contact_email text,
  contact_phone text,
  address text,
  primary_color text DEFAULT '#000000',
  brand_color text DEFAULT '#775a19',
  base_shipping_charge numeric DEFAULT 0,
  free_shipping_threshold numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS for settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read on settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin write on settings" ON public.store_settings FOR ALL USING (true) WITH CHECK (true);

-- Seed initial store settings
INSERT INTO public.store_settings (id, store_name, contact_email, base_shipping_charge, free_shipping_threshold)
VALUES (1, 'Lenzify', 'support@lenzify.in', 100, 2000)
ON CONFLICT (id) DO NOTHING;
