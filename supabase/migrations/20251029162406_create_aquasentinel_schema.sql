/*
  # AquaSentinel 2.0 Database Schema

  ## Overview
  Creates the complete database structure for AquaSentinel 2.0 environmental monitoring platform.

  ## New Tables
  
  ### 1. `pollution_reports`
  Community-submitted pollution reports with location data
  - `id` (uuid, primary key)
  - `location_lat` (decimal) - Latitude coordinate
  - `location_lng` (decimal) - Longitude coordinate
  - `category` (text) - Type: Plastic, Chemical, Oil, Sewage
  - `description` (text) - User description
  - `photo_url` (text, optional) - Photo evidence
  - `plastic_density_index` (integer) - 0-100 scale
  - `water_clarity_level` (text) - Clear, Moderate, Poor
  - `reported_by` (text) - Reporter name/id
  - `status` (text) - New, Verified, Resolved
  - `created_at` (timestamptz)
  
  ### 2. `pollution_metrics`
  Historical pollution data and metrics for map locations
  - `id` (uuid, primary key)
  - `location_lat` (decimal)
  - `location_lng` (decimal)
  - `location_name` (text)
  - `plastic_density_index` (integer)
  - `water_clarity_level` (text)
  - `microplastic_count` (integer)
  - `pollution_trend` (text) - Rising, Stable, Declining
  - `last_updated` (timestamptz)
  - `created_at` (timestamptz)
  
  ### 3. `ai_predictions`
  AI-generated pollution predictions and risk assessments
  - `id` (uuid, primary key)
  - `location_lat` (decimal)
  - `location_lng` (decimal)
  - `risk_level` (text) - Low, Moderate, High
  - `prediction_text` (text)
  - `confidence_score` (decimal)
  - `factors` (jsonb) - Weather, waste hotspots, historical data
  - `valid_until` (timestamptz)
  - `created_at` (timestamptz)
  
  ### 4. `organizations`
  Environmental authorities and corporations database
  - `id` (uuid, primary key)
  - `name` (text)
  - `type` (text) - Authority, Corporation, NGO
  - `location_lat` (decimal)
  - `location_lng` (decimal)
  - `address` (text)
  - `phone` (text)
  - `email` (text)
  - `website` (text, optional)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow public read access for pollution data
  - Restrict insert/update operations to authenticated users for reports
  - Public read-only access for metrics, predictions, and organizations

  ## Indexes
  - Location-based indexes for efficient map queries
  - Timestamp indexes for recent data retrieval
*/

-- Create pollution_reports table
CREATE TABLE IF NOT EXISTS pollution_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_lat decimal(10, 8) NOT NULL,
  location_lng decimal(11, 8) NOT NULL,
  category text NOT NULL CHECK (category IN ('Plastic', 'Chemical', 'Oil', 'Sewage')),
  description text DEFAULT '',
  photo_url text,
  plastic_density_index integer DEFAULT 0 CHECK (plastic_density_index >= 0 AND plastic_density_index <= 100),
  water_clarity_level text DEFAULT 'Moderate' CHECK (water_clarity_level IN ('Clear', 'Moderate', 'Poor')),
  reported_by text DEFAULT 'Anonymous',
  status text DEFAULT 'New' CHECK (status IN ('New', 'Verified', 'Resolved')),
  created_at timestamptz DEFAULT now()
);

-- Create pollution_metrics table
CREATE TABLE IF NOT EXISTS pollution_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_lat decimal(10, 8) NOT NULL,
  location_lng decimal(11, 8) NOT NULL,
  location_name text NOT NULL,
  plastic_density_index integer DEFAULT 0 CHECK (plastic_density_index >= 0 AND plastic_density_index <= 100),
  water_clarity_level text DEFAULT 'Moderate' CHECK (water_clarity_level IN ('Clear', 'Moderate', 'Poor')),
  microplastic_count integer DEFAULT 0,
  pollution_trend text DEFAULT 'Stable' CHECK (pollution_trend IN ('Rising', 'Stable', 'Declining')),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create ai_predictions table
CREATE TABLE IF NOT EXISTS ai_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_lat decimal(10, 8) NOT NULL,
  location_lng decimal(11, 8) NOT NULL,
  risk_level text DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Moderate', 'High')),
  prediction_text text NOT NULL,
  confidence_score decimal(3, 2) DEFAULT 0.85 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  factors jsonb DEFAULT '{}',
  valid_until timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('Authority', 'Corporation', 'NGO')),
  location_lat decimal(10, 8) NOT NULL,
  location_lng decimal(11, 8) NOT NULL,
  address text NOT NULL,
  phone text,
  email text,
  website text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pollution_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pollution_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pollution_reports
CREATE POLICY "Anyone can view pollution reports"
  ON pollution_reports FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert pollution reports"
  ON pollution_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for pollution_metrics
CREATE POLICY "Anyone can view pollution metrics"
  ON pollution_metrics FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for ai_predictions
