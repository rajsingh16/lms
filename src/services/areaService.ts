import { supabase } from '../lib/supabase';
import { LoanArea, AreaFormData } from '../types';

interface CSVUploadResult {
  success: boolean;
  message?: string;
  created: number;
  updated: number;
  errors: number;
  errorDetails?: string[];
}

class AreaService {
  async getAllAreas(): Promise<LoanArea[]> {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select(`
          *,
          created_user:user_profiles!areas_created_by_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(area => ({
        id: area.id,
        areaType: area.area_type,
        areaCode: area.area_code,
        areaName: area.area_name,
        parentArea: area.parent_area_code || '',
        openingDate: area.branch_opening_date,
        closingDate: area.branch_closing_date,
        status: area.status,
        address1: area.address1,
        address2: area.address2,
        district: area.district,
        pincode: area.pincode,
        latitude: area.latitude ? parseFloat(area.latitude) : undefined,
        longitude: area.longitude ? parseFloat(area.longitude) : undefined,
        phoneNumber: area.phone_number,
        emailId: area.email_id,
        managerId: area.branch_manager_id,
        mandatoryDocument: area.mandatory_document,
        crossSellAllowed: area.cross_sell_allowed,
        rating: area.branch_rating,
        minCenterClients: area.min_center_clients || 0,
        maxCenterClients: area.max_center_clients || 0,
        lastDayCloseDate: area.last_day_close_date,
        disbOnMeetingDate: area.disb_on_meeting_date,
        businessPartner: area.business_partner,
        bcBranchId: area.bc_branch_id,
        isDisbActive: area.is_disb_active,
        isCashDisbActive: area.is_cash_disb_active,
        isSubProductEnabled: area.is_sub_product_enabled,
        isClientSourcingEnabled: area.is_client_sourcing_enabled,
        isCenterFormationEnabled: area.is_center_formation_enabled,
        cashlessDisbPartner: area.cashless_disb_partner,
        nachPartner: area.nach_partner,
        insertedOn: area.created_at.split('T')[0],
        insertedBy: area.created_user 
          ? `${area.created_user.first_name} ${area.created_user.last_name}`
          : 'System',
        updatedOn: area.updated_at ? area.updated_at.split('T')[0] : undefined,
        updatedBy: area.updated_at ? 'Updated User' : undefined
      }));
    } catch (error) {
      console.error('Error fetching areas:', error);
      throw new Error('Failed to fetch areas');
    }
  }

  async createArea(formData: AreaFormData): Promise<LoanArea> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Generate area code
      const areaCode = `${formData.areaType.substring(0, 2).toUpperCase()}${String(Date.now()).slice(-3)}`;

      const { data, error } = await supabase
        .from('areas')
        .insert({
          area_type: formData.areaType,
          area_code: areaCode,
          area_name: formData.areaName,
          parent_area_code: formData.parentAreaCode || null,
          branch_manager_id: formData.branchManagerId || null,
          address1: formData.address1,
          address2: formData.address2 || null,
          phone_number: formData.phoneNumber || null,
          email_id: formData.emailId || null,
          pincode: formData.pincode,
          district: formData.district,
          state: formData.state,
          mandatory_document: formData.mandatoryDocument || null,
          branch_rating: formData.branchRating || null,
          min_center_clients: formData.minCenterClients,
          max_center_clients: formData.maxCenterClients,
          bc_branch_id: formData.bcBranchId || null,
          business_partner: formData.businessPartner,
          cashless_disb_partner: formData.cashlessDisbPartner || null,
          nach_partner: formData.nachPartner || null,
          branch_opening_date: formData.branchOpeningDate,
          disb_on_meeting_date: formData.disbOnMeetingDate,
          cross_sell_allowed: formData.crossSellAllowed,
          is_disb_active: formData.isDisbActive,
          is_cash_disb_active: formData.isCashDisbActive,
          is_sub_product_enabled: formData.isSubProductEnabled,
          is_client_sourcing_enabled: formData.isClientSourcingEnabled,
          is_center_formation_enabled: formData.isCenterFormationEnabled,
          status: 'active',
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        areaType: data.area_type,
        areaCode: data.area_code,
        areaName: data.area_name,
        parentArea: data.parent_area_code || '',
        openingDate: data.branch_opening_date,
        status: data.status,
        address1: data.address1,
        address2: data.address2,
        district: data.district,
        pincode: data.pincode,
        phoneNumber: data.phone_number,
        emailId: data.email_id,
        managerId: data.branch_manager_id,
        mandatoryDocument: data.mandatory_document,
        crossSellAllowed: data.cross_sell_allowed,
        rating: data.branch_rating,
        minCenterClients: data.min_center_clients || 0,
        maxCenterClients: data.max_center_clients || 0,
        disbOnMeetingDate: data.disb_on_meeting_date,
        businessPartner: data.business_partner,
        bcBranchId: data.bc_branch_id,
        isDisbActive: data.is_disb_active,
        isCashDisbActive: data.is_cash_disb_active,
        isSubProductEnabled: data.is_sub_product_enabled,
        isClientSourcingEnabled: data.is_client_sourcing_enabled,
        isCenterFormationEnabled: data.is_center_formation_enabled,
        cashlessDisbPartner: data.cashless_disb_partner,
        nachPartner: data.nach_partner,
        insertedOn: data.created_at.split('T')[0],
        insertedBy: 'Current User'
      };
    } catch (error) {
      console.error('Error creating area:', error);
      throw new Error('Failed to create area');
    }
  }

  async updateArea(id: string, formData: AreaFormData): Promise<LoanArea> {
    try {
      const { data, error } = await supabase
        .from('areas')
        .update({
          area_type: formData.areaType,
          area_name: formData.areaName,
          parent_area_code: formData.parentAreaCode || null,
          branch_manager_id: formData.branchManagerId || null,
          address1: formData.address1,
          address2: formData.address2 || null,
          phone_number: formData.phoneNumber || null,
          email_id: formData.emailId || null,
          pincode: formData.pincode,
          district: formData.district,
          state: formData.state,
          mandatory_document: formData.mandatoryDocument || null,
          branch_rating: formData.branchRating || null,
          min_center_clients: formData.minCenterClients,
          max_center_clients: formData.maxCenterClients,
          bc_branch_id: formData.bcBranchId || null,
          business_partner: formData.businessPartner,
          cashless_disb_partner: formData.cashlessDisbPartner || null,
          nach_partner: formData.nachPartner || null,
          branch_opening_date: formData.branchOpeningDate,
          disb_on_meeting_date: formData.disbOnMeetingDate,
          cross_sell_allowed: formData.crossSellAllowed,
          is_disb_active: formData.isDisbActive,
          is_cash_disb_active: formData.isCashDisbActive,
          is_sub_product_enabled: formData.isSubProductEnabled,
          is_client_sourcing_enabled: formData.isClientSourcingEnabled,
          is_center_formation_enabled: formData.isCenterFormationEnabled
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        areaType: data.area_type,
        areaCode: data.area_code,
        areaName: data.area_name,
        parentArea: data.parent_area_code || '',
        openingDate: data.branch_opening_date,
        closingDate: data.branch_closing_date,
        status: data.status,
        address1: data.address1,
        address2: data.address2,
        district: data.district,
        pincode: data.pincode,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        phoneNumber: data.phone_number,
        emailId: data.email_id,
        managerId: data.branch_manager_id,
        mandatoryDocument: data.mandatory_document,
        crossSellAllowed: data.cross_sell_allowed,
        rating: data.branch_rating,
        minCenterClients: data.min_center_clients || 0,
        maxCenterClients: data.max_center_clients || 0,
        lastDayCloseDate: data.last_day_close_date,
        disbOnMeetingDate: data.disb_on_meeting_date,
        businessPartner: data.business_partner,
        bcBranchId: data.bc_branch_id,
        isDisbActive: data.is_disb_active,
        isCashDisbActive: data.is_cash_disb_active,
        isSubProductEnabled: data.is_sub_product_enabled,
        isClientSourcingEnabled: data.is_client_sourcing_enabled,
        isCenterFormationEnabled: data.is_center_formation_enabled,
        cashlessDisbPartner: data.cashless_disb_partner,
        nachPartner: data.nach_partner,
        insertedOn: data.created_at.split('T')[0],
        insertedBy: 'Original User',
        updatedOn: data.updated_at.split('T')[0],
        updatedBy: 'Current User'
      };
    } catch (error) {
      console.error('Error updating area:', error);
      throw new Error('Failed to update area');
    }
  }

  async deleteArea(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('areas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting area:', error);
      throw new Error('Failed to delete area');
    }
  }

  async uploadAreasCSV(file: File): Promise<CSVUploadResult> {
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
          const requiredColumns = ['areaType', 'areaName', 'businessPartner', 'address1', 'pincode', 'district', 'state', 'branchOpeningDate'];
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
              if (!rowData.areaType || !rowData.areaName || !rowData.businessPartner) {
                errors++;
                errorDetails.push(`Row ${i + 1}: Missing required fields`);
                continue;
              }

              // Generate area code if not provided
              const areaCode = rowData.areaCode || `${rowData.areaType.substring(0, 2).toUpperCase()}${String(Date.now() + i).slice(-3)}`;

              // Check if area exists
              const { data: existingArea } = await supabase
                .from('areas')
                .select('id')
                .eq('area_code', areaCode)
                .single();

              const areaData = {
                area_type: rowData.areaType,
                area_code: areaCode,
                area_name: rowData.areaName,
                parent_area_code: rowData.parentAreaCode || null,
                branch_manager_id: rowData.branchManagerId || null,
                address1: rowData.address1,
                address2: rowData.address2 || null,
                phone_number: rowData.phoneNumber || null,
                email_id: rowData.emailId || null,
                pincode: rowData.pincode,
                district: rowData.district,
                state: rowData.state,
                mandatory_document: rowData.mandatoryDocument || null,
                branch_rating: rowData.branchRating || null,
                min_center_clients: parseInt(rowData.minCenterClients) || 0,
                max_center_clients: parseInt(rowData.maxCenterClients) || 0,
                bc_branch_id: rowData.bcBranchId || null,
                business_partner: rowData.businessPartner,
                cashless_disb_partner: rowData.cashlessDisbPartner || null,
                nach_partner: rowData.nachPartner || null,
                branch_opening_date: rowData.branchOpeningDate,
                disb_on_meeting_date: rowData.disbOnMeetingDate === 'true',
                cross_sell_allowed: rowData.crossSellAllowed === 'true',
                is_disb_active: rowData.isDisbActive !== 'false',
                is_cash_disb_active: rowData.isCashDisbActive === 'true',
                is_sub_product_enabled: rowData.isSubProductEnabled === 'true',
                is_client_sourcing_enabled: rowData.isClientSourcingEnabled === 'true',
                is_center_formation_enabled: rowData.isCenterFormationEnabled === 'true',
                status: rowData.status || 'active',
                created_by: user.id
              };

              if (existingArea) {
                // Update existing area
                const { error } = await supabase
                  .from('areas')
                  .update(areaData)
                  .eq('id', existingArea.id);

                if (error) {
                  errors++;
                  errorDetails.push(`Row ${i + 1}: Update failed - ${error.message}`);
                } else {
                  updated++;
                }
              } else {
                // Create new area
                const { error } = await supabase
                  .from('areas')
                  .insert(areaData);

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

  async exportAreasCSV(areas: LoanArea[]): Promise<void> {
    const headers = [
      'areaType', 'areaCode', 'areaName', 'parentArea', 'openingDate', 'closingDate',
      'status', 'address1', 'address2', 'district', 'pincode', 'latitude', 'longitude',
      'phoneNumber', 'emailId', 'managerId', 'mandatoryDocument', 'crossSellAllowed',
      'rating', 'minCenterClients', 'maxCenterClients', 'lastDayCloseDate',
      'disbOnMeetingDate', 'businessPartner', 'bcBranchId', 'isDisbActive',
      'isCashDisbActive', 'isSubProductEnabled', 'isClientSourcingEnabled',
      'isCenterFormationEnabled', 'cashlessDisbPartner', 'nachPartner',
      'insertedOn', 'insertedBy', 'updatedOn', 'updatedBy'
    ];

    const csvContent = [
      headers.join(','),
      ...areas.map(area => 
        headers.map(header => {
          const value = area[header as keyof LoanArea];
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
    a.download = `areas_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  async downloadTemplate(): Promise<void> {
    const templateHeaders = [
      'areaType',
      'parentAreaCode',
      'areaName',
      'branchManagerId',
      'address1',
      'address2',
      'phoneNumber',
      'emailId',
      'pincode',
      'district',
      'state',
      'mandatoryDocument',
      'branchRating',
      'minCenterClients',
      'maxCenterClients',
      'bcBranchId',
      'businessPartner',
      'cashlessDisbPartner',
      'nachPartner',
      'branchOpeningDate',
      'disbOnMeetingDate',
      'crossSellAllowed',
      'isDisbActive',
      'isCashDisbActive',
      'isSubProductEnabled',
      'isClientSourcingEnabled',
      'isCenterFormationEnabled'
    ];

    const sampleData = [
      'Branch',
      'REG001',
      'Sample Branch',
      'MGR001',
      '123 Sample Street',
      'Near Landmark',
      '+91 9876543210',
      'sample@example.com',
      '110001',
      'Central Delhi',
      'Delhi',
      'Aadhar, PAN',
      'A+',
      '10',
      '50',
      'BC001',
      'Partner A',
      'Cashless Partner',
      'NACH Partner',
      '2024-01-01',
      'true',
      'true',
      'true',
      'false',
      'true',
      'true',
      'true'
    ];

    const csvContent = [
      templateHeaders.join(','),
      sampleData.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `areas_template_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

export const areaService = new AreaService();