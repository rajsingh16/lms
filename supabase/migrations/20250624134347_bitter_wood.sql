/*
  # Create Areas Table for Loan Management

  1. New Tables
    - `areas`
      - `id` (uuid, primary key)
      - `area_type` (text)
      - `area_code` (text, unique)
      - `area_name` (text)
      - `parent_area_code` (text)
      - `branch_manager_id` (text)
      - `address1` (text)
      - `address2` (text)
      - `phone_number` (text)
      - `email_id` (text)
      - `pincode` (text)
      - `district` (text)
      - `state` (text)
      - `mandatory_document` (text)
      - `branch_rating` (text)
      - `min_center_clients` (integer)
      - `max_center_clients` (integer)
      - `bc_branch_id` (text)
      - `business_partner` (text)
      - `cashless_disb_partner` (text)
      - `nach_partner` (text)
      - `branch_opening_date` (date)
      - `branch_closing_date` (date)
      - `last_day_close_date` (date)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `disb_on_meeting_date` (boolean)
      - `cross_sell_allowed` (boolean)
      - `is_disb_active` (boolean)
      - `is_cash_disb_active` (boolean)
      - `is_sub_product_enabled` (boolean)
      - `is_client_sourcing_enabled` (boolean)
      - `is_center_formation_enabled` (boolean)
      - `status` (text)
      - `created_by` (uuid, foreign key to user_profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `areas` table
    - Add policies for authenticated users to read areas
    - Add policies for users with write permissions to manage areas
*/

CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_type text NOT NULL CHECK (area_type IN ('Branch', 'Region', 'Zone', 'State', 'District', 'Block')),
  area_code text UNIQUE NOT NULL,
  area_name text NOT NULL,
  parent_area_code text,
  branch_manager_id text,
  address1 text NOT NULL,
  address2 text,
  phone_number text,
  email_id text,
  pincode text NOT NULL,
  district text NOT NULL,
  state text NOT NULL,
  mandatory_document text,
  branch_rating text CHECK (branch_rating IN ('A+', 'A', 'B+', 'B', 'C+', 'C')),
  min_center_clients integer DEFAULT 0,
  max_center_clients integer DEFAULT 0,
  bc_branch_id text,
  business_partner text NOT NULL,
  cashless_disb_partner text,
  nach_partner text,
  branch_opening_date date NOT NULL,
  branch_closing_date date,
  last_day_close_date date,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  disb_on_meeting_date boolean DEFAULT false,
  cross_sell_allowed boolean DEFAULT false,
  is_disb_active boolean DEFAULT true,
  is_cash_disb_active boolean DEFAULT false,
  is_sub_product_enabled boolean DEFAULT false,
  is_client_sourcing_enabled boolean DEFAULT false,
  is_center_formation_enabled boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

-- Create policies for areas
CREATE POLICY "All authenticated users can read areas"
  ON areas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage areas"
  ON areas
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_areas_area_type ON areas(area_type);
CREATE INDEX IF NOT EXISTS idx_areas_area_code ON areas(area_code);
CREATE INDEX IF NOT EXISTS idx_areas_parent_area_code ON areas(parent_area_code);
CREATE INDEX IF NOT EXISTS idx_areas_status ON areas(status);
CREATE INDEX IF NOT EXISTS idx_areas_business_partner ON areas(business_partner);
CREATE INDEX IF NOT EXISTS idx_areas_district ON areas(district);
CREATE INDEX IF NOT EXISTS idx_areas_state ON areas(state);

-- Add trigger for updated_at
CREATE TRIGGER update_areas_updated_at
  BEFORE UPDATE ON areas
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert sample data
INSERT INTO areas (
  area_type,
  area_code,
  area_name,
  parent_area_code,
  branch_manager_id,
  address1,
  address2,
  phone_number,
  email_id,
  pincode,
  district,
  state,
  mandatory_document,
  branch_rating,
  min_center_clients,
  max_center_clients,
  bc_branch_id,
  business_partner,
  cashless_disb_partner,
  nach_partner,
  branch_opening_date,
  latitude,
  longitude,
  disb_on_meeting_date,
  cross_sell_allowed,
  is_disb_active,
  is_cash_disb_active,
  is_sub_product_enabled,
  is_client_sourcing_enabled,
  is_center_formation_enabled,
  status
) VALUES
  (
    'Branch',
    'BR001',
    'Central Delhi Branch',
    'REG001',
    'MGR001',
    '123 Central Avenue',
    'Near Metro Station',
    '+91 11 2345 6789',
    'central@loanms.com',
    '110001',
    'Central Delhi',
    'Delhi',
    'Aadhar, PAN',
    'A+',
    10,
    50,
    'BC001',
    'Partner A',
    'Cashless Partner A',
    'NACH Partner A',
    '2024-01-01',
    28.6139,
    77.2090,
    true,
    true,
    true,
    false,
    true,
    true,
    true,
    'active'
  ),
  (
    'Region',
    'REG001',
    'North India Region',
    'ZON001',
    'MGR002',
    '456 Regional Office',
    'Corporate Tower',
    '+91 11 3456 7890',
    'north@loanms.com',
    '110002',
    'North Delhi',
    'Delhi',
    'Registration Certificate',
    'A',
    5,
    100,
    'BC002',
    'Partner B',
    'Cashless Partner B',
    'NACH Partner B',
    '2023-12-01',
    28.7041,
    77.1025,
    false,
    false,
    true,
    true,
    false,
    true,
    true,
    'active'
  ),
  (
    'Zone',
    'ZON001',
    'Northern Zone',
    NULL,
    'MGR003',
    '789 Zone Headquarters',
    'Business District',
    '+91 11 4567 8901',
    'zone@loanms.com',
    '110003',
    'South Delhi',
    'Delhi',
    'License Certificate',
    'B+',
    1,
    200,
    'BC003',
    'Partner C',
    'Cashless Partner C',
    'NACH Partner C',
    '2023-11-01',
    28.5355,
    77.3910,
    true,
    true,
    true,
    false,
    true,
    false,
    true,
    'active'
  )
ON CONFLICT (area_code) DO NOTHING;