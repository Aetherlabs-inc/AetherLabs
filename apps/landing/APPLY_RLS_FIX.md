# Fix RLS Policy for Waitlist Table

## Problem
The waitlist API is failing with error: `new row violates row-level security policy for table "waitlist"`

## Solution
Run the following SQL in your Supabase SQL Editor:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-fix-rls.sql`
4. Click **Run**

## Alternative: Quick Fix SQL

If you prefer, you can run this directly:

```sql
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
CREATE POLICY "Allow anon select by email"
    ON public.waitlist
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Create policy to allow service role to read all entries
CREATE POLICY "Allow service role to read waitlist"
    ON public.waitlist
    FOR SELECT
    TO service_role
    USING (true);
```

## Verify It Works

After running the SQL:
1. Try submitting the waitlist form again
2. Check the browser console for any errors
3. Verify the entry appears in your Supabase `waitlist` table
