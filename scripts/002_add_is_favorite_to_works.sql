ALTER TABLE public.works
ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;

-- Optional: Update existing works to be non-favorites by default if you have existing data
-- UPDATE public.works SET is_favorite = FALSE WHERE is_favorite IS NULL;
