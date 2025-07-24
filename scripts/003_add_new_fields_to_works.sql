ALTER TABLE public.works
ADD COLUMN thumbnail_url TEXT,
ADD COLUMN type TEXT DEFAULT 'image' NOT NULL,
ADD COLUMN video_url TEXT,
ADD COLUMN document_url TEXT;