-- ============================================
-- Artwork Linking Migration
-- Junction tables for many-to-many artwork relationships
-- ============================================

-- Quotation-Artworks junction table (one quotation can reference multiple artworks)
CREATE TABLE IF NOT EXISTS quotation_artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(quotation_id, artwork_id)
);

CREATE INDEX idx_quotation_artworks_quotation_id ON quotation_artworks(quotation_id);
CREATE INDEX idx_quotation_artworks_artwork_id ON quotation_artworks(artwork_id);

-- Transaction-Artworks junction table (one transaction can reference multiple artworks)
CREATE TABLE IF NOT EXISTS transaction_artworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(transaction_id, artwork_id)
);

CREATE INDEX idx_transaction_artworks_transaction_id ON transaction_artworks(transaction_id);
CREATE INDEX idx_transaction_artworks_artwork_id ON transaction_artworks(artwork_id);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE quotation_artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_artworks ENABLE ROW LEVEL SECURITY;

-- Quotation Artworks: access via join to quotations (which has user_id)
CREATE POLICY "Users can view own quotation artworks" ON quotation_artworks
    FOR SELECT USING (EXISTS (SELECT 1 FROM quotations WHERE quotations.id = quotation_artworks.quotation_id AND quotations.user_id = auth.uid()));
CREATE POLICY "Users can insert own quotation artworks" ON quotation_artworks
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM quotations WHERE quotations.id = quotation_artworks.quotation_id AND quotations.user_id = auth.uid()));
CREATE POLICY "Users can delete own quotation artworks" ON quotation_artworks
    FOR DELETE USING (EXISTS (SELECT 1 FROM quotations WHERE quotations.id = quotation_artworks.quotation_id AND quotations.user_id = auth.uid()));

-- Transaction Artworks: access via join to transactions (which has user_id)
CREATE POLICY "Users can view own transaction artworks" ON transaction_artworks
    FOR SELECT USING (EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_artworks.transaction_id AND transactions.user_id = auth.uid()));
CREATE POLICY "Users can insert own transaction artworks" ON transaction_artworks
    FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_artworks.transaction_id AND transactions.user_id = auth.uid()));
CREATE POLICY "Users can delete own transaction artworks" ON transaction_artworks
    FOR DELETE USING (EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_artworks.transaction_id AND transactions.user_id = auth.uid()));
