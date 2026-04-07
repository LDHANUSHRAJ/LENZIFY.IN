-- Lenzify Full Database Schema
-- Paste this into your Supabase SQL Editor

-- 1. Profiles (Linked to Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name text,
  email text,
  avatar_url text,
  role text DEFAULT 'customer', -- 'customer', 'staff', 'manager', 'admin'
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Customers (Business Data)
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  email text,
  phone text,
  is_blocked boolean DEFAULT false,
  total_spent numeric DEFAULT 0,
  order_count integer DEFAULT 0,
  last_order_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products (Comprehensive)
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE,
  name text NOT NULL,
  brand text,
  description text,
  price numeric NOT NULL,
  offer_price numeric,
  stock integer DEFAULT 0,
  category_id integer REFERENCES public.categories(id),
  
  -- Filters & Specs
  frame_type text, -- 'full-rim', 'half-rim', 'rimless'
  shape text, -- 'round', 'square', 'aviator', etc.
  material text, -- 'metal', 'plastic', 'titanium'
  gender text, -- 'men', 'women', 'kids', 'unisex'
  color text,
  size text, -- 'small', 'medium', 'large'
  
  -- Images
  primary_image text NOT NULL,
  additional_images text[], -- Array of URLs
  three_sixty_images text[], -- Array of URLs for 360 view
  
  -- Lens Options (flags)
  has_single_vision boolean DEFAULT true,
  has_bifocal boolean DEFAULT true,
  has_progressive boolean DEFAULT true,
  has_blue_cut boolean DEFAULT true,
  has_zero_power boolean DEFAULT true,
  
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  is_new boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Coupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_value numeric NOT NULL,
  discount_type text DEFAULT 'percentage', -- 'percentage', 'flat'
  min_order_value numeric DEFAULT 0,
  max_discount numeric,
  expiry_date date,
  usage_limit integer,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Addresses
CREATE TABLE IF NOT EXISTS public.addresses (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text,
  address_line text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Orders (Detailed)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  
  -- Customer Snapshot (in case profile changes/deleted)
  customer_name text,
  customer_email text,
  customer_phone text,
  
  -- Order Details
  total_amount numeric NOT NULL,
  discount_amount numeric DEFAULT 0,
  coupon_code text,
  shipping_charge numeric DEFAULT 0,
  
  -- Status
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'
  payment_status text DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  payment_method text, -- 'razorpay', 'cod', 'upi', 'card'
  
  -- Shipping Details
  shipping_address jsonb, -- Snapshot of address
  courier_partner text,
  tracking_id text,
  estimated_delivery date,
  
  -- Razorpay Metadata
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  
  invoice_url text,
  notes text,
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id serial PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL,
  price_at_purchase numeric NOT NULL,
  
  -- Lens Details for this item
  lens_type text,
  lens_power_details jsonb, -- Snapshot of power
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Prescriptions
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id),
  order_id uuid REFERENCES public.orders(id), -- Optional: link to specific order
  
  -- Power Details
  right_eye_sph numeric,
  right_eye_cyl numeric,
  right_eye_axis integer,
  right_eye_add numeric,
  
  left_eye_sph numeric,
  left_eye_cyl numeric,
  left_eye_axis integer,
  left_eye_add numeric,
  
  pd numeric,
  
  prescription_image_url text, -- If they uploaded a photo
  is_approved boolean DEFAULT false,
  approved_by uuid REFERENCES public.profiles(id),
  
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id serial PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_approved boolean DEFAULT false,
  is_pinned boolean DEFAULT false,
  admin_reply text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Store Settings (Singleton Pattern)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  store_name text DEFAULT 'Lenzify',
  logo_url text,
  contact_email text,
  contact_phone text,
  address text,
  
  -- Homepage Config
  homepage_sections jsonb, -- [{type: 'banner', id: 1}, {type: 'collection', category_id: 2}]
  
  -- Shipping rules
  base_shipping_charge numeric DEFAULT 0,
  free_shipping_threshold numeric DEFAULT 0,
  
  social_links jsonb, -- {instagram: '', facebook: ''}
  
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- 11. Banners
CREATE TABLE IF NOT EXISTS public.banners (
  id serial PRIMARY KEY,
  title text,
  subtitle text,
  image_url text NOT NULL,
  link_url text,
  position integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS & Policies (Public can read products/categories/reviews)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public Read Banners" ON public.banners FOR SELECT USING (is_active = true);

-- Functions & Triggers
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
