-- Try-at-Home Bookings
-- Apply this migration before deploying the try-at-home booking feature.

CREATE TABLE IF NOT EXISTS public.try_at_home_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Contact
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,

  -- Address
  address text NOT NULL,
  city text NOT NULL,
  pincode text NOT NULL,

  -- Slot
  preferred_date date NOT NULL,
  preferred_time text NOT NULL, -- e.g. "10:00 AM - 12:00 PM"

  -- Preferences
  frame_preference text, -- e.g. "Spectacles", "Sunglasses", "Both"
  notes text,

  -- Admin fields
  status text DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  admin_notes text,

  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.try_at_home_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create bookings" ON public.try_at_home_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own bookings" ON public.try_at_home_bookings
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can manage all bookings" ON public.try_at_home_bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
