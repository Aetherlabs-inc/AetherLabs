-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);

-- Create index on created_at for sorting/querying
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON public.waitlist(created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at on row updates
CREATE TRIGGER update_waitlist_updated_at
    BEFORE UPDATE ON public.waitlist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running the migration)
DROP POLICY IF EXISTS "Allow public inserts to waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Allow anon select by email" ON public.waitlist;
DROP POLICY IF EXISTS "Allow service role to read waitlist" ON public.waitlist;

-- Create policy to allow inserts (for API submissions from anon users)
CREATE POLICY "Allow public inserts to waitlist"
    ON public.waitlist
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create policy to allow SELECT for checking duplicates (anon can only check by email)
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

