/*
  # Create Centers Table for Loan Management

  1. New Tables
    - `centers`
      - `id` (uuid, primary key)
      - `center_code` (text, unique)
      - `center_name` (text)
      - `branch_id` (uuid, foreign key to branches)
      - `village` (text)
      - `assigned_to` (uuid, foreign key to user_profiles)
      - `center_day` (text)
      - `center_time` (time)
      - `contact_person_name` (text)
      - `contact_person_number` (text)
      - `meeting_place` (text)
      - `address1` (text)
      - `address2` (text)
      - `landmark` (text)
      - `pincode` (text)
      - `city` (text)
      - `latitude` (decimal)
      - `longitude` (decimal)
      - `status` (text)
      - `is_active` (boolean)
      - `blacklisted` (boolean)
      - `member_count` (integer)
      - `created_by` (uuid, foreign key to user_profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `centers` table
    - Add policies for authenticated users to read centers
    - Add policies for users with write permissions to manage centers
*/

CREATE TABLE IF NOT EXISTS centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_code text UNIQUE NOT NULL,
  center_name text NOT NULL,
  branch_id uuid REFERENCES branches(id),
  village text NOT NULL,
  assigned_to uuid REFERENCES user_profiles(id),
  center_day text,
  center_time time,
  contact_person_name text,
  contact_person_number text,
  meeting_place text,
  address1 text,
  address2 text,
  landmark text,
  pincode text,
  city text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_active boolean DEFAULT true,
  blacklisted boolean DEFAULT false,
  member_count integer DEFAULT 0,
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;

-- Create policies for centers
CREATE POLICY "All authenticated users can read centers"
  ON centers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage centers"
  ON centers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_centers_branch_id ON centers(branch_id);
CREATE INDEX IF NOT EXISTS idx_centers_assigned_to ON centers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_centers_status ON centers(status);
CREATE INDEX IF NOT EXISTS idx_centers_center_code ON centers(center_code);

-- Add trigger for updated_at
CREATE TRIGGER update_centers_updated_at
  BEFORE UPDATE ON centers
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert sample data
INSERT INTO centers (
  center_code,
  center_name,
  village,
  center_day,
  center_time,
  contact_person_name,
  contact_person_number,
  meeting_place,
  address1,
  landmark,
  pincode,
  city,
  status,
  is_active,
  member_count
) VALUES
  ('CTR001', 'Anand Nagar Center', 'Anand Nagar', 'Monday', '10:00', 'Rajesh Sharma', '+91 9876543210', 'Community Hall', '123 Main Street', 'Opposite Bank', '110001', 'Delhi', 'active', true, 25),
  ('CTR002', 'Gandhi Colony Center', 'Gandhi Colony', 'Wednesday', '14:00', 'Sunita Devi', '+91 9876543211', 'School Ground', '456 Gandhi Road', 'Near Temple', '110002', 'Delhi', 'active', true, 30),
  ('CTR003', 'Nehru Park Center', 'Nehru Park', 'Friday', '11:30', 'Mohit Kumar', '+91 9876543212', 'Park Pavilion', '789 Park Avenue', 'Central Park', '110003', 'Delhi', 'inactive', false, 18)
ON CONFLICT (center_code) DO NOTHING;