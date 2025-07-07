import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.warn('Unusual Supabase URL format. Expected format: https://your-project.supabase.co');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
  }
});

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { data, error };
    } catch (error) {
      console.error('Auth signup error:', error);
      return { data: null, error: { message: 'Network error during signup. Please check your connection.' } };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      console.error('Auth signin error:', error);
      return { data: null, error: { message: 'Network error during signin. Please check your connection.' } };
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Auth signout error:', error);
      return { error: { message: 'Network error during signout.' } };
    }
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helper functions
export const db = {
  // User profile operations
  getUserProfile: async (userId: string) => {
    try {
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
    } catch (error) {
      console.error('Get user profile error:', error);
      return { data: null, error: { message: 'Network error getting user profile.' } };
    }
  },

  updateUserProfile: async (userId: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { data: null, error: { message: 'Network error updating user profile.' } };
    }
  },

  getAllUsers: async () => {
    try {
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
    } catch (error) {
      console.error('Get all users error:', error);
      return { data: null, error: { message: 'Network error getting users.' } };
    }
  },

  // Branch operations
  getBranches: async () => {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('status', 'active')
        .order('branch_name');
      return { data, error };
    } catch (error) {
      console.error('Get branches error:', error);
      return { data: null, error: { message: 'Network error getting branches.' } };
    }
  },

  // Permission operations
  getUserPermissions: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId);
      return { data, error };
    } catch (error) {
      console.error('Get user permissions error:', error);
      return { data: null, error: { message: 'Network error getting permissions.' } };
    }
  },

  hasPermission: async (userId: string, module: string, permission: string) => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('id')
        .eq('user_id', userId)
        .eq('module', module)
        .eq('permission', permission)
        .single();
      return { hasPermission: !!data && !error, error };
    } catch (error) {
      console.error('Check permission error:', error);
      return { hasPermission: false, error: { message: 'Network error checking permissions.' } };
    }
  }
};