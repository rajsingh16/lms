import { supabase } from '../lib/supabase';
import { Role, RolePermission, ROLE_CODES } from '../types/roles';

class RoleService {
  /**
   * Get all roles from the database
   */
  async getAllRoles(): Promise<Role[]> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('is_active', true)
        .order('role_name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new Error('Failed to fetch roles');
    }
  }

  /**
   * Get role by code
   */
  async getRoleByCode(roleCode: string): Promise<Role | null> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('role_code', roleCode)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data || null;
    } catch (error) {
      console.error('Error fetching role by code:', error);
      throw new Error('Failed to fetch role');
    }
  }

  /**
   * Create a new role
   */
  async createRole(roleData: {
    role_name: string;
    role_code: string;
    description?: string;
  }): Promise<Role> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert({
          role_name: roleData.role_name,
          role_code: roleData.role_code,
          description: roleData.description,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw new Error('Failed to create role');
    }
  }

  /**
   * Update a role
   */
  async updateRole(id: string, updates: Partial<Role>): Promise<Role> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw new Error('Failed to update role');
    }
  }

  /**
   * Deactivate a role (soft delete)
   */
  async deactivateRole(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('roles')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deactivating role:', error);
      throw new Error('Failed to deactivate role');
    }
  }

  /**
   * Check if a role exists
   */
  async roleExists(roleCode: string): Promise<boolean> {
    try {
      const role = await this.getRoleByCode(roleCode);
      return role !== null;
    } catch (error) {
      console.error('Error checking if role exists:', error);
      return false;
    }
  }

  /**
   * Bulk insert roles (useful for seeding)
   */
  async bulkInsertRoles(roles: Array<{
    role_name: string;
    role_code: string;
    description?: string;
  }>): Promise<Role[]> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .upsert(
          roles.map(role => ({
            role_name: role.role_name,
            role_code: role.role_code,
            description: role.description,
            is_active: true
          })),
          { 
            onConflict: 'role_code',
            ignoreDuplicates: true 
          }
        )
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error bulk inserting roles:', error);
      throw new Error('Failed to bulk insert roles');
    }
  }

  /**
   * Get roles for dropdown/select components
   */
  async getRolesForSelect(): Promise<Array<{ value: string; label: string }>> {
    try {
      const roles = await this.getAllRoles();
      return roles.map(role => ({
        value: role.role_code,
        label: role.role_name
      }));
    } catch (error) {
      console.error('Error fetching roles for select:', error);
      return [];
    }
  }
}

export const roleService = new RoleService();