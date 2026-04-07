-- Lenzify Consolidated Administrative Schema v2.1
-- Strictly Matching ALL 20+ Business Points & 16+ Table Operational Suite
-- Execute this in the Supabase SQL Editor

-- 1. USERS TABLE (Linked to Auth Profiles)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name text,
  email text,
  phone text,
  password text, -- Supabase handles passwords via auth
  role text DEFAULT 'customer', -- 'customer', 'admin'
  is_blocked boolean DEFAULT false,
  total_spent numeric DEFAULT 0,
  profile_image text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE,
  image text, 
  parent_category integer REFERENCES public.categories(id),
  is_enabled boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text UNIQUE,
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
  is_enabled boolean DEFAULT true,
  images_360 jsonb DEFAULT '[]', -- Multi-angle interactive viewer
  specifications jsonb DEFAULT '{}',
  tags text[] DEFAULT '{}',
  variants jsonb DEFAULT '[]', -- Color/Size matrix
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
  price numeric
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
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  payment_status text DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  address_id integer REFERENCES public.addresses(id),
  courier_partner text,
  tracking_id text,
  invoice_url text,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
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
  status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  left_eye jsonb,
  right_eye jsonb,
  pd numeric,
  file_url text,
  admin_notes text,
  download_url text
);

-- 11. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES public.users(id),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  status text DEFAULT 'pending', -- 'pending', 'approved'
  is_pinned boolean DEFAULT false,
  is_hidden boolean DEFAULT false,
  admin_reply text,
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
  usage_limit integer,
  usage_count integer DEFAULT 0,
  is_enabled boolean DEFAULT true,
  rules jsonb DEFAULT '{}'
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

-- 14. INVENTORY LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id serial PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  change_amount integer NOT NULL,
  reason text, 
  admin_id uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. ADMINS TABLE (RBAC Matrix)
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  name text,
  email text,
  role text, -- 'super admin', 'manager', 'staff'
  permissions jsonb DEFAULT '[]'
);

-- 16. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id serial PRIMARY KEY,
  type text, 
  message text,
  admin_id uuid REFERENCES public.admins(id),
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 17. HOMEPAGE CONFIGURATION
CREATE TABLE IF NOT EXISTS public.homepage_config (
  id serial PRIMARY KEY,
  section_key text UNIQUE NOT NULL, 
  content jsonb NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. STORE SETTINGS
CREATE TABLE IF NOT EXISTS public.store_settings (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL, 
  value text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 🔐 RLS ENFORCEMENT
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 🌍 PUBLIC READ POLICIES
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (status = 'approved');

-- 👤 USER SPECIFIC POLICIES
CREATE POLICY "Cart Owner Access" ON public.cart FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Wishlist Owner Access" ON public.wishlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Order Owner Access" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- 🤖 AUTOMATION TRIGGERS

-- A. Profile Sync on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- B. Stock Reduction on Order Success
CREATE OR REPLACE FUNCTION reduce_stock_after_order()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status = 'pending' THEN
    UPDATE public.products 
    SET stock = stock - (SELECT quantity FROM public.order_items WHERE order_id = NEW.id AND product_id = public.products.id)
    WHERE id IN (SELECT product_id FROM public.order_items WHERE order_id = NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_stock_after_order
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE reduce_stock_after_order();

-- C. Financial Reconciliation (User Total Spent)
CREATE OR REPLACE FUNCTION update_user_spent()
RETURNS trigger AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN
    UPDATE public.users SET total_spent = total_spent + NEW.total_price WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_order_paid
  AFTER UPDATE OF payment_status ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE update_user_spent();
