export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  branch: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

export type UserRole = 'admin' | 'manager' | 'finance_officer' | 'loan_officer' | 'field_officer';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoanCenter {
  id: string;
  centerCode: string;
  centerName: string;
  branch: string;
  area: string;
  village: string;
  assignedTo: string;
  status: 'active' | 'inactive';
  createdOn: string;
  memberCount: number;
  centerDay?: string;
  centerTime?: string;
  contactPersonName?: string;
  contactPersonNumber?: string;
  meetingPlace?: string;
  isActive?: boolean;
  address1?: string;
  address2?: string;
  landmark?: string;
  pincode?: string;
  villageId?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  createdBy?: string;
  blacklisted?: boolean;
  bcCenterId?: string;
  parentCenterId?: string;
}

export interface LoanClient {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  centerName: string;
  village: string;
  phone: string;
  aadharNumber: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface LoanProduct {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  interestRate: number;
  tenure: number;
  minAmount: number;
  maxAmount: number;
  status: 'active' | 'inactive';
}

export interface LoanApplication {
  id: string;
  applicationId: string;
  clientName: string;
  centerName: string;
  productName: string;
  requestedAmount: number;
  tenure: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  applicationDate: string;
  verificationStatus: string;
}

export interface Branch {
  id: string;
  branchCode: string;
  branchName: string;
  location: string;
  status: 'active' | 'inactive';
}

export interface ProductBranchMapping {
  id: string;
  productId: string;
  branchId: string;
  productName: string;
  branchName: string;
  assignedDate: string;
  status: 'active' | 'inactive';
}

export interface OverdueData {
  branch: string;
  amount: number;
  count: number;
  category: string;
  days: number;
}

export interface CenterFormData {
  branch: string;
  centerName: string;
  centerDay: string;
  centerTime: string;
  assignedTo: string;
  contactPersonName: string;
  contactPersonNumber: string;
  meetingPlace: string;
  isActive: boolean;
  address1: string;
  address2: string;
  landmark: string;
  village: string;
}

export interface FilterOptions {
  branch?: string;
  center?: string;
  status?: string;
  assignedTo?: string;
  createdOn?: string;
}