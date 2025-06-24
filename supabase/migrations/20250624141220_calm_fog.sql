/*
  # Remove Centers Table and Related Data

  1. Drop Table
    - Drop the `centers` table completely
    - Remove all related indexes, triggers, and policies
    - Clean up any foreign key references

  2. Clean Up
    - Remove all center-related data
    - Clean up any orphaned records
*/

-- Drop all policies first
DROP POLICY IF EXISTS "All authenticated users can read centers" ON centers;
DROP POLICY IF EXISTS "Authenticated users can manage centers" ON centers;

-- Drop all triggers
DROP TRIGGER IF EXISTS update_centers_updated_at ON centers;

-- Drop all indexes
DROP INDEX IF EXISTS idx_centers_branch_id;
DROP INDEX IF EXISTS idx_centers_assigned_to;
DROP INDEX IF EXISTS idx_centers_status;
DROP INDEX IF EXISTS idx_centers_center_code;

-- Drop the centers table completely
DROP TABLE IF EXISTS centers CASCADE;

-- Note: This will permanently delete all center data from the database
-- Make sure this is what you want before running this migration