-- Add address column to clients table (Phase 3.3 CRM enhancement)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS address TEXT;
