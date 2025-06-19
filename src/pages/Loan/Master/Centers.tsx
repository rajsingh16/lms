import React, { useState } from 'react';
import { DataTable } from '../../../components/Common/DataTable';
import { Modal } from '../../../components/Common/Modal';
import { FilterDropdown } from '../../../components/Common/FilterDropdown';
import { CenterForm } from '../../../components/Forms/CenterForm';
import { LoanCenter, CenterFormData, FilterOptions } from '../../../types';
import { Building, MapPin, Users, Calendar, Edit, Trash2, Clock, Phone, CheckCircle, XCircle } from 'lucide-react';

export const Centers: React.FC = () => {
  const [centers, setCenters] = useState<LoanCenter[]>([
    {
      id: '1',
      centerCode: 'CTR001',
      centerName: 'Anand Nagar Center',
      branch: 'Main Branch',
      area: 'North Area',
      village: 'Anand Nagar',
      assignedTo: 'Amit Kumar',
      status: 'active',
      createdOn: '2024-01-10',
      memberCount: 25,
      centerDay: 'Monday',
      centerTime: '10:00',
      contactPersonName: 'Rajesh Sharma',
      contactPersonNumber: '+91 9876543210',
      meetingPlace: 'Community Hall',
      isActive: true,
      address1: '123 Main Street',
      address2: 'Near Bus Stand',
      landmark: 'Opposite Bank',
      pincode: '110001',
      villageId: 'V001',
      city: 'Delhi',
      latitude: 28.6139,
      longitude: 77.2090,
      createdBy: 'Admin',
      blacklisted: false,
      bcCenterId: 'BC001',
      parentCenterId: null
    },
    {
      id: '2',
      centerCode: 'CTR002',
      centerName: 'Gandhi Colony Center',
      branch: 'Main Branch',
      area: 'South Area',
      village: 'Gandhi Colony',
      assignedTo: 'Priya Sharma',
      status: 'active',
      createdOn: '2024-01-08',
      memberCount: 30,
      centerDay: 'Wednesday',
      centerTime: '14:00',
      contactPersonName: 'Sunita Devi',
      contactPersonNumber: '+91 9876543211',
      meetingPlace: 'School Ground',
      isActive: true,
      address1: '456 Gandhi Road',
      address2: 'Sector 2',
      landmark: 'Near Temple',
      pincode: '110002',
      villageId: 'V002',
      city: 'Delhi',
      latitude: 28.5355,
      longitude: 77.3910,
      createdBy: 'Manager',
      blacklisted: false,
      bcCenterId: 'BC002',
      parentCenterId: null
    },
    {
      id: '3',
      centerCode: 'CTR003',
      centerName: 'Nehru Park Center',
      branch: 'Branch 2',
      area: 'East Area',
      village: 'Nehru Park',
      assignedTo: 'Rajesh Singh',
      status: 'inactive',
      createdOn: '2024-01-05',
      memberCount: 18,
      centerDay: 'Friday',
      centerTime: '11:30',
      contactPersonName: 'Mohit Kumar',
      contactPersonNumber: '+91 9876543212',
      meetingPlace: 'Park Pavilion',
      isActive: false,
      address1: '789 Park Avenue',
      address2: 'Block A',
      landmark: 'Central Park',
      pincode: '110003',
      villageId: 'V003',
      city: 'Delhi',
      latitude: 28.6304,
      longitude: 77.2177,
      createdBy: 'Officer',
      blacklisted: true,
      bcCenterId: 'BC003',
      parentCenterId: 'CTR001'
    }
  ]);

  const [filteredCenters, setFilteredCenters] = useState<LoanCenter[]>(centers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<LoanCenter | null>(null);
  const [editingCenter, setEditingCenter] = useState<LoanCenter | null>(null);

  const branches = Array.from(new Set(centers.map(c => c.branch)));
  const centerNames = Array.from(new Set(centers.map(c => c.centerName)));
  const assignedToOptions = Array.from(new Set(centers.map(c => c.assignedTo)));

  const handleFilter = (filters: FilterOptions) => {
    let filtered = centers;

    if (filters.branch) {
      filtered = filtered.filter(center => center.branch === filters.branch);
    }
    if (filters.center) {
      filtered = filtered.filter(center => center.centerName === filters.center);
    }
    if (filters.status) {
      filtered = filtered.filter(center => center.status === filters.status);
    }
    if (filters.assignedTo) {
      filtered = filtered.filter(center => center.assignedTo === filters.assignedTo);
    }
    if (filters.createdOn) {
      filtered = filtered.filter(center => center.createdOn === filters.createdOn);
    }

    setFilteredCenters(filtered);
  };

  const handleAddCenter = (formData: CenterFormData) => {
    const newCenter: LoanCenter = {
      id: Date.now().toString(),
      centerCode: `CTR${String(centers.length + 1).padStart(3, '0')}`,
      centerName: formData.centerName,
      branch: formData.branch,
      area: 'New Area',
      village: formData.village,
      assignedTo: formData.assignedTo,
      status: formData.isActive ? 'active' : 'inactive',
      createdOn: new Date().toISOString().split('T')[0],
      memberCount: 0,
      centerDay: formData.centerDay,
      centerTime: formData.centerTime,
      contactPersonName: formData.contactPersonName,
      contactPersonNumber: formData.contactPersonNumber,
      meetingPlace: formData.meetingPlace,
      isActive: formData.isActive,
      address1: formData.address1,
      address2: formData.address2,
      landmark: formData.landmark,
      pincode: '000000',
      villageId: 'V' + String(centers.length + 1).padStart(3, '0'),
      city: 'City',
      createdBy: 'Current User',
      blacklisted: false
    };

    setCenters(prev => [...prev, newCenter]);
    setFilteredCenters(prev => [...prev, newCenter]);
    setShowAddModal(false);
  };

  const handleEditCenter = (center: LoanCenter) => {
    setEditingCenter(center);
  };

  const handleUpdateCenter = (formData: CenterFormData) => {
    if (!editingCenter) return;

    const updatedCenter: LoanCenter = {
      ...editingCenter,
      centerName: formData.centerName,
      branch: formData.branch,
      village: formData.village,
      assignedTo: formData.assignedTo,
      status: formData.isActive ? 'active' : 'inactive',
      centerDay: formData.centerDay,
      centerTime: formData.centerTime,
      contactPersonName: formData.contactPersonName,
      contactPersonNumber: formData.contactPersonNumber,
      meetingPlace: formData.meetingPlace,
      isActive: formData.isActive,
      address1: formData.address1,
      address2: formData.address2,
      landmark: formData.landmark
    };

    setCenters(prev => prev.map(c => c.id === editingCenter.id ? updatedCenter : c));
    setFilteredCenters(prev => prev.map(c => c.id === editingCenter.id ? updatedCenter : c));
    setEditingCenter(null);
  };

  const handleDeleteCenter = (centerId: string) => {
    if (window.confirm('Are you sure you want to delete this center?')) {
      setCenters(prev => prev.filter(c => c.id !== centerId));
      setFilteredCenters(prev => prev.filter(c => c.id !== centerId));
    }
  };

  const columns = [
    {
      key: 'actions',
      label: 'Action',
      render: (value: any, row: LoanCenter) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditCenter(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteCenter(row.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      key: 'branch',
      label: 'Branch',
      sortable: true,
    },
    {
      key: 'centerCode',
      label: 'Center Code',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono font-medium">{value}</span>
      )
    },
    {
      key: 'centerName',
      label: 'Center Name',
      sortable: true,
      render: (value: string, row: LoanCenter) => (
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'centerDay',
      label: 'Center Day',
      sortable: true,
    },
    {
      key: 'centerTime',
      label: 'Center Time',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
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
      key: 'blacklisted',
      label: 'Blacklisted',
      render: (value: boolean) => (
        <div className="flex items-center">
          {value ? (
            <XCircle className="w-4 h-4 text-red-500" />
          ) : (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
      )
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true,
    },
    {
      key: 'bcCenterId',
      label: 'BC Center ID',
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'parentCenterId',
      label: 'Parent Center ID',
      render: (value: string) => (
        <span className="font-mono text-sm">{value || '-'}</span>
      )
    },
    {
      key: 'contactPersonName',
      label: 'Contact Person Name',
      sortable: true,
    },
    {
      key: 'contactPersonNumber',
      label: 'Contact Person Number',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
    {
      key: 'address1',
      label: 'Address 1',
      sortable: true,
    },
    {
      key: 'address2',
      label: 'Address 2',
      render: (value: string) => value || '-'
    },
    {
      key: 'landmark',
      label: 'Landmark',
      render: (value: string) => value || '-'
    },
    {
      key: 'pincode',
      label: 'Pincode',
      render: (value: string) => (
        <span className="font-mono">{value}</span>
      )
    },
    {
      key: 'villageId',
      label: 'Village ID',
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      )
    },
    {
      key: 'city',
      label: 'City',
      sortable: true,
    },
    {
      key: 'meetingPlace',
      label: 'Meeting Place',
      sortable: true,
    },
    {
      key: 'latitude',
      label: 'Latitude',
      render: (value: number) => value?.toFixed(4) || '-'
    },
    {
      key: 'longitude',
      label: 'Longitude',
      render: (value: number) => value?.toFixed(4) || '-'
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sortable: true,
    },
    {
      key: 'createdOn',
      label: 'Created On',
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
        <h1 className="text-2xl font-bold text-gray-900">Centers</h1>
        <p className="text-gray-600 mt-1">Manage loan centers and their details</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Center Management</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredCenters.length} records found
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <FilterDropdown
                onFilter={handleFilter}
                branches={branches}
                centers={centerNames}
                assignedToOptions={assignedToOptions}
              />
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <span>Add New</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCenters.map((center, index) => (
                <tr
                  key={center.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.render ? column.render(center[column.key as keyof LoanCenter], center) : center[column.key as keyof LoanCenter]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Center Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Center"
        size="xl"
      >
        <CenterForm
          onSubmit={handleAddCenter}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Edit Center Modal */}
      <Modal
        isOpen={!!editingCenter}
        onClose={() => setEditingCenter(null)}
        title="Edit Center"
        size="xl"
      >
        {editingCenter && (
          <CenterForm
            onSubmit={handleUpdateCenter}
            onCancel={() => setEditingCenter(null)}
            initialData={{
              branch: editingCenter.branch,
              centerName: editingCenter.centerName,
              centerDay: editingCenter.centerDay,
              centerTime: editingCenter.centerTime,
              assignedTo: editingCenter.assignedTo,
              contactPersonName: editingCenter.contactPersonName,
              contactPersonNumber: editingCenter.contactPersonNumber,
              meetingPlace: editingCenter.meetingPlace,
              isActive: editingCenter.isActive,
              address1: editingCenter.address1,
              address2: editingCenter.address2,
              landmark: editingCenter.landmark,
              village: editingCenter.village
            }}
          />
        )}
      </Modal>
    </div>
  );
};