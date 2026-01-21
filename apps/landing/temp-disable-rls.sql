-- TEMPORARY: Disable RLS on storage.objects to test uploads
-- WARNING: This is for testing only - not for production!

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Disable RLS temporarily (if needed)
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS (run this after testing)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
