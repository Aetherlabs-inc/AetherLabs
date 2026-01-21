-- Quick fix SQL to run in Supabase SQL Editor
-- This fixes the RLS policies for the waitlist table

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public inserts to waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Allow anon select by email" ON public.waitlist;
DROP POLICY IF EXISTS "Allow service role to read waitlist" ON public.waitlist;

-- Create policy to allow inserts (for API submissions from anon users)
CREATE POLICY "Allow public inserts to waitlist"
    ON public.waitlist
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create policy to allow SELECT for checking duplicates
-- This allows the API to check if an email already exists
CREATE POLICY "Allow anon select by email"
    ON public.waitlist
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Create policy to allow service role to read all entries (for admin/analytics)
CREATE POLICY "Allow service role to read waitlist"
    ON public.waitlist
    FOR SELECT
    TO service_role
    USING (true);

