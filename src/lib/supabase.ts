import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helper functions
export const db = {
  // User profile operations
  getUserProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        branches (
          id,
          branch_name,
          branch_code,
          location
        )
      `)
      .eq('id', userId)
      .single();
    return { data, error };
  },

  updateUserProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        branches (
          id,
          branch_name,
          branch_code,
          location
        )
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Branch operations
  getBranches: async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .eq('status', 'active')
      .order('branch_name');
    return { data, error };
  },

  // Permission operations
  getUserPermissions: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', userId);
    return { data, error };
  },

  hasPermission: async (userId: string, module: string, permission: string) => {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('id')
      .eq('user_id', userId)
      .eq('module', module)
      .eq('permission', permission)
      .single();
    return { hasPermission: !!data && !error, error };
  }
};