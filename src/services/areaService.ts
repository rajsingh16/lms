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
    // Mock data for demonstration
    return [
      {
        id: '1',
        areaType: 'Branch',
        areaCode: 'BR001',
        areaName: 'Central Delhi Branch',
        parentArea: 'REG001',
        openingDate: '2024-01-01',
        status: 'active',
        address1: '123 Central Avenue',
        address2: 'Near Metro Station',
        district: 'Central Delhi',
        pincode: '110001',
        latitude: 28.6139,
        longitude: 77.2090,
        phoneNumber: '+91 11 2345 6789',
        emailId: 'central@loanms.com',
        managerId: 'MGR001',
        mandatoryDocument: 'Aadhar, PAN',
        crossSellAllowed: true,
        rating: 'A+',
        minCenterClients: 10,
        maxCenterClients: 50,
        lastDayCloseDate: '2024-01-15',
        disbOnMeetingDate: true,
        businessPartner: 'Partner A',
        bcBranchId: 'BC001',
        isDisbActive: true,
        isCashDisbActive: false,
        isSubProductEnabled: true,
        isClientSourcingEnabled: true,
        isCenterFormationEnabled: true,
        cashlessDisbPartner: 'Cashless Partner A',
        nachPartner: 'NACH Partner A',
        insertedOn: '2024-01-01',
        insertedBy: 'Admin User',
        updatedOn: '2024-01-15',
        updatedBy: 'Manager User'
      },
      {
        id: '2',
        areaType: 'Region',
        areaCode: 'REG001',
        areaName: 'North India Region',
        parentArea: 'ZON001',
        openingDate: '2023-12-01',
        status: 'active',
        address1: '456 Regional Office',
        district: 'North Delhi',
        pincode: '110002',
        phoneNumber: '+91 11 3456 7890',
        emailId: 'north@loanms.com',
        managerId: 'MGR002',
        crossSellAllowed: false,
        rating: 'A',
        minCenterClients: 5,
        maxCenterClients: 100,
        disbOnMeetingDate: false,
        businessPartner: 'Partner B',
        isDisbActive: true,
        isCashDisbActive: true,
        isSubProductEnabled: false,
        isClientSourcingEnabled: true,
        isCenterFormationEnabled: true,
        insertedOn: '2023-12-01',
        insertedBy: 'System Admin',
        updatedOn: '2024-01-10',
        updatedBy: 'Regional Manager'
      }
    ];
  }

  async createArea(formData: AreaFormData): Promise<LoanArea> {
    // Generate area code
    const areaCode = `${formData.areaType.substring(0, 2).toUpperCase()}${String(Date.now()).slice(-3)}`;
    
    const newArea: LoanArea = {
      id: String(Date.now()),
      areaType: formData.areaType,
      areaCode: areaCode,
      areaName: formData.areaName,
      parentArea: formData.parentAreaCode,
      openingDate: formData.branchOpeningDate,
      status: 'active',
      address1: formData.address1,
      address2: formData.address2,
      district: formData.district,
      pincode: formData.pincode,
      phoneNumber: formData.phoneNumber,
      emailId: formData.emailId,
      managerId: formData.branchManagerId,
      mandatoryDocument: formData.mandatoryDocument,
      crossSellAllowed: formData.crossSellAllowed,
      rating: formData.branchRating,
      minCenterClients: formData.minCenterClients,
      maxCenterClients: formData.maxCenterClients,
      disbOnMeetingDate: formData.disbOnMeetingDate,
      businessPartner: formData.businessPartner,
      bcBranchId: formData.bcBranchId,
      isDisbActive: formData.isDisbActive,
      isCashDisbActive: formData.isCashDisbActive,
      isSubProductEnabled: formData.isSubProductEnabled,
      isClientSourcingEnabled: formData.isClientSourcingEnabled,
      isCenterFormationEnabled: formData.isCenterFormationEnabled,
      cashlessDisbPartner: formData.cashlessDisbPartner,
      nachPartner: formData.nachPartner,
      insertedOn: new Date().toISOString().split('T')[0],
      insertedBy: 'Current User'
    };

    return newArea;
  }

  async updateArea(id: string, formData: AreaFormData): Promise<LoanArea> {
    const updatedArea: LoanArea = {
      id: id,
      areaType: formData.areaType,
      areaCode: `${formData.areaType.substring(0, 2).toUpperCase()}${id.slice(-3)}`,
      areaName: formData.areaName,
      parentArea: formData.parentAreaCode,
      openingDate: formData.branchOpeningDate,
      status: 'active',
      address1: formData.address1,
      address2: formData.address2,
      district: formData.district,
      pincode: formData.pincode,
      phoneNumber: formData.phoneNumber,
      emailId: formData.emailId,
      managerId: formData.branchManagerId,
      mandatoryDocument: formData.mandatoryDocument,
      crossSellAllowed: formData.crossSellAllowed,
      rating: formData.branchRating,
      minCenterClients: formData.minCenterClients,
      maxCenterClients: formData.maxCenterClients,
      disbOnMeetingDate: formData.disbOnMeetingDate,
      businessPartner: formData.businessPartner,
      bcBranchId: formData.bcBranchId,
      isDisbActive: formData.isDisbActive,
      isCashDisbActive: formData.isCashDisbActive,
      isSubProductEnabled: formData.isSubProductEnabled,
      isClientSourcingEnabled: formData.isClientSourcingEnabled,
      isCenterFormationEnabled: formData.isCenterFormationEnabled,
      cashlessDisbPartner: formData.cashlessDisbPartner,
      nachPartner: formData.nachPartner,
      insertedOn: '2024-01-01',
      insertedBy: 'Original User',
      updatedOn: new Date().toISOString().split('T')[0],
      updatedBy: 'Current User'
    };

    return updatedArea;
  }

  async deleteArea(id: string): Promise<void> {
    // Mock delete operation
    console.log(`Deleting area with id: ${id}`);
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
          const requiredColumns = ['areaType', 'areaName', 'businessPartner'];
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

          // Mock processing
          const created = Math.floor(lines.length * 0.7);
          const updated = Math.floor(lines.length * 0.2);
          const errors = lines.length - created - updated;

          resolve({
            success: true,
            created,
            updated,
            errors,
            errorDetails: errors > 0 ? [`${errors} rows had validation errors`] : []
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
}

export const areaService = new AreaService();