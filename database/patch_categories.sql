ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS parent_id integer REFERENCES public.categories(id);
