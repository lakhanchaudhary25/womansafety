-- =============================================
-- Women Safety Index Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CITIES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  safety_score INTEGER NOT NULL CHECK (safety_score >= 0 AND safety_score <= 100),
  lighting_score INTEGER NOT NULL CHECK (lighting_score >= 0 AND lighting_score <= 100),
  public_transport_score INTEGER NOT NULL CHECK (public_transport_score >= 0 AND public_transport_score <= 100),
  crowd_score INTEGER NOT NULL CHECK (crowd_score >= 0 AND crowd_score <= 100),
  women_review_score INTEGER NOT NULL CHECK (women_review_score >= 0 AND women_review_score <= 100),
  budget_level VARCHAR(50) NOT NULL CHECK (budget_level IN ('Low', 'Medium', 'High')),
  activities JSONB NOT NULL DEFAULT '[]'::jsonb,
  coordinates JSONB NOT NULL,
  alerts JSONB NOT NULL DEFAULT '[]'::jsonb,
  pros JSONB NOT NULL DEFAULT '[]'::jsonb,
  cons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cities_safety_score ON cities(safety_score DESC);
CREATE INDEX IF NOT EXISTS idx_cities_state ON cities(state);
CREATE INDEX IF NOT EXISTS idx_cities_budget ON cities(budget_level);
CREATE INDEX IF NOT EXISTS idx_cities_city_name ON cities(city);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_cities_search ON cities USING GIN (to_tsvector('english', city || ' ' || state));

-- =============================================
-- INCIDENT REPORTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS incident_reports (
  id SERIAL PRIMARY KEY,
  city VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(10),
  location VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_city ON incident_reports(city);
CREATE INDEX IF NOT EXISTS idx_reports_date ON incident_reports(date DESC);
CREATE INDEX IF NOT EXISTS idx_reports_severity ON incident_reports(severity);
CREATE INDEX IF NOT EXISTS idx_reports_user ON incident_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created ON incident_reports(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on both tables
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;

-- =============================================
-- CITIES TABLE POLICIES
-- =============================================

-- Everyone can read cities (public data)
CREATE POLICY "Cities are viewable by everyone"
  ON cities
  FOR SELECT
  USING (true);

-- Only authenticated admins can insert cities
CREATE POLICY "Only admins can insert cities"
  ON cities
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only authenticated admins can update cities
CREATE POLICY "Only admins can update cities"
  ON cities
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only authenticated admins can delete cities
CREATE POLICY "Only admins can delete cities"
  ON cities
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =============================================
-- INCIDENT REPORTS TABLE POLICIES
-- =============================================

-- Everyone can read verified reports
CREATE POLICY "Verified reports are viewable by everyone"
  ON incident_reports
  FOR SELECT
  USING (status = 'verified' OR auth.uid() = user_id);

-- Authenticated users can insert their own reports
CREATE POLICY "Authenticated users can create reports"
  ON incident_reports
  FOR INSERT
  WITH CHECK (true); -- Allow anonymous reporting for safety

-- Users can update only their own reports
CREATE POLICY "Users can update own reports"
  ON incident_reports
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete only their own reports
CREATE POLICY "Users can delete own reports"
  ON incident_reports
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can update any report
CREATE POLICY "Admins can update any report"
  ON incident_reports
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for cities table
CREATE TRIGGER update_cities_updated_at
  BEFORE UPDATE ON cities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for incident_reports table
CREATE TRIGGER update_incident_reports_updated_at
  BEFORE UPDATE ON incident_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ANALYTICS VIEW (Read-only)
-- =============================================

CREATE OR REPLACE VIEW city_safety_analytics AS
SELECT
  state,
  COUNT(*) as city_count,
  ROUND(AVG(safety_score), 2) as avg_safety_score,
  ROUND(AVG(lighting_score), 2) as avg_lighting_score,
  ROUND(AVG(public_transport_score), 2) as avg_transport_score,
  ROUND(AVG(women_review_score), 2) as avg_review_score,
  COUNT(*) FILTER (WHERE safety_score >= 80) as high_safety_cities,
  COUNT(*) FILTER (WHERE safety_score BETWEEN 70 AND 79) as moderate_safety_cities,
  COUNT(*) FILTER (WHERE safety_score < 70) as low_safety_cities
FROM cities
GROUP BY state
ORDER BY avg_safety_score DESC;

-- Grant access to analytics view
GRANT SELECT ON city_safety_analytics TO anon, authenticated;

-- =============================================
-- INCIDENT STATISTICS VIEW
-- =============================================

CREATE OR REPLACE VIEW incident_statistics AS
SELECT
  city,
  COUNT(*) as total_incidents,
  COUNT(*) FILTER (WHERE severity = 'High') as high_severity,
  COUNT(*) FILTER (WHERE severity = 'Medium') as medium_severity,
  COUNT(*) FILTER (WHERE severity = 'Low') as low_severity,
  MAX(date) as last_incident_date
FROM incident_reports
WHERE status = 'verified'
GROUP BY city
ORDER BY total_incidents DESC;

-- Grant access to incident statistics view
GRANT SELECT ON incident_statistics TO anon, authenticated;

-- =============================================
-- SEED DATA (Optional - Comment out if using UI import)
-- =============================================

-- Note: Insert your cities data here if you want to seed the database
-- This can be generated from the cities-expanded.ts file

-- =============================================
-- STORAGE FOR USER UPLOADS (Optional)
-- =============================================

-- Create bucket for incident photos (if needed in future)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('incident-photos', 'incident-photos', false);

-- Storage policies
-- CREATE POLICY "Authenticated users can upload incident photos"
--   ON storage.objects
--   FOR INSERT
--   WITH CHECK (
--     bucket_id = 'incident-photos' 
--     AND auth.role() = 'authenticated'
--   );

-- =============================================
-- USEFUL QUERIES
-- =============================================

-- Get top 10 safest cities
-- SELECT * FROM cities ORDER BY safety_score DESC LIMIT 10;

-- Get cities by state
-- SELECT * FROM cities WHERE state = 'Karnataka' ORDER BY safety_score DESC;

-- Get recent incidents
-- SELECT * FROM incident_reports 
-- WHERE status = 'verified' 
-- ORDER BY created_at DESC 
-- LIMIT 10;

-- Get incident count by city
-- SELECT city, COUNT(*) as incident_count 
-- FROM incident_reports 
-- WHERE status = 'verified' 
-- GROUP BY city 
-- ORDER BY incident_count DESC;
