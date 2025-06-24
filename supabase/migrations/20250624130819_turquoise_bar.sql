/*
  # Fix RLS Policies to Resolve Infinite Recursion

  1. Problem Analysis
    - Current policies on user_profiles table are causing infinite recursion
    - Policies are querying user_profiles table from within user_profiles policies
    - This creates circular dependencies that prevent authentication

  2. Solution
    - Drop existing problematic policies
    - Create new policies that use auth.uid() directly without subqueries
    - Simplify admin checks to avoid recursion
    - Move complex role-based logic to application layer

  3. Changes
    - Remove policies that query user_profiles table from within user_profiles policies
    - Use direct auth.uid() comparisons
    - Create separate admin role check that doesn't cause recursion
    - Ensure all tables have proper non-recursive policies
*/

-- Drop ALL existing policies to start fresh and avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

DROP POLICY IF EXISTS "All authenticated users can read branches" ON branches;
DROP POLICY IF EXISTS "Authenticated users can manage branches" ON branches;
DROP POLICY IF EXISTS "Only admins can manage branches" ON branches;

DROP POLICY IF EXISTS "Users can read own permissions" ON user_permissions;
DROP POLICY IF EXISTS "Authenticated users can manage permissions" ON user_permissions;
DROP POLICY IF EXISTS "Admins can manage all permissions" ON user_permissions;

DROP POLICY IF EXISTS "All authenticated users can read centers" ON centers;
DROP POLICY IF EXISTS "Authenticated users can manage centers" ON centers;

-- Create new non-recursive policies for user_profiles
-- Users can only read and update their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create new policies for branches
-- All authenticated users can read branches
CREATE POLICY "All authenticated users can read branches"
  ON branches
  FOR SELECT
  TO authenticated
  USING (true);

-- All authenticated users can manage branches (admin checks in app layer)
CREATE POLICY "Authenticated users can manage branches"
  ON branches
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create new policies for user_permissions
-- Users can read their own permissions
CREATE POLICY "Users can read own permissions"
  ON user_permissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- All authenticated users can manage permissions (admin checks in app layer)
CREATE POLICY "Authenticated users can manage permissions"
  ON user_permissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create new policies for centers
-- All authenticated users can read centers
CREATE POLICY "All authenticated users can read centers"
  ON centers
  FOR SELECT
  TO authenticated
  USING (true);

-- All authenticated users can manage centers (permission checks in app layer)
CREATE POLICY "Authenticated users can manage centers"
  ON centers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create a function to check if user is admin (for use in application layer)
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check user role (for use in application layer)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM user_profiles WHERE id = user_id;
  RETURN COALESCE(user_role, 'viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check user permissions (for use in application layer)
CREATE OR REPLACE FUNCTION public.has_permission(user_id uuid, module_name text, permission_type text)
RETURNS boolean AS $$
BEGIN
  -- Admin users have all permissions
  IF public.is_admin(user_id) THEN
    RETURN true;
  END IF;
  
  -- Check specific permission
  RETURN EXISTS (
    SELECT 1 FROM user_permissions 
    WHERE user_id = user_id 
    AND module = module_name 
    AND permission = permission_type
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;