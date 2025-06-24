import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  Loader,
  Search,
  Filter
} from 'lucide-react';

export const Centers: React.FC = () => {
  const { hasPermission } = useAuth();
  const [centers, setCenters] = useState<LoanCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [editingCenter, setEditingCenter] = useState<LoanCenter | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Memoized filter options
  const filterOptions = useMemo(() => ({
    branches: Array.from(new Set(centers.map(c => c.branch))),
    centerNames: Array.from(new Set(centers.map(c => c.centerName))),
    assignedToOptions: Array.from(new Set(centers.map(c => c.assignedTo)))
  }), [centers]);

  // Memoized filtered and searched data
  const filteredCenters = useMemo(() => {
    let filtered = centers;

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(center =>
        center.centerCode.toLowerCase().includes(term) ||
        center.centerName.toLowerCase().includes(term) ||
        center.branch.toLowerCase().includes(term) ||
        center.village.toLowerCase().includes(term) ||
        center.assignedTo.toLowerCase().includes(term)
      );
    }

    // Apply filters
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

    return filtered;
  }, [centers, searchTerm, filters]);

  // Memoized paginated data
  const paginatedCenters = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCenters.slice(startIndex, startIndex + pageSize);
  }, [filteredCenters, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredCenters.length / pageSize);

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await centerService.getAllCenters();
      setCenters(data);
    } catch (err) {
      setError('Failed to load centers');
      console.error('Error loading centers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilter = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleAddCenter = useCallback(async (formData: CenterFormData) => {
    try {
      const newCenter = await centerService.createCenter(formData);
      setCenters(prev => [newCenter, ...prev]);
      setShowAddModal(false);
      setSuccess('Center created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create center');
      console.error('Error creating center:', err);
    }
  }, []);

  const handleEditCenter = useCallback((center: LoanCenter) => {
    setEditingCenter(center);
  }, []);

  const handleUpdateCenter = useCallback(async (formData: CenterFormData) => {
    if (!editingCenter) return;

    try {
      const updatedCenter = await centerService.updateCenter(editingCenter.id, formData);
      setCenters(prev => prev.map(c => c.id === editingCenter.id ? updatedCenter : c));
      setEditingCenter(null);
      setSuccess('Center updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update center');
      console.error('Error updating center:', err);
    }
  }, [editingCenter]);

  const handleDeleteCenter = useCallback(async (centerId: string) => {
    if (!window.confirm('Are you sure you want to delete this center?')) return;

    try {
      await centerService.deleteCenter(centerId);
      setCenters(prev => prev.filter(c => c.id !== centerId));
      setSuccess('Center deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete center');
      console.error('Error deleting center:', err);
    }
  }, []);

  const handleCSVUpload = useCallback(async (file: File) => {
    try {
      const result = await centerService.uploadCentersCSV(file);
      
      if (result.success) {
        await loadCenters();
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
  }, [loadCenters]);

  const handleExportCSV = useCallback(async () => {
    try {
      await centerService.exportCentersCSV(filteredCenters);
      setSuccess('CSV exported successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to export CSV');
      console.error('Error exporting CSV:', err);
    }
  }, [filteredCenters]);

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
        {/* Header with Search and Actions */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Center Management</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredCenters.length} of {centers.length} records
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <FilterDropdown
                onFilter={handleFilter}
                branches={filterOptions.branches}
                centers={filterOptions.centerNames}
                assignedToOptions={filterOptions.assignedToOptions}
              />
              
              <PermissionGuard module="loan" permission="read">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </PermissionGuard>

              <PermissionGuard module="loan" permission="write">
                <button
                  onClick={() => setShowCSVModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
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

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search centers by code, name, branch, village, or officer..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCenters.map((center) => (
                <tr key={center.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <PermissionGuard module="loan" permission="write">
                        <button
                          onClick={() => handleEditCenter(center)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                      <PermissionGuard module="loan" permission="delete">
                        <button
                          onClick={() => handleDeleteCenter(center.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </PermissionGuard>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="font-mono font-medium">{center.centerCode}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{center.centerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {center.branch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{center.village}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {center.centerDay && center.centerTime ? (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{center.centerDay} {center.centerTime}</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {center.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {center.contactPersonNumber ? (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{center.contactPersonNumber}</span>
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{center.memberCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                      center.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {center.status.charAt(0).toUpperCase() + center.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(center.createdOn).toLocaleDateString()}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">entries</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
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