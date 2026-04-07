-- Lenzify Database Evolution v2.0
-- Extending schema to support full administrative control

-- 1. ENHANCING PRODUCTS (Clinical & Interactive Meta)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sku text UNIQUE,
ADD COLUMN IF NOT EXISTS images_360 jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS brand_id integer REFERENCES public.categories(id); -- Optional: Separate brands?

-- 2. ENHANCING CATEGORIES (Orchestration)
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS is_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- 3. ENHANCING ORDERS (Logistics Multi-Layer)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS courier_partner text,
ADD COLUMN IF NOT EXISTS invoice_url text,
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS modified_at timestamp with time zone;

-- 4. ENHANCING CUSTOMERS (Identity Protocol)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_blocked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS total_spent numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_image text;

-- 5. ENHANCING COUPONS (Granular Rules)
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS is_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS usage_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS rules jsonb DEFAULT '{}';

-- 6. ENHANCING REVIEWS (Moderation Hub)
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_hidden boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_reply text;

-- 7. ENHANCING PRESCRIPTIONS (Clinical Approval)
ALTER TABLE public.prescriptions 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS download_url text;

-- 8. NEW: HOMEPAGE CONFIGURATION (Orchestration Matrix)
CREATE TABLE IF NOT EXISTS public.homepage_config (
  id serial PRIMARY KEY,
  section_key text UNIQUE NOT NULL, -- 'hero', 'featured_products', 'promotional_banner'
  content jsonb NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. NEW: STORE SETTINGS (Global Constants)
CREATE TABLE IF NOT EXISTS public.store_settings (
  id serial PRIMARY KEY,
  key text UNIQUE NOT NULL, -- 'store_name', 'shipping_charge', 'free_shipping_limit'
  value text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. NEW: INVENTORY LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id serial PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  change_amount integer NOT NULL,
  reason text, -- 'Order placed', 'Manual update', 'Return'
  admin_id uuid REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. ENHANCING ADMINS (RBAC Matrix)
ALTER TABLE public.admins 
ADD COLUMN IF NOT EXISTS permissions jsonb DEFAULT '[]'; -- Store specific permission keys if needed

-- AUTO-UPDATE TOTAL_SPENT ON ORDER SUCCESS (Optional but useful)
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
