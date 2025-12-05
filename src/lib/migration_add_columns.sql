-- Add missing columns to orders table if they don't exist
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Make customer_id nullable if it's not already, to allow guest checkout
ALTER TABLE public.orders 
ALTER COLUMN customer_id DROP NOT NULL;

-- Ensure status column exists (it seems to exist based on screenshot, but good to be safe)
-- ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'received';
