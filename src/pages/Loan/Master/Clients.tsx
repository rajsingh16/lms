import React, { useState } from 'react';
import { DataTable } from '../../../components/Common/DataTable';
import { LoanClient } from '../../../types';
import { User, Phone, CreditCard, Calendar, MapPin } from 'lucide-react';

export const Clients: React.FC = () => {
  const [clients] = useState<LoanClient[]>([
    {
      id: '1',
      clientId: 'CL001',
      firstName: 'Priya',
      lastName: 'Sharma',
      centerName: 'Anand Nagar Center',
      village: 'Anand Nagar',
      phone: '+91 9876543210',
      aadharNumber: '1234-5678-9012',
      status: 'active',
      joinDate: '2024-01-10'
    },
    {
      id: '2',
      clientId: 'CL002',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      centerName: 'Gandhi Colony Center',
      village: 'Gandhi Colony',
      phone: '+91 9876543211',
      aadharNumber: '1234-5678-9013',
      status: 'active',
      joinDate: '2024-01-08'
    },
    {
      id: '3',
      clientId: 'CL003',
      firstName: 'Sunita',
      lastName: 'Devi',
      centerName: 'Nehru Park Center',
      village: 'Nehru Park',
      phone: '+91 9876543212',
      aadharNumber: '1234-5678-9014',
      status: 'inactive',
      joinDate: '2024-01-05'
    }
  ]);

  const columns = [
    {
      key: 'clientId',
      label: 'Client ID',
      sortable: true,
    },
    {
      key: 'fullName',
      label: 'Full Name',
      sortable: true,
      render: (value: any, row: LoanClient) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {row.firstName[0]}{row.lastName[0]}
            </span>
          </div>
          <div>
            <span className="font-medium">{row.firstName} {row.lastName}</span>
          </div>
        </div>
      )
    },
    {
      key: 'centerName',
      label: 'Center',
      sortable: true,
    },
    {
      key: 'village',
      label: 'Village',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Phone',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'aadharNumber',
      label: 'Aadhar Number',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <span className="font-mono">{value}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(value).toLocaleDateString()}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-600 mt-1">Manage client information and profiles</p>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        title="Client Management"
        onAdd={() => console.log('Add client')}
        onRowClick={(client) => console.log('View client', client)}
      />
    </div>
  );
};