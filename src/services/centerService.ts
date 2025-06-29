import { supabase } from '../lib/supabase';
import { Center, CenterFormData } from '../types/center';

class CenterService {
  async getAllCenters(): Promise<Center[]> {
    try {
      const { data, error } = await supabase
        .from('centers')
        .select(`
          *,
          branches (id, branch_name, branch_code),
          assigned_user:user_profiles!centers_assigned_to_fkey (id, first_name, last_name),
          created_user:user_profiles!centers_created_by_fkey (id, first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(center => ({
        id: center.id,
        centerCode: center.center_code,
        centerName: center.center_name,
        branchId: center.branch_id,
        branchName: center.branches ? center.branches.branch_name : '',
        centerDay: center.center_day || '',
        centerTime: center.center_time ? new Date(center.center_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        status: center.status,
        blacklisted: center.blacklisted,
        assignedTo: center.assigned_to,
        assignedToName: center.assigned_user ? `${center.assigned_user.first_name} ${center.assigned_user.last_name}` : '',
        bcCenterId: center.bc_center_id,
        parentCenterId: center.parent_center_id,
        contactPersonName: center.contact_person_name,
        contactPersonNumber: center.contact_person_number,
        address1: center.address1 || '',
        address2: center.address2,
        landmark: center.landmark,
        pincode: center.pincode,
        villageId: center.village,
        villageName: center.village || '',
        city: center.city,
        meetingPlace: center.meeting_place,
        latitude: center.latitude ? parseFloat(center.latitude) : undefined,
        longitude: center.longitude ? parseFloat(center.longitude) : undefined,
        createdBy: center.created_user ? `${center.created_user.first_name} ${center.created_user.last_name}` : 'System',
        createdAt: center.created_at.split('T')[0],
        updatedAt: center.updated_at ? center.updated_at.split('T')[0] : undefined,
        memberCount: center.member_count || 0
      }));
    } catch (error) {
      console.error('Error fetching centers:', error);
      throw new Error('Failed to fetch centers');
    }
  }

  async createCenter(formData: CenterFormData): Promise<Center> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate center code
      const { data: branch } = await supabase
        .from('branches')
        .select('branch_code')
        .eq('id', formData.branchId)
        .single();
      
      const branchCode = branch?.branch_code || 'CTR';
      const centerCode = `${branchCode}${String(Date.now()).slice(-4)}`;

      const { data, error } = await supabase
        .from('centers')
        .insert({
          center_code: centerCode,
          center_name: formData.centerName,
          branch_id: formData.branchId,
          village: formData.villageId,
          assigned_to: formData.assignedTo,
          center_day: formData.centerDay,
          center_time: formData.centerTime,
          contact_person_name: formData.contactPersonName,
          contact_person_number: formData.contactPersonNumber,
          meeting_place: formData.meetingPlace,
          address1: formData.address1,
          address2: formData.address2,
          landmark: formData.landmark,
          pincode: formData.pincode,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: formData.status || 'active',
          blacklisted: formData.blacklisted || false,
          bc_center_id: formData.bcCenterId,
          parent_center_id: formData.parentCenterId,
          created_by: user.id
        })
        .select(`
          *,
          branches (id, branch_name, branch_code),
          assigned_user:user_profiles!centers_assigned_to_fkey (id, first_name, last_name)
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        centerCode: data.center_code,
        centerName: data.center_name,
        branchId: data.branch_id,
        branchName: data.branches ? data.branches.branch_name : '',
        centerDay: data.center_day || '',
        centerTime: data.center_time ? new Date(data.center_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        status: data.status,
        blacklisted: data.blacklisted,
        assignedTo: data.assigned_to,
        assignedToName: data.assigned_user ? `${data.assigned_user.first_name} ${data.assigned_user.last_name}` : '',
        bcCenterId: data.bc_center_id,
        parentCenterId: data.parent_center_id,
        contactPersonName: data.contact_person_name,
        contactPersonNumber: data.contact_person_number,
        address1: data.address1 || '',
        address2: data.address2,
        landmark: data.landmark,
        pincode: data.pincode,
        villageId: data.village,
        villageName: data.village || '',
        city: data.city,
        meetingPlace: data.meeting_place,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        createdBy: 'Current User',
        createdAt: data.created_at.split('T')[0],
        updatedAt: data.updated_at ? data.updated_at.split('T')[0] : undefined,
        memberCount: data.member_count || 0
      };
    } catch (error) {
      console.error('Error creating center:', error);
      throw new Error('Failed to create center');
    }
  }

  async updateCenter(id: string, formData: CenterFormData): Promise<Center> {
    try {
      const { data, error } = await supabase
        .from('centers')
        .update({
          center_name: formData.centerName,
          branch_id: formData.branchId,
          village: formData.villageId,
          assigned_to: formData.assignedTo,
          center_day: formData.centerDay,
          center_time: formData.centerTime,
          contact_person_name: formData.contactPersonName,
          contact_person_number: formData.contactPersonNumber,
          meeting_place: formData.meetingPlace,
          address1: formData.address1,
          address2: formData.address2,
          landmark: formData.landmark,
          pincode: formData.pincode,
          city: formData.city,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: formData.status,
          blacklisted: formData.blacklisted,
          bc_center_id: formData.bcCenterId,
          parent_center_id: formData.parentCenterId
        })
        .eq('id', id)
        .select(`
          *,
          branches (id, branch_name, branch_code),
          assigned_user:user_profiles!centers_assigned_to_fkey (id, first_name, last_name),
          created_user:user_profiles!centers_created_by_fkey (id, first_name, last_name)
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        centerCode: data.center_code,
        centerName: data.center_name,
        branchId: data.branch_id,
        branchName: data.branches ? data.branches.branch_name : '',
        centerDay: data.center_day || '',
        centerTime: data.center_time ? new Date(data.center_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        status: data.status,
        blacklisted: data.blacklisted,
        assignedTo: data.assigned_to,
        assignedToName: data.assigned_user ? `${data.assigned_user.first_name} ${data.assigned_user.last_name}` : '',
        bcCenterId: data.bc_center_id,
        parentCenterId: data.parent_center_id,
        contactPersonName: data.contact_person_name,
        contactPersonNumber: data.contact_person_number,
        address1: data.address1 || '',
        address2: data.address2,
        landmark: data.landmark,
        pincode: data.pincode,
        villageId: data.village,
        villageName: data.village || '',
        city: data.city,
        meetingPlace: data.meeting_place,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        createdBy: data.created_user ? `${data.created_user.first_name} ${data.created_user.last_name}` : 'System',
        createdAt: data.created_at.split('T')[0],
        updatedAt: data.updated_at ? data.updated_at.split('T')[0] : undefined,
        memberCount: data.member_count || 0
      };
    } catch (error) {
      console.error('Error updating center:', error);
      throw new Error('Failed to update center');
    }
  }

  async deleteCenter(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('centers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting center:', error);
      throw new Error('Failed to delete center');
    }
  }

  async exportCentersCSV(centers: Center[]): Promise<void> {
    const headers = [
      'Center Code', 'Center Name', 'Branch', 'Center Day', 'Center Time', 'Status', 'Blacklisted',
      'Assigned To', 'BC Center ID', 'Parent Center ID', 'Contact Person Name', 'Contact Person Number',
      'Address 1', 'Address 2', 'Landmark', 'Pincode', 'Village', 'City', 'Meeting Place',
      'Latitude', 'Longitude', 'Created By', 'Created At'
    ];

    const csvContent = [
      headers.join(','),
      ...centers.map(center => [
        center.centerCode,
        center.centerName,
        center.branchName,
        center.centerDay,
        center.centerTime,
        center.status,
        center.blacklisted ? 'Yes' : 'No',
        center.assignedToName,
        center.bcCenterId || '',
        center.parentCenterId || '',
        center.contactPersonName || '',
        center.contactPersonNumber || '',
        center.address1,
        center.address2 || '',
        center.landmark || '',
        center.pincode || '',
        center.villageName,
        center.city || '',
        center.meetingPlace || '',
        center.latitude || '',
        center.longitude || '',
        center.createdBy,
        center.createdAt
      ].map(value => {
        // Escape commas and quotes in values
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `centers_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const centerService = new CenterService();