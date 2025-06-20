import { supabase } from '../lib/supabase';
import { LoanCenter, CenterFormData } from '../types';

interface CSVUploadResult {
  success: boolean;
  message?: string;
  created: number;
  updated: number;
  errors: number;
  errorDetails?: string[];
}

class CenterService {
  async getAllCenters(): Promise<LoanCenter[]> {
    try {
      const { data, error } = await supabase
        .from('centers')
        .select(`
          *,
          branches!centers_branch_id_fkey (
            branch_name,
            branch_code
          ),
          assigned_user:user_profiles!centers_assigned_to_fkey (
            first_name,
            last_name
          ),
          created_user:user_profiles!centers_created_by_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(center => ({
        id: center.id,
        centerCode: center.center_code,
        centerName: center.center_name,
        branch: center.branches?.branch_name || 'Unknown Branch',
        area: 'Area', // You might want to add this to the database
        village: center.village,
        assignedTo: center.assigned_user 
          ? `${center.assigned_user.first_name} ${center.assigned_user.last_name}`
          : 'Unassigned',
        status: center.status,
        createdOn: center.created_at.split('T')[0],
        memberCount: center.member_count || 0,
        centerDay: center.center_day,
        centerTime: center.center_time,
        contactPersonName: center.contact_person_name,
        contactPersonNumber: center.contact_person_number,
        meetingPlace: center.meeting_place,
        isActive: center.is_active,
        address1: center.address1,
        address2: center.address2,
        landmark: center.landmark,
        pincode: center.pincode,
        villageId: center.village, // Using village as villageId for now
        city: center.city,
        latitude: center.latitude ? parseFloat(center.latitude) : undefined,
        longitude: center.longitude ? parseFloat(center.longitude) : undefined,
        createdBy: center.created_user 
          ? `${center.created_user.first_name} ${center.created_user.last_name}`
          : 'Unknown',
        blacklisted: center.blacklisted || false,
        bcCenterId: center.center_code, // Using center_code as bcCenterId
        parentCenterId: null // You might want to add this relationship
      }));
    } catch (error) {
      console.error('Error fetching centers:', error);
      throw new Error('Failed to fetch centers');
    }
  }

  async createCenter(formData: CenterFormData): Promise<LoanCenter> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get branch ID from branch name
      const { data: branches } = await supabase
        .from('branches')
        .select('id')
        .eq('branch_name', formData.branch)
        .single();

      // Get assigned user ID
      const { data: assignedUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('first_name', formData.assignedTo.split(' ')[0])
        .single();

      // Generate center code
      const centerCode = `CTR${String(Date.now()).slice(-6)}`;

      const { data, error } = await supabase
        .from('centers')
        .insert({
          center_code: centerCode,
          center_name: formData.centerName,
          branch_id: branches?.id,
          village: formData.village,
          assigned_to: assignedUser?.id,
          center_day: formData.centerDay,
          center_time: formData.centerTime,
          contact_person_name: formData.contactPersonName,
          contact_person_number: formData.contactPersonNumber,
          meeting_place: formData.meetingPlace,
          address1: formData.address1,
          address2: formData.address2,
          landmark: formData.landmark,
          status: formData.isActive ? 'active' : 'inactive',
          is_active: formData.isActive,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        centerCode: data.center_code,
        centerName: data.center_name,
        branch: formData.branch,
        area: 'New Area',
        village: data.village,
        assignedTo: formData.assignedTo,
        status: data.status,
        createdOn: data.created_at.split('T')[0],
        memberCount: 0,
        centerDay: data.center_day,
        centerTime: data.center_time,
        contactPersonName: data.contact_person_name,
        contactPersonNumber: data.contact_person_number,
        meetingPlace: data.meeting_place,
        isActive: data.is_active,
        address1: data.address1,
        address2: data.address2,
        landmark: data.landmark,
        pincode: data.pincode,
        villageId: data.village,
        city: data.city,
        createdBy: 'Current User',
        blacklisted: false
      };
    } catch (error) {
      console.error('Error creating center:', error);
      throw new Error('Failed to create center');
    }
  }

  async updateCenter(id: string, formData: CenterFormData): Promise<LoanCenter> {
    try {
      // Get branch ID from branch name
      const { data: branches } = await supabase
        .from('branches')
        .select('id')
        .eq('branch_name', formData.branch)
        .single();

      // Get assigned user ID
      const { data: assignedUser } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('first_name', formData.assignedTo.split(' ')[0])
        .single();

      const { data, error } = await supabase
        .from('centers')
        .update({
          center_name: formData.centerName,
          branch_id: branches?.id,
          village: formData.village,
          assigned_to: assignedUser?.id,
          center_day: formData.centerDay,
          center_time: formData.centerTime,
          contact_person_name: formData.contactPersonName,
          contact_person_number: formData.contactPersonNumber,
          meeting_place: formData.meetingPlace,
          address1: formData.address1,
          address2: formData.address2,
          landmark: formData.landmark,
          status: formData.isActive ? 'active' : 'inactive',
          is_active: formData.isActive
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        centerCode: data.center_code,
        centerName: data.center_name,
        branch: formData.branch,
        area: 'Updated Area',
        village: data.village,
        assignedTo: formData.assignedTo,
        status: data.status,
        createdOn: data.created_at.split('T')[0],
        memberCount: data.member_count || 0,
        centerDay: data.center_day,
        centerTime: data.center_time,
        contactPersonName: data.contact_person_name,
        contactPersonNumber: data.contact_person_number,
        meetingPlace: data.meeting_place,
        isActive: data.is_active,
        address1: data.address1,
        address2: data.address2,
        landmark: data.landmark,
        pincode: data.pincode,
        villageId: data.village,
        city: data.city,
        createdBy: 'Current User',
        blacklisted: data.blacklisted || false
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

  async uploadCentersCSV(file: File): Promise<CSVUploadResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            resolve({
              success: false,
              message: 'CSV file must contain at least a header row and one data row',
              created: 0,
              updated: 0,
              errors: 1
            });
            return;
          }

          const headers = lines[0].split(',').map(h => h.trim());
          const requiredColumns = ['centerCode', 'centerName', 'branch', 'village', 'assignedTo'];
          const missingColumns = requiredColumns.filter(col => !headers.includes(col));
          
          if (missingColumns.length > 0) {
            resolve({
              success: false,
              message: `Missing required columns: ${missingColumns.join(', ')}`,
              created: 0,
              updated: 0,
              errors: 1
            });
            return;
          }

          let created = 0;
          let updated = 0;
          let errors = 0;
          const errorDetails: string[] = [];

          // Get current user
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            resolve({
              success: false,
              message: 'User not authenticated',
              created: 0,
              updated: 0,
              errors: 1
            });
            return;
          }

          // Process each data row
          for (let i = 1; i < lines.length; i++) {
            try {
              const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
              const rowData: any = {};
              
              headers.forEach((header, index) => {
                rowData[header] = values[index] || '';
              });

              // Validate required fields
              if (!rowData.centerCode || !rowData.centerName || !rowData.branch) {
                errors++;
                errorDetails.push(`Row ${i + 1}: Missing required fields`);
                continue;
              }

              // Check if center exists
              const { data: existingCenter } = await supabase
                .from('centers')
                .select('id')
                .eq('center_code', rowData.centerCode)
                .single();

              // Get branch ID
              const { data: branch } = await supabase
                .from('branches')
                .select('id')
                .eq('branch_name', rowData.branch)
                .single();

              if (!branch) {
                errors++;
                errorDetails.push(`Row ${i + 1}: Branch '${rowData.branch}' not found`);
                continue;
              }

              const centerData = {
                center_code: rowData.centerCode,
                center_name: rowData.centerName,
                branch_id: branch.id,
                village: rowData.village,
                center_day: rowData.centerDay || null,
                center_time: rowData.centerTime || null,
                contact_person_name: rowData.contactPersonName || null,
                contact_person_number: rowData.contactPersonNumber || null,
                meeting_place: rowData.meetingPlace || null,
                address1: rowData.address1 || null,
                address2: rowData.address2 || null,
                landmark: rowData.landmark || null,
                status: rowData.status || 'active',
                is_active: rowData.status !== 'inactive',
                created_by: user.id
              };

              if (existingCenter) {
                // Update existing center
                const { error } = await supabase
                  .from('centers')
                  .update(centerData)
                  .eq('id', existingCenter.id);

                if (error) {
                  errors++;
                  errorDetails.push(`Row ${i + 1}: Update failed - ${error.message}`);
                } else {
                  updated++;
                }
              } else {
                // Create new center
                const { error } = await supabase
                  .from('centers')
                  .insert(centerData);

                if (error) {
                  errors++;
                  errorDetails.push(`Row ${i + 1}: Create failed - ${error.message}`);
                } else {
                  created++;
                }
              }
              
            } catch (error) {
              errors++;
              errorDetails.push(`Row ${i + 1}: ${error}`);
            }
          }

          resolve({
            success: true,
            created,
            updated,
            errors,
            errorDetails: errorDetails.slice(0, 10) // Limit error details
          });

        } catch (error) {
          resolve({
            success: false,
            message: 'Failed to parse CSV file',
            created: 0,
            updated: 0,
            errors: 1
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          message: 'Failed to read file',
          created: 0,
          updated: 0,
          errors: 1
        });
      };

      reader.readAsText(file);
    });
  }

  async exportCentersCSV(centers: LoanCenter[]): Promise<void> {
    const headers = [
      'centerCode',
      'centerName',
      'branch',
      'village',
      'assignedTo',
      'centerDay',
      'centerTime',
      'contactPersonName',
      'contactPersonNumber',
      'meetingPlace',
      'address1',
      'address2',
      'landmark',
      'status',
      'createdOn'
    ];

    const csvContent = [
      headers.join(','),
      ...centers.map(center => 
        headers.map(header => {
          const value = center[header as keyof LoanCenter];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value || '';
        }).join(',')
      )
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