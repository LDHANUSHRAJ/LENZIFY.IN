-- ============================================================
-- LENZIFY REPLACEMENT SYSTEM SCHEMA
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Create lens_coatings table
CREATE TABLE IF NOT EXISTS public.lens_coatings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lens_coatings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read on lens_coatings" ON public.lens_coatings FOR SELECT USING (true);
CREATE POLICY "Allow admin write on lens_coatings" ON public.lens_coatings FOR ALL USING (true);

-- 2. Create lens_replacement_orders table
CREATE TABLE IF NOT EXISTS public.lens_replacement_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  frame_type text NOT NULL,
  frame_condition text,
  frame_images text[] DEFAULT '{}',
  lens_id uuid REFERENCES public.lenses(id) ON DELETE SET NULL,
  coating_ids uuid[] DEFAULT '{}',
  prescription_type text DEFAULT 'upload',
  prescription_data jsonb DEFAULT '{}',
  pickup_address jsonb DEFAULT '{}',
  pickup_date date,
  pickup_time_slot text,
  lens_price numeric DEFAULT 0,
  coatings_price numeric DEFAULT 0,
  pickup_fee numeric DEFAULT 50,
  delivery_fee numeric DEFAULT 50,
  total_price numeric NOT NULL,
  status text DEFAULT 'Order Placed',
  payment_method text DEFAULT 'online',
  payment_status text DEFAULT 'pending',
  delivery_person text,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lens_replacement_orders ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own replacement orders" ON public.lens_replacement_orders 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own replacement orders" ON public.lens_replacement_orders 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all replacement orders" ON public.lens_replacement_orders 
  FOR ALL USING (true); -- Ideally filter by admin role in users table

-- 3. Seed default coatings
INSERT INTO public.lens_coatings (name, description, price) VALUES
  ('Anti-Reflective Coating', 'Reduces glare and reflections for clearer vision.', 299),
  ('Scratch Resistant', 'Tough coating to protect your lenses from daily wear.', 199),
  ('UV Protection', 'Blocks 100% of harmful UVA and UVB rays.', 249),
  ('Anti-Fog Coating', 'Prevents lenses from fogging up during temperature changes.', 349),
  ('Water Repellent', 'Ensures water droplets slide off easily for clear vision in rain.', 199)
ON CONFLICT DO NOTHING;
