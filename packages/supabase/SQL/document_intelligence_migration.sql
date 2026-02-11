-- ============================================
-- Document Intelligence Migration
-- Tables: clients, import_sessions, extracted_records, transactions, quotations
-- ============================================

-- Clients table (collectors, buyers, galleries)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    type TEXT CHECK (type IN ('collector', 'buyer', 'gallery', 'dealer', 'institution', 'other')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);

-- Import Sessions table
CREATE TABLE IF NOT EXISTS import_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT,
    file_type TEXT NOT NULL CHECK (file_type IN ('xlsx', 'csv', 'docx')),
    file_size BIGINT,
    document_type TEXT CHECK (document_type IN ('inventory', 'invoice', 'quotation', 'mixed')),
    status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'extracted', 'completed', 'failed')),
    total_records INT DEFAULT 0,
    approved_records INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_import_sessions_user_id ON import_sessions(user_id);
CREATE INDEX idx_import_sessions_status ON import_sessions(status);

-- Extracted Records table (staging area)
CREATE TABLE IF NOT EXISTS extracted_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES import_sessions(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL CHECK (record_type IN ('artwork', 'transaction', 'quotation', 'client')),
    extracted_data JSONB NOT NULL DEFAULT '{}',
    confidence NUMERIC(3,2) DEFAULT 0.00 CHECK (confidence >= 0 AND confidence <= 1),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'edited', 'saved')),
    user_edits JSONB,
    row_index INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_extracted_records_session_id ON extracted_records(session_id);
CREATE INDEX idx_extracted_records_status ON extracted_records(status);

-- Transactions table (from invoices)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    import_session_id UUID REFERENCES import_sessions(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('sale', 'purchase', 'commission', 'rental', 'consignment', 'other')),
    amount NUMERIC(12,2),
    currency TEXT DEFAULT 'USD',
    date DATE,
    invoice_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_artwork_id ON transactions(artwork_id);
CREATE INDEX idx_transactions_client_id ON transactions(client_id);

-- Quotations table
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    import_session_id UUID REFERENCES import_sessions(id) ON DELETE SET NULL,
    amount NUMERIC(12,2),
    currency TEXT DEFAULT 'USD',
    valid_until DATE,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
    quotation_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_quotations_user_id ON quotations(user_id);
CREATE INDEX idx_quotations_artwork_id ON quotations(artwork_id);
CREATE INDEX idx_quotations_client_id ON quotations(client_id);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE extracted_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;

-- Clients: users can CRUD their own
CREATE POLICY "Users can view own clients" ON clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clients" ON clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clients" ON clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clients" ON clients FOR DELETE USING (auth.uid() = user_id);

-- Import Sessions: users can CRUD their own
CREATE POLICY "Users can view own import sessions" ON import_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own import sessions" ON import_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own import sessions" ON import_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own import sessions" ON import_sessions FOR DELETE USING (auth.uid() = user_id);

-- Extracted Records: access via join to import_sessions
CREATE POLICY "Users can view own extracted records" ON extracted_records
    FOR SELECT USING (EXISTS (SELECT 1 FROM import_sessions WHERE import_sessions.id = extracted_records.session_id AND import_sessions.user_id = auth.uid()));
CREATE POLICY "Users can insert own extracted records" ON extracted_records
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM import_sessions WHERE import_sessions.id = extracted_records.session_id AND import_sessions.user_id = auth.uid()));
CREATE POLICY "Users can update own extracted records" ON extracted_records
    FOR UPDATE USING (EXISTS (SELECT 1 FROM import_sessions WHERE import_sessions.id = extracted_records.session_id AND import_sessions.user_id = auth.uid()));
CREATE POLICY "Users can delete own extracted records" ON extracted_records
    FOR DELETE USING (EXISTS (SELECT 1 FROM import_sessions WHERE import_sessions.id = extracted_records.session_id AND import_sessions.user_id = auth.uid()));

-- Transactions: users can CRUD their own
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- Quotations: users can CRUD their own
CREATE POLICY "Users can view own quotations" ON quotations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotations" ON quotations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotations" ON quotations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotations" ON quotations FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Updated_at trigger
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_import_sessions_updated_at BEFORE UPDATE ON import_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_extracted_records_updated_at BEFORE UPDATE ON extracted_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
