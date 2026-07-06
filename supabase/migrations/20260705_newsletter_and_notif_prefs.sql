-- ============================================================
-- LENZIFY: NEWSLETTER SUBSCRIBERS
-- Run this in Supabase SQL Editor
-- ============================================================

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone_can_subscribe" ON public.newsletter_subscribers;
CREATE POLICY "anyone_can_subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "admin_manage_subscribers" ON public.newsletter_subscribers;
CREATE POLICY "admin_manage_subscribers" ON public.newsletter_subscribers FOR SELECT USING (true);

-- Note: customer notification preferences (notify_order_updates, notify_offers)
-- are stored in Supabase Auth user_metadata (via supabase.auth.updateUser),
-- matching the existing pattern used for profile name/phone. No table change needed.
