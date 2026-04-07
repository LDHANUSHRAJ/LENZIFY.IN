-- Lenzify Final Database Schema
-- Strictly Matching User Requirements (16 Tables)
-- Execute this in the Supabase SQL Editor

-- 1. USERS TABLE (Linked to Auth Profiles)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name text,
  email text,
  phone text,
  password text, -- Note: Supabase handles passwords via auth, but including field for completeness
  role text DEFAULT 'customer', -- 'customer', 'admin'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  image text, -- Category image URL
  parent_category integer REFERENCES public.categories(id), -- For hierarchical categories
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  offer_price numeric,
  category_id integer REFERENCES public.categories(id),
  brand text,
  frame_type text,
  shape text,
  gender text,
  material text,
  color text,
  size text,
  stock integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
  id serial PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false
);

-- 5. ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  pincode text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CART TABLE
CREATE TABLE IF NOT EXISTS public.cart (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  lens_type text,
  power_left text,
  power_right text,
  price numeric -- Snapshotted price at time of adding
);

-- 7. WISHLIST TABLE
CREATE TABLE IF NOT EXISTS public.wishlist (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id),
  total_price numeric NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered'
  payment_status text DEFAULT 'pending', -- 'pending', 'paid'
  address_id integer REFERENCES public.addresses(id),
  tracking_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id serial PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  quantity integer NOT NULL,
  price numeric NOT NULL,
  lens_type text,
  power_left text,
  power_right text
);

-- 10. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  order_id uuid REFERENCES public.orders(id),
  left_eye jsonb, -- Detailed power structure
  right_eye jsonb,
  pd numeric,
  file_url text
);

-- 11. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  status text DEFAULT 'pending', -- 'pending', 'approved'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id serial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_type text, -- 'percentage', 'flat'
  discount_value numeric NOT NULL,
  min_order numeric DEFAULT 0,
  expiry timestamp with time zone,
  usage_limit integer
);

-- 13. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id serial PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id),
  payment_method text, -- 'Razorpay', 'COD'
  transaction_id text,
  status text, -- 'Success', 'Failed'
  amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. INVENTORY TABLE (Optional Advanced)
CREATE TABLE IF NOT EXISTS public.inventory (
  id serial PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  stock integer DEFAULT 0,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  name text,
  email text,
  password text, -- Supabase handles passwords, but matching request
  role text -- 'super admin', 'manager', 'staff'
);

-- 16. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id serial PRIMARY KEY,
  type text, -- 'New Order', 'Low Stock'
  message text,
  admin_id uuid REFERENCES public.admins(id),
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public Access
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (status = 'approved');

-- User Specific Access
CREATE POLICY "Users can manage own cart" ON public.cart FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Profile Sync Function (Important for Supabase Auth)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
