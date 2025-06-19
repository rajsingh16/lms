import React, { useState } from 'react';
import { DataTable } from '../../../components/Common/DataTable';
import { LoanApplication } from '../../../types';
import { User, DollarSign, Calendar, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export const LoanApplicationPage: React.FC = () => {
  const [applications] = useState<LoanApplication[]>([
    {
      id: '1',
      applicationId: 'LA001',
      clientName: 'Priya Sharma',
      centerName: 'Anand Nagar Center',
      productName: 'Micro Finance Loan',
      requestedAmount: 50000,
      tenure: 12,
      purpose: 'Small Business',
      status: 'pending',
      applicationDate: '2024-01-15',
      verificationStatus: 'In Progress'
    },
    {
      id: '2',
      applicationId: 'LA002',
      clientName: 'Rajesh Kumar',
      centerName: 'Gandhi Colony Center',
      productName: 'Group Loan',
      requestedAmount: 75000,
      tenure: 18,
      purpose: 'Agriculture',
      status: 'approved',
      applicationDate: '2024-01-14',
      verificationStatus: 'Completed'
    },
    {
      id: '3',
      applicationId: 'LA003',
      clientName: 'Sunita Devi',
      centerName: 'Nehru Park Center',
      productName: 'Individual Loan',
      requestedAmount: 30000,
      tenure: 9,
      purpose: 'Education',
      status: 'rejected',
      applicationDate: '2024-01-13',
      verificationStatus: 'Failed'
    },
    {
      id: '4',
      applicationId: 'LA004',
      clientName: 'Mohit Singh',
      centerName: 'Patel Nagar Center',
      productName: 'Emergency Loan',
      requestedAmount: 25000,
      tenure: 6,
      purpose: 'Medical Emergency',
      status: 'disbursed',
      applicationDate: '2024-01-12',
      verificationStatus: 'Completed'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'disbursed':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'disbursed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const columns = [
    {
      key: 'applicationId',
      label: 'Application ID',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono font-medium">{value}</span>
      )
    },
    {
      key: 'clientName',
      label: 'Client Name',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'centerName',
      label: 'Center',
      sortable: true,
    },
    {
      key: 'productName',
      label: 'Product',
      sortable: true,
    },
    {
      key: 'requestedAmount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center space-x-1">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="font-medium">₹{value.toLocaleString()}</span>
        </div>
      )
    },
    {
      key: 'tenure',
      label: 'Tenure',
      sortable: true,
      render: (value: number) => `${value} months`
    },
    {
      key: 'purpose',
      label: 'Purpose',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          {getStatusIcon(value)}
          <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(value)}`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'applicationDate',
      label: 'Applied On',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      key: 'verificationStatus',
      label: 'Verification',
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
          value === 'Completed' 
            ? 'bg-green-100 text-green-800'
            : value === 'Failed'
            ? 'bg-red-100 text-red-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
        <p className="text-gray-600 mt-1">Track and manage loan applications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Disbursed</p>
              <p className="text-xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'disbursed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-xl font-bold text-gray-900">
                {applications.filter(app => app.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        title="Application Management"
        onAdd={() => console.log('New application')}
        onRowClick={(application) => console.log('View application', application)}
      />
    </div>
  );
};