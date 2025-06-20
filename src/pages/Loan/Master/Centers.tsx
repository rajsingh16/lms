import React, { useState, useEffect } from 'react';
import { DataTable } from '../../../components/Common/DataTable';
import { Modal } from '../../../components/Common/Modal';
import { FilterDropdown } from '../../../components/Common/FilterDropdown';
import { CenterForm } from '../../../components/Forms/CenterForm';
import { CSVUpload } from '../../../components/Common/CSVUpload';
import { PermissionGuard } from '../../../components/Common/PermissionGuard';
import { LoanCenter, CenterFormData, FilterOptions } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { centerService } from '../../../services/centerService';
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  Edit, 
  Trash2, 
  Clock, 
  Phone, 
  CheckCircle, 
  XCircle,
  Upload,
  Download,
  AlertCircle,
  Loader
} from 'lucide-react';

export const Centers: React.FC = () => {
  const { hasPermission } = useAuth();
  const [centers, setCenters] = useState<LoanCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<LoanCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<LoanCenter | null>(null);
  const [editingCenter, setEditingCenter] = useState<LoanCenter | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const branches = Array.from(new Set(centers.map(c => c.branch)));
  const centerNames = Array.from(new Set(centers.map(c => c.centerName)));
  const assignedToOptions = Array.from(new Set(centers.map(c => c.assignedTo)));

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      setLoading(true);
      const data = await centerService.getAllCenters();
      setCenters(data);
      setFilteredCenters(data);
    } catch (err) {
      setError('Failed to load centers');
      console.error('Error loading centers:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddCenter = async (formData: CenterFormData) => {
    try {
      const newCenter = await centerService.createCenter(formData);
      setCenters(prev => [...prev, newCenter]);
      setFilteredCenters(prev => [...prev, newCenter]);
      setShowAddModal(false);
      setSuccess('Center created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create center');
      console.error('Error creating center:', err);
    }
  };

  const handleEditCenter = (center: LoanCenter) => {
    setEditingCenter(center);
  };

  const handleUpdateCenter = async (formData: CenterFormData) => {
    if (!editingCenter) return;

    try {
      const updatedCenter = await centerService.updateCenter(editingCenter.id, formData);
      setCenters(prev => prev.map(c => c.id === editingCenter.id ? updatedCenter : c));
      setFilteredCenters(prev => prev.map(c => c.id === editingCenter.id ? updatedCenter : c));
      setEditingCenter(null);
      setSuccess('Center updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update center');
      console.error('Error updating center:', err);
    }
  };

  const handleDeleteCenter = async (centerId: string) => {
    if (!window.confirm('Are you sure you want to delete this center?')) return;

    try {
      await centerService.deleteCenter(centerId);
      setCenters(prev => prev.filter(c => c.id !== centerId));
      setFilteredCenters(prev => prev.filter(c => c.id !== centerId));
      setSuccess('Center deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete center');
      console.error('Error deleting center:', err);
    }
  };

  const handleCSVUpload = async (file: File) => {
    try {
      const result = await centerService.uploadCentersCSV(file);
      
      if (result.success) {
        await loadCenters(); // Reload data
        setShowCSVModal(false);
        setSuccess(`CSV upload completed! ${result.created} created, ${result.updated} updated, ${result.errors} errors.`);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(result.message || 'CSV upload failed');
      }
    } catch (err) {
      setError('Failed to upload CSV');
      console.error('Error uploading CSV:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      await centerService.exportCentersCSV(filteredCenters);
      setSuccess('CSV exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to export CSV');
      console.error('Error exporting CSV:', err);
    }
  };

  const columns = [
    {
      key: 'actions',
      label: 'Action',
      render: (value: any, row: LoanCenter) => (
        <div className="flex items-center space-x-2">
          <PermissionGuard module="loan" permission="write">
            <button
              onClick={() => handleEditCenter(row)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
          </PermissionGuard>
          <PermissionGuard module="loan" permission="delete">
            <button
              onClick={() => handleDeleteCenter(row.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </PermissionGuard>
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
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true,
    },
    {
      key: 'contactPersonName',
      label: 'Contact Person',
      sortable: true,
    },
    {
      key: 'contactPersonNumber',
      label: 'Contact Number',
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{value}</span>
        </div>
      )
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex items-center space-x-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading centers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centers</h1>
        <p className="text-gray-600 mt-1">Manage loan centers and their details</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

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
              
              <PermissionGuard module="loan" permission="read">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </PermissionGuard>

              <PermissionGuard module="loan" permission="write">
                <button
                  onClick={() => setShowCSVModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload CSV</span>
                </button>
              </PermissionGuard>
              
              <PermissionGuard module="loan" permission="write">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <span>Add New</span>
                </button>
              </PermissionGuard>
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
              centerDay: editingCenter.centerDay || '',
              centerTime: editingCenter.centerTime || '',
              assignedTo: editingCenter.assignedTo,
              contactPersonName: editingCenter.contactPersonName || '',
              contactPersonNumber: editingCenter.contactPersonNumber || '',
              meetingPlace: editingCenter.meetingPlace || '',
              isActive: editingCenter.isActive ?? true,
              address1: editingCenter.address1 || '',
              address2: editingCenter.address2 || '',
              landmark: editingCenter.landmark || '',
              village: editingCenter.village
            }}
          />
        )}
      </Modal>

      {/* CSV Upload Modal */}
      <Modal
        isOpen={showCSVModal}
        onClose={() => setShowCSVModal(false)}
        title="Upload Centers CSV"
        size="lg"
      >
        <CSVUpload
          onUpload={handleCSVUpload}
          onCancel={() => setShowCSVModal(false)}
          templateColumns={[
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
            'status'
          ]}
          entityName="centers"
        />
      </Modal>
    </div>
  );
};