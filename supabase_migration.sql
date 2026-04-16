-- ============================================================
-- LENZIFY DYNAMIC E-COMMERCE MIGRATION
-- Run this ENTIRE script in the Supabase SQL Editor
-- ============================================================

-- 1. Add 'type' column to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS type text DEFAULT 'product';

-- Auto-classify existing categories by name pattern
UPDATE categories SET type = 'gender' WHERE lower(name) IN ('men', 'women', 'kids', 'unisex', 'boys', 'girls');
UPDATE categories SET type = 'collection' WHERE lower(name) IN ('trending', 'new arrivals', 'best sellers', 'featured', 'premium collection', 'budget collection');
UPDATE categories SET type = 'usage' WHERE lower(name) IN ('daily wear', 'office wear', 'gaming', 'driving', 'sports', 'fashion');
UPDATE categories SET type = 'display' WHERE lower(name) IN ('eyeglasses', 'sunglasses', 'computer glasses', 'reading glasses', 'contact lenses', 'accessories');

-- 2. Add 'product_type' column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type text DEFAULT 'frame';

-- 3. Create lenses table
CREATE TABLE IF NOT EXISTS lenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on lenses
ALTER TABLE lenses ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read on lenses" ON lenses
  FOR SELECT USING (true);

-- Allow authenticated insert/update/delete (admin)
CREATE POLICY "Allow admin write on lenses" ON lenses
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Create product_lenses junction table
CREATE TABLE IF NOT EXISTS product_lenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  lens_id uuid REFERENCES lenses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, lens_id)
);

ALTER TABLE product_lenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on product_lenses" ON product_lenses
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write on product_lenses" ON product_lenses
  FOR ALL USING (true) WITH CHECK (true);

-- 5. Create product_attributes table for dynamic key-value pairs
CREATE TABLE IF NOT EXISTS product_attributes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  attribute_type text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_attributes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on product_attributes" ON product_attributes
  FOR SELECT USING (true);

CREATE POLICY "Allow admin write on product_attributes" ON product_attributes
  FOR ALL USING (true) WITH CHECK (true);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_product_attributes_product ON product_attributes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_attributes_type ON product_attributes(attribute_type);

-- 6. Add lens-related columns to cart table
ALTER TABLE cart ADD COLUMN IF NOT EXISTS lens_id uuid REFERENCES lenses(id) ON DELETE SET NULL;
ALTER TABLE cart ADD COLUMN IF NOT EXISTS prescription_json jsonb;
ALTER TABLE cart ADD COLUMN IF NOT EXISTS final_price numeric;

-- 7. Add lens-related columns to order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS lens_id uuid REFERENCES lenses(id) ON DELETE SET NULL;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS prescription_json jsonb;

-- 8. Seed default lens types
INSERT INTO lenses (name, description, price, features) VALUES
  ('Single Vision', 'Standard single focal point lens for distance or near vision correction.', 500, '["Single focal point", "Anti-glare coating", "Scratch resistant"]'::jsonb),
  ('Bifocal', 'Dual-zone lens with distance and near vision segments.', 1200, '["Distance + Near zones", "Visible line segment", "UV protection"]'::jsonb),
  ('Progressive', 'Seamless multi-focal lens with no visible lines for distance, intermediate, and near vision.', 2500, '["No-line multifocal", "Smooth transition zones", "Premium anti-reflective coating"]'::jsonb),
  ('Blue Cut', 'Blue light filtering lens for digital screen protection.', 800, '["Blue light filter", "Reduces eye strain", "Anti-glare", "UV400 protection"]'::jsonb),
  ('Zero Power', 'Non-prescription lens with protective coatings for fashion frames.', 300, '["Zero prescription", "Anti-glare coating", "Scratch resistant", "UV protection"]'::jsonb),
  ('Photochromic', 'Light-adaptive lens that darkens in sunlight and clears indoors.', 2000, '["Auto-darkening", "UV protection", "Indoor/outdoor versatility", "Anti-reflective"]'::jsonb)
ON CONFLICT DO NOTHING;

-- 9. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);
CREATE INDEX IF NOT EXISTS idx_product_lenses_product ON product_lenses(product_id);
CREATE INDEX IF NOT EXISTS idx_product_lenses_lens ON product_lenses(lens_id);

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
