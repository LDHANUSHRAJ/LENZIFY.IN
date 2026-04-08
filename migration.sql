-- Run this script in your Supabase SQL Editor

-- Rename offer_price to discount_price if offer_price exists and discount_price doesn't
DO $$ 
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='products' and column_name='offer_price')
  AND NOT EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='products' and column_name='discount_price')
  THEN
      ALTER TABLE "public"."products" RENAME COLUMN "offer_price" TO "discount_price";
  END IF;
END $$;

-- Let's handle the array columns.
-- For gender, type, collection, colors, sizes, images
-- If they don't exist, create them. If they exist as text, we need to alter them.

DO $$
BEGIN
    -- Add the columns if they do not exist
    ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "type" text[] DEFAULT '{}';
    ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "collection" text[] DEFAULT '{}';
    ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "colors" text[] DEFAULT '{}';
    ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "sizes" text[] DEFAULT '{}';
    ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "images" text[] DEFAULT '{}';

    -- Convert gender to text[]
    IF EXISTS(SELECT *
      FROM information_schema.columns
      WHERE table_name='products' and column_name='gender' AND data_type = 'text')
    THEN
        -- safely cast existing comma-separated strings to array
        ALTER TABLE "public"."products" ALTER COLUMN "gender" TYPE text[] USING string_to_array(gender, ',');
    ELSIF NOT EXISTS(SELECT * FROM information_schema.columns WHERE table_name='products' and column_name='gender') THEN
        ALTER TABLE "public"."products" ADD COLUMN "gender" text[] DEFAULT '{}';
    END IF;

    -- Make sure frame_type and material exist
    ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "frame_type" text;
    ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "material" text;
    
END $$;
