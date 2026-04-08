-- RUN THIS IN YOUR SUPABASE SQL EDITOR --

-- 1. Ensure the bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Allow Public Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Public Select" ON storage.objects;

-- 3. Create a policy to allow anyone to upload files to 'product-images'
CREATE POLICY "Allow Public Uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'product-images');

-- 4. Create a policy to allow anyone to see files in 'product-images'
CREATE POLICY "Allow Public Select"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'product-images');

-- 5. Create a policy for updates (optional but helpful)
CREATE POLICY "Allow Public Update"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'product-images');
