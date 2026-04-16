-- Lenzify Database Evolution v3.0
-- Fixes missing entities, schema mismatches, and adds tracking/replacement modules

-- 1. FIX CATEGORIES TABLE MISMATCHES
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS type text DEFAULT 'product',
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS parent_id integer REFERENCES public.categories(id);

-- 2. FIX PRODUCTS TABLE
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'frame',
ADD COLUMN IF NOT EXISTS collection text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- 3. FIX CART & ORDER ITEMS
ALTER TABLE public.cart
ADD COLUMN IF NOT EXISTS lens_id uuid,
ADD COLUMN IF NOT EXISTS lens_config jsonb,
ADD COLUMN IF NOT EXISTS prescription_json jsonb;

ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS lens_id uuid,
ADD COLUMN IF NOT EXISTS prescription_json jsonb;

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS type text DEFAULT 'normal', -- 'normal', 'replacement'
ADD COLUMN IF NOT EXISTS payment_method text;

-- 4. CREATE NEW TABLES FOR LENSES & ADDONS
CREATE TABLE IF NOT EXISTS public.lenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric DEFAULT 0,
  category text DEFAULT 'type', -- 'Single Vision', 'Progressive', etc.
  features text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_lenses (
  id serial PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  lens_id uuid REFERENCES public.lenses(id) ON DELETE CASCADE,
  UNIQUE(product_id, lens_id)
);

CREATE TABLE IF NOT EXISTS public.lens_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric DEFAULT 0,
  description text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- Seed some default lenses
INSERT INTO public.lenses (name, description, price, category, features)
VALUES 
  ('Standard Single Vision', 'Basic vision correction', 500, 'Single Vision', ARRAY['Scratch Resistant']),
  ('Premium Blue Cut', 'Digital eyestrain protection', 1500, 'Single Vision', ARRAY['Blue Light Filter', 'Anti-Glare', 'Scratch Resistant']),
  ('Progressive HD', 'Seamless multi-focal view', 3500, 'Progressive', ARRAY['Wide View', 'Anti-Glare', 'UV Protection'])
ON CONFLICT DO NOTHING;

-- Seed some default addons
INSERT INTO public.lens_addons (name, price, description)
VALUES
  ('Anti-Glare Coating', 500, 'Reduces reflections and halos'),
  ('Blue Light Filter', 800, 'Protects eyes from digital screens'),
  ('UV400 Protection', 400, 'Blocks 100% of harmful UV rays')
ON CONFLICT DO NOTHING;

-- 5. LENS REPLACEMENT ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.lens_replacement_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  order_id uuid REFERENCES public.orders(id),
  frame_type text NOT NULL,
  frame_condition text NOT NULL,
  frame_image_url text,
  lens_id uuid REFERENCES public.lenses(id),
  add_ons jsonb DEFAULT '[]',
  prescription_json jsonb,
  prescription_file_url text,
  address_id integer REFERENCES public.addresses(id),
  pickup_date date,
  pickup_slot text,
  service_fee numeric DEFAULT 0,
  pickup_fee numeric DEFAULT 0,
  total_price numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 6. ORDER TRACKING TABLE
CREATE TABLE IF NOT EXISTS public.order_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  courier_name text,
  tracking_id text,
  tracking_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.lenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_replacement_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Lenses" ON public.lenses FOR SELECT USING (true);
CREATE POLICY "Public Read Addons" ON public.lens_addons FOR SELECT USING (true);
CREATE POLICY "Public Read Tracking" ON public.order_tracking FOR SELECT USING (true);
CREATE POLICY "Owner Access Replacement Orders" ON public.lens_replacement_orders FOR ALL USING (auth.uid() = user_id);
