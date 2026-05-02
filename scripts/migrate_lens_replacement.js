const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for migrations
);

const migrationSql = `
-- 1. LENSES TABLE
CREATE TABLE IF NOT EXISTS public.lenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price numeric NOT NULL DEFAULT 0,
  is_enabled boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. LENS COATINGS TABLE
CREATE TABLE IF NOT EXISTS public.lens_coatings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  is_enabled boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. LENS REPLACEMENT ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.lens_replacement_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  frame_type text NOT NULL,
  frame_condition text,
  frame_images text[] DEFAULT '{}',
  lens_id uuid REFERENCES public.lenses(id),
  coating_ids uuid[] DEFAULT '{}',
  prescription_type text,
  prescription_file text,
  prescription_data jsonb DEFAULT '{}',
  pickup_address jsonb NOT NULL,
  pickup_date date NOT NULL,
  pickup_time_slot text NOT NULL,
  lens_price numeric NOT NULL DEFAULT 0,
  coatings_price numeric NOT NULL DEFAULT 0,
  pickup_fee numeric NOT NULL DEFAULT 50,
  delivery_fee numeric NOT NULL DEFAULT 50,
  total_price numeric NOT NULL,
  status text DEFAULT 'Order Placed',
  payment_status text DEFAULT 'pending',
  payment_method text DEFAULT 'online',
  assigned_delivery_person text,
  admin_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Lenses
INSERT INTO public.lenses (name, description, base_price) VALUES
('Single Vision', 'Standard corrective lenses for one field of vision.', 500),
('Bifocal', 'Lenses with two distinct optical powers.', 800),
('Progressive', 'Multifocal lenses with a seamless transition.', 1500),
('Blue Cut', 'Protects eyes from digital screen strain.', 1200),
('Photochromic', 'Darkens in sunlight, clears indoors.', 1800)
ON CONFLICT DO NOTHING;

-- Seed Initial Coatings
INSERT INTO public.lens_coatings (name, description, price) VALUES
('Anti-Reflective', 'Reduces glare and reflections.', 300),
('Scratch Resistant', 'Protects lenses from daily wear.', 200),
('UV Protection', 'Blocks harmful ultraviolet rays.', 250),
('Anti-Fog', 'Prevents lenses from fogging up.', 400)
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE public.lenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_coatings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lens_replacement_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Lenses" ON public.lenses;
CREATE POLICY "Public Read Lenses" ON public.lenses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Coatings" ON public.lens_coatings;
CREATE POLICY "Public Read Coatings" ON public.lens_coatings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view their own replacement orders" ON public.lens_replacement_orders;
CREATE POLICY "Users can view their own replacement orders" ON public.lens_replacement_orders FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own replacement orders" ON public.lens_replacement_orders;
CREATE POLICY "Users can create their own replacement orders" ON public.lens_replacement_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
`;

async function migrate() {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: migrationSql });
  if (error) {
    console.error('Migration failed:', error);
    // If exec_sql doesn't exist, we might need another way or just try to run it via some other tool if available.
    // In some setups, we can use the SQL editor directly, but here we are in a CLI.
  } else {
    console.log('Migration successful');
  }
}

migrate();