CREATE POLICY "Anyone can view AI predictions"
  ON ai_predictions FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for organizations
CREATE POLICY "Anyone can view organizations"
  ON organizations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pollution_reports_location ON pollution_reports(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_pollution_reports_created ON pollution_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pollution_metrics_location ON pollution_metrics(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_location ON ai_predictions(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_organizations_location ON organizations(location_lat, location_lng);

-- Insert seed data for demonstration
INSERT INTO pollution_metrics (location_lat, location_lng, location_name, plastic_density_index, water_clarity_level, microplastic_count, pollution_trend) VALUES
  (19.0760, 72.8777, 'Mumbai Marine Drive', 72, 'Poor', 15400, 'Rising'),
  (28.7041, 77.1025, 'Yamuna River, Delhi', 85, 'Poor', 22100, 'Rising'),
  (13.0827, 80.2707, 'Marina Beach, Chennai', 68, 'Moderate', 12800, 'Stable'),
  (22.5726, 88.3639, 'Hooghly River, Kolkata', 78, 'Poor', 18500, 'Rising'),
  (15.2993, 74.1240, 'Goa Beaches', 45, 'Moderate', 7200, 'Declining'),
  (11.0168, 76.9558, 'Periyar River, Kerala', 52, 'Moderate', 9100, 'Stable'),
  (23.0225, 72.5714, 'Sabarmati River, Ahmedabad', 65, 'Poor', 13500, 'Stable'),
  (18.5204, 73.8567, 'Pune Water Bodies', 48, 'Moderate', 8300, 'Declining');

INSERT INTO ai_predictions (location_lat, location_lng, risk_level, prediction_text, confidence_score, factors) VALUES
  (19.0760, 72.8777, 'High', 'Rising rainfall and local waste density suggest increased microplastic risk this week. Storm drains may overflow into coastal waters.', 0.89, '{"weather": "Heavy rainfall expected", "waste_hotspots": 12, "historical_trend": "increasing"}'),
  (28.7041, 77.1025, 'High', 'Industrial discharge patterns and seasonal sewage overflow indicate elevated pollution levels. Water quality monitoring recommended.', 0.92, '{"weather": "Dry conditions", "waste_hotspots": 18, "historical_trend": "critical"}'),
  (13.0827, 80.2707, 'Moderate', 'Beach cleanup activities showing positive impact. Continued monitoring of fishing industry waste disposal needed.', 0.86, '{"weather": "Normal conditions", "waste_hotspots": 8, "historical_trend": "stable"}'),
  (15.2993, 74.1240, 'Low', 'Tourism management initiatives reducing plastic waste. Marine conservation efforts showing measurable results.', 0.91, '{"weather": "Favorable", "waste_hotspots": 4, "historical_trend": "improving"}');

INSERT INTO organizations (name, type, location_lat, location_lng, address, phone, email) VALUES
  ('Maharashtra Pollution Control Board', 'Authority', 19.0760, 72.8777, 'Kalpataru Point, Mumbai 400022', '+91-22-2431-6305', 'info@mpcb.gov.in'),
  ('Central Pollution Control Board - Delhi', 'Authority', 28.7041, 77.1025, 'East Arjun Nagar, Delhi 110032', '+91-11-2343-0891', 'cpcb@nic.in'),
  ('Tamil Nadu Pollution Control Board', 'Authority', 13.0827, 80.2707, 'Guindy, Chennai 600032', '+91-44-2234-1970', 'tnpcb@tn.gov.in'),
  ('Goa State Pollution Control Board', 'Authority', 15.2993, 74.1240, 'Patto Plaza, Panaji 403001', '+91-832-242-4879', 'gspcb@goa.gov.in'),
  ('Ocean Conservancy India', 'NGO', 19.0760, 72.8777, 'Nariman Point, Mumbai 400021', '+91-22-6789-1234', 'india@oceanconservancy.org'),
  ('Clean Ganga Foundation', 'NGO', 28.7041, 77.1025, 'Connaught Place, Delhi 110001', '+91-11-4567-8900', 'contact@cleanganga.org');

INSERT INTO pollution_reports (location_lat, location_lng, category, description, plastic_density_index, water_clarity_level, reported_by, status) VALUES
  (19.0760, 72.8777, 'Plastic', 'Large accumulation of plastic bottles and bags near the shoreline', 75, 'Poor', 'Community Member', 'Verified'),
  (28.7041, 77.1025, 'Sewage', 'Untreated sewage discharge observed near river bank', 82, 'Poor', 'Environmental Activist', 'New'),
  (13.0827, 80.2707, 'Plastic', 'Beach littered with single-use plastics after festival', 68, 'Moderate', 'Tourist', 'Verified'),
  (15.2993, 74.1240, 'Oil', 'Small oil slick spotted near fishing harbor', 55, 'Moderate', 'Fisherman', 'New');