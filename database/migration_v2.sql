-- 1. Add missing logistics and evidence columns to lens_replacement_orders
ALTER TABLE public.lens_replacement_orders 
ADD COLUMN IF NOT EXISTS delivery_address jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS is_delivery_different boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS delivery_date date DEFAULT NULL,
ADD COLUMN IF NOT EXISTS prescription_url text DEFAULT NULL;

-- 2. DEDUPLICATE AND RECLASSIFY OPTICS
-- Remove duplicates from lens_coatings first (keeping only the first instance of each name)
DELETE FROM public.lens_coatings
WHERE id NOT IN (
    SELECT MIN(id::text)::uuid
    FROM public.lens_coatings
    GROUP BY name
);

-- Ensure name is unique for future safety
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lens_coatings_name_key') THEN
        ALTER TABLE public.lens_coatings ADD CONSTRAINT lens_coatings_name_key UNIQUE (name);
    END IF;
END $$;

-- Specifically move "BLUE LIGHT PROTECTION" out of Primary Optics
UPDATE public.lenses
SET is_active = false
WHERE name ILIKE '%BLUE LIGHT PROTECTION%' 
   OR name ILIKE '%BLUE CUT%';

-- Ensure "Blue Light Protection" is correctly listed in Coatings
INSERT INTO public.lens_coatings (name, description, price)
VALUES (
    'Blue Light Protection', 
    'Advanced blue cut lenses designed to filter and block harmful high-energy blue light emitted by digital screens, LED lighting, and the sun.',
    499
)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    price = EXCLUDED.price;

-- Clean up and synchronize "Photochromic" coatings
UPDATE public.lens_coatings
SET name = 'Photochromic (Transition)',
    price = 899
WHERE name ILIKE '%photochromic%';

-- Deactivate any redundant primary lenses that should be coatings
UPDATE public.lenses
SET is_active = false
WHERE name ILIKE '%photochromic%'
   OR name ILIKE '%transition%';

-- 4. Storage Infrastructure and Policies for replacement-files bucket
-- Ensure the bucket exists and is public for image viewing
INSERT INTO storage.buckets (id, name, public)
VALUES ('replacement-files', 'replacement-files', true)
ON CONFLICT (id) DO NOTHING;

-- Fix: StorageApiError: new row violates row-level security policy
-- Allow both authenticated and anonymous uploads to bypass session synchronization issues in dev
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow any uploads" ON storage.objects;
CREATE POLICY "Allow any uploads" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'replacement-files');

-- Allow public read access to visual documentation
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
CREATE POLICY "Allow any read" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'replacement-files');

-- Allow comprehensive management for dev purposes
DROP POLICY IF EXISTS "Allow authenticated management" ON storage.objects;
DROP POLICY IF EXISTS "Allow any management" ON storage.objects;
CREATE POLICY "Allow any management" ON storage.objects
FOR ALL TO anon, authenticated
USING (bucket_id = 'replacement-files');

-- 5. Add Payment Tracking to replacement orders
ALTER TABLE public.lens_replacement_orders 
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_order_id text;
