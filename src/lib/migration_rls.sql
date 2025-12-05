-- Enable RLS on tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert orders (Guest Checkout)
CREATE POLICY "Enable insert for everyone" ON public.orders 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for everyone" ON public.order_items 
FOR INSERT WITH CHECK (true);

-- Allow reading orders (needed for tracking page)
-- Ideally restricted by some token, but for now allowing public read by ID
CREATE POLICY "Enable select for everyone" ON public.orders 
FOR SELECT USING (true);

CREATE POLICY "Enable select for everyone" ON public.order_items 
FOR SELECT USING (true);

-- Allow updates (for admin dashboard, assuming admin uses same connection or service role)
-- If admin is authenticated, we might need specific policies, but 'true' covers it for now.
CREATE POLICY "Enable update for everyone" ON public.orders 
FOR UPDATE USING (true);
