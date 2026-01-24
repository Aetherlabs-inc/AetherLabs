-- Create survey_responses table (anonymous responses only)
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255),
  responses JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove user_id column if it exists (making all responses anonymous)
ALTER TABLE survey_responses DROP COLUMN IF EXISTS user_id;

-- Enable Row Level Security
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Users can view their own survey responses" ON survey_responses;
DROP POLICY IF EXISTS "No one can view survey responses" ON survey_responses;
DROP POLICY IF EXISTS "Anyone can view survey responses for analytics" ON survey_responses;

-- Create RLS policy: Anyone can insert survey responses (public anonymous survey)
CREATE POLICY "Anyone can insert survey responses" ON survey_responses
  FOR INSERT WITH CHECK (true);

-- Create RLS policy: All responses are anonymous (no user_id stored)
-- Responses can be viewed for analytics but remain anonymous
CREATE POLICY "Anyone can view survey responses for analytics" ON survey_responses
  FOR SELECT USING (true);

-- Drop existing index if it exists (for user_id which we no longer use)
DROP INDEX IF EXISTS idx_survey_responses_user_id;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_survey_responses_email ON survey_responses(email);
CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON survey_responses(created_at);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_survey_responses_updated_at ON survey_responses;

-- Create updated_at trigger for survey_responses
CREATE TRIGGER update_survey_responses_updated_at BEFORE UPDATE ON survey_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

