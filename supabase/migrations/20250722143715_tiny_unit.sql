/*
  # Add RBAC Roles to System

  1. New Tables
    - `roles` table for storing role definitions
    - Updated `user_profiles` table to support new roles
  
  2. Security
    - Enable RLS on roles table
    - Add policies for role management
  
  3. Data
    - Insert all required roles with descriptions
    - Update user_profiles role constraint
*/

-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name text UNIQUE NOT NULL,
  role_code text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on roles table
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create policies for roles table
CREATE POLICY "Authenticated users can read roles"
  ON roles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'Admin')
    )
  );

-- Create updated_at trigger for roles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_roles_updated_at 
  BEFORE UPDATE ON roles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert all the required roles
INSERT INTO roles (role_name, role_code, description) VALUES
  ('External_sanction', 'external_sanction', 'Role for external sanction operations'),
  ('Admin', 'admin', 'Administrator role with full system access'),
  ('MIS', 'mis', 'Management Information System role'),
  ('Receipt_payment', 'receipt_payment', 'Role for receipt and payment operations'),
  ('Bypass_2FA', 'bypass_2fa', 'Role to bypass two-factor authentication'),
  ('Loan_Waiver', 'loan_waiver', 'Role for loan waiver operations'),
  ('Role_SCV', 'role_scv', 'SCV role for specific operations'),
  ('Role_BC', 'role_bc', 'Business Correspondent role'),
  ('Role_Insurance', 'role_insurance', 'Insurance operations role'),
  ('Role_BM', 'role_bm', 'Branch Manager role'),
  ('Role_HO', 'role_ho', 'Head Office role'),
  ('Role_HR', 'role_hr', 'Human Resources role'),
  ('Role_Accountant', 'role_accountant', 'Accountant role'),
  ('Role_Chief_Accountant', 'role_chief_accountant', 'Chief Accountant role'),
  ('Role_Funder_Tag', 'role_funder_tag', 'Funder tagging role'),
  ('Role_Voucher_Booking', 'role_voucher_booking', 'Voucher booking role'),
  ('Role_Voucher_Approval', 'role_voucher_approval', 'Voucher approval role'),
  ('Role_FO', 'role_fo', 'Field Officer role'),
  ('Role_Auditor', 'role_auditor', 'Auditor role'),
  ('Role_BR_Book_Debt', 'role_br_book_debt', 'Book debt role'),
  ('Role_TDS', 'role_tds', 'TDS operations role'),
  ('Role_Credit_Bureau_Page', 'role_credit_bureau_page', 'Credit bureau page access role'),
  ('Role_BR_Aging', 'role_br_aging', 'Aging report role'),
  ('Role_LOS', 'role_los', 'Loan Origination System role'),
  ('Role_Loan_Hub', 'role_loan_hub', 'Loan hub access role'),
  ('Role_BR_Dialy_Info', 'role_br_daily_info', 'Daily information role'),
  ('Role_BR_Dormant', 'role_br_dormant', 'Dormant account role'),
  ('Role_BR_Future', 'role_br_future', 'Future operations role'),
  ('Role_BR_Glance', 'role_br_glance', 'Glance report role'),
  ('Role_BR_Overdue', 'role_br_overdue', 'Overdue management role'),
  ('Role_Client_Black_Listed', 'role_client_black_listed', 'Client blacklist management role'),
  ('Role_Audit_Module', 'role_audit_module', 'Audit module access role'),
  ('Role_Abm', 'role_abm', 'ABM role'),
  ('Role_Inventory', 'role_inventory', 'Inventory management role'),
  ('Role_Tele_Caller', 'role_tele_caller', 'Tele caller role'),
  ('Role_Voucher_Back_Date_Posting', 'role_voucher_back_date_posting', 'Back date voucher posting role'),
  ('Role_NEFT_Disb', 'role_neft_disb', 'NEFT disbursement role'),
  ('Role_Legal_Doc', 'role_legal_doc', 'Legal document role'),
  ('Role_Demo', 'role_demo', 'Demo access role'),
  ('Role_Fig', 'role_fig', 'FIG role'),
  ('Role_PennyDrop_Validate', 'role_pennydrop_validate', 'Penny drop validation role'),
  ('Role_Attendance_Edit', 'role_attendance_edit', 'Attendance editing role'),
  ('Role_Miscellaneous_RPT', 'role_miscellaneous_rpt', 'Miscellaneous report role'),
  ('Role_Doc_Veri_Admin', 'role_doc_veri_admin', 'Document verification admin role'),
  ('Role_Dashboard', 'role_dashboard', 'Dashboard access role'),
  ('Role_Bulk_Vou_Narration', 'role_bulk_vou_narration', 'Bulk voucher narration role'),
  ('Role_Doc_Lead', 'role_doc_lead', 'Document lead role'),
  ('Role_Ledger_Book', 'role_ledger_book', 'Ledger book access role'),
  ('Role_Incentive_Dashboard', 'role_incentive_dashboard', 'Incentive dashboard role'),
  ('Role_Ledger_Book_vendor', 'role_ledger_book_vendor', 'Vendor ledger book role'),
  ('Role_DM', 'role_dm', 'District Manager role'),
  ('Role_QCT', 'role_qct', 'QCT role'),
  ('Role_ZM', 'role_zm', 'Zonal Manager role'),
  ('Role_DOC_Verify', 'role_doc_verify', 'Document verification role'),
  ('Role_client', 'role_client', 'Client role'),
  ('Role_Memo_Book', 'role_memo_book', 'Memo book role'),
  ('Role_HO_IT', 'role_ho_it', 'Head Office IT role'),
  ('Role_Salary_Uploader', 'role_salary_uploader', 'Salary uploader role'),
  ('Role_Vendor_Master', 'role_vendor_master', 'Vendor master role'),
  ('Role_State_IT', 'role_state_it', 'State IT role'),
  ('Role_CRM_Loan_Sanction', 'role_crm_loan_sanction', 'CRM loan sanction role'),
  ('Role_App_Restrict', 'role_app_restrict', 'Application restriction role')
ON CONFLICT (role_name) DO NOTHING;

-- Update user_profiles table to support new roles
DO $$
BEGIN
  -- Drop the existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_profiles_role_check' 
    AND table_name = 'user_profiles'
  ) THEN
    ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_role_check;
  END IF;
  
  -- Add new constraint that allows any role from the roles table
  ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check 
    CHECK (
      role IN (
        SELECT role_code FROM roles WHERE is_active = true
      ) OR role IN (
        'admin', 'manager', 'finance_officer', 'loan_officer', 
        'field_officer', 'viewer', 'editor'
      )
    );
EXCEPTION
  WHEN OTHERS THEN
    -- If constraint update fails, just log it
    RAISE NOTICE 'Could not update role constraint: %', SQLERRM;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roles_role_code ON roles(role_code);
CREATE INDEX IF NOT EXISTS idx_roles_is_active ON roles(is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);