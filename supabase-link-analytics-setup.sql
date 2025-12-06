-- Link Click Analytics Setup for Signature For Me
-- This creates tables and functions to track link clicks in email signatures

-- Table to store tracked links
-- Note: signature_id is optional and uses TEXT to be compatible with different signature table schemas
CREATE TABLE IF NOT EXISTS tracked_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signature_id TEXT, -- Optional reference to signature (stored as text to avoid type conflicts)
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  link_type VARCHAR(50), -- 'email', 'phone', 'website', 'social', 'other'
  link_label TEXT, -- Human-readable label (e.g., "LinkedIn", "Email", "Website")
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store individual click events
CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracked_link_id UUID NOT NULL REFERENCES tracked_links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  country VARCHAR(2), -- ISO country code
  city TEXT,
  device_type VARCHAR(20), -- 'desktop', 'mobile', 'tablet', 'unknown'
  browser VARCHAR(50),
  os VARCHAR(50)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracked_links_user_id ON tracked_links(user_id);
CREATE INDEX IF NOT EXISTS idx_tracked_links_signature_id ON tracked_links(signature_id);
CREATE INDEX IF NOT EXISTS idx_tracked_links_short_code ON tracked_links(short_code);
CREATE INDEX IF NOT EXISTS idx_link_clicks_tracked_link_id ON link_clicks(tracked_link_id);
CREATE INDEX IF NOT EXISTS idx_link_clicks_clicked_at ON link_clicks(clicked_at);

-- Function to generate unique short code
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS VARCHAR(10) AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result VARCHAR(10) := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  
  -- Check if code already exists, regenerate if needed
  WHILE EXISTS (SELECT 1 FROM tracked_links WHERE short_code = result) LOOP
    result := '';
    FOR i IN 1..8 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
    END LOOP;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to update click count
CREATE OR REPLACE FUNCTION increment_click_count(link_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tracked_links
  SET click_count = click_count + 1,
      updated_at = NOW()
  WHERE id = link_id;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE tracked_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tracked links
CREATE POLICY "Users can view their own tracked links"
  ON tracked_links
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Allow public read access to tracked_links by short_code (for link redirection)
-- This is needed so the API endpoint can redirect clicks without authentication
CREATE POLICY "Public can read tracked links by short_code"
  ON tracked_links
  FOR SELECT
  USING (true);

-- Policy: Users can insert their own tracked links
CREATE POLICY "Users can insert their own tracked links"
  ON tracked_links
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tracked links
CREATE POLICY "Users can update their own tracked links"
  ON tracked_links
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own tracked links
CREATE POLICY "Users can delete their own tracked links"
  ON tracked_links
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Anyone can read link_clicks (for tracking purposes, but filtered by tracked_link ownership)
-- This allows the API to record clicks without authentication
CREATE POLICY "Anyone can insert link clicks"
  ON link_clicks
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can only view clicks for their own tracked links
CREATE POLICY "Users can view clicks for their tracked links"
  ON link_clicks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tracked_links
      WHERE tracked_links.id = link_clicks.tracked_link_id
      AND tracked_links.user_id = auth.uid()
    )
  );

-- Function to get analytics summary for a user
CREATE OR REPLACE FUNCTION get_link_analytics_summary(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  total_clicks BIGINT,
  unique_links INTEGER,
  clicks_today BIGINT,
  clicks_this_week BIGINT,
  clicks_this_month BIGINT,
  top_link_url TEXT,
  top_link_clicks BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(lc.id)::BIGINT as total_clicks,
    COUNT(DISTINCT tl.id)::INTEGER as unique_links,
    COUNT(lc.id) FILTER (WHERE lc.clicked_at >= CURRENT_DATE)::BIGINT as clicks_today,
    COUNT(lc.id) FILTER (WHERE lc.clicked_at >= CURRENT_DATE - INTERVAL '7 days')::BIGINT as clicks_this_week,
    COUNT(lc.id) FILTER (WHERE lc.clicked_at >= CURRENT_DATE - INTERVAL '30 days')::BIGINT as clicks_this_month,
    (SELECT original_url FROM tracked_links WHERE user_id = p_user_id ORDER BY click_count DESC LIMIT 1) as top_link_url,
    (SELECT click_count FROM tracked_links WHERE user_id = p_user_id ORDER BY click_count DESC LIMIT 1)::BIGINT as top_link_clicks
  FROM tracked_links tl
  LEFT JOIN link_clicks lc ON tl.id = lc.tracked_link_id
  WHERE tl.user_id = p_user_id
    AND (lc.clicked_at IS NULL OR lc.clicked_at >= CURRENT_DATE - (p_days || ' days')::INTERVAL);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tracked_links TO authenticated;
GRANT SELECT, INSERT ON link_clicks TO authenticated;
GRANT EXECUTE ON FUNCTION get_link_analytics_summary(UUID, INTEGER) TO authenticated;

-- Comments for documentation
COMMENT ON TABLE tracked_links IS 'Stores tracked links for email signatures with click counting';
COMMENT ON TABLE link_clicks IS 'Stores individual click events with metadata';
COMMENT ON FUNCTION generate_short_code() IS 'Generates a unique 8-character code for link tracking';
COMMENT ON FUNCTION increment_click_count(UUID) IS 'Increments the click count for a tracked link';
COMMENT ON FUNCTION get_link_analytics_summary(UUID, INTEGER) IS 'Returns analytics summary for a user over specified days';
