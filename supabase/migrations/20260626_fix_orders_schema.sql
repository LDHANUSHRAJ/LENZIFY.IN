-- Fix missing columns in orders table
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
  ADD COLUMN IF NOT EXISTS return_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS return_reason TEXT,
  ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Fix missing columns in order_items table
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS lens_id UUID,
  ADD COLUMN IF NOT EXISTS prescription_json JSONB;

-- Expand the status CHECK constraint to include all workflow statuses
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending', 'confirmed',
    'frame_reserved', 'frame_preparing',
    'lens_selected', 'lens_manufacturing', 'lens_fitting',
    'quality_check', 'packed', 'waiting_shipment',
    'shipped', 'out_for_delivery',
    'delivered', 'cancelled', 'refunded'
  ));

-- Refresh PostgREST schema cache so new columns are visible immediately
NOTIFY pgrst, 'reload schema';
