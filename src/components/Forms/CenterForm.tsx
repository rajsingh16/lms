import React, { useState } from 'react';
import { CenterFormData } from '../../types';
import { Toggle } from '../Common/Toggle';

interface CenterFormProps {
  onSubmit: (data: CenterFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CenterFormData>;
}

export const CenterForm: React.FC<CenterFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<CenterFormData>({
    branch: initialData.branch || '',
    centerName: initialData.centerName || '',
    centerDay: initialData.centerDay || '',
    centerTime: initialData.centerTime || '',
    assignedTo: initialData.assignedTo || '',
    contactPersonName: initialData.contactPersonName || '',
    contactPersonNumber: initialData.contactPersonNumber || '',
    meetingPlace: initialData.meetingPlace || '',
    isActive: initialData.isActive ?? true,
    address1: initialData.address1 || '',
    address2: initialData.address2 || '',
    landmark: initialData.landmark || '',
    village: initialData.village || ''
  });

  const [errors, setErrors] = useState<Partial<CenterFormData>>({});

  const branches = ['Main Branch', 'Branch 2', 'Branch 3'];
  const officers = ['Amit Kumar', 'Priya Sharma', 'Rajesh Singh', 'Neha Gupta'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const villages = ['Anand Nagar', 'Gandhi Colony', 'Nehru Park', 'Patel Nagar', 'Shastri Colony'];

  const validateForm = (): boolean => {
    const newErrors: Partial<CenterFormData> = {};

    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.centerName) newErrors.centerName = 'Center name is required';
    if (!formData.centerDay) newErrors.centerDay = 'Center day is required';
    if (!formData.centerTime) newErrors.centerTime = 'Center time is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Assigned officer is required';
    if (!formData.address1) newErrors.address1 = 'Address is required';
    if (!formData.village) newErrors.village = 'Village is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CenterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Information Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          📋 Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.branch}
              onChange={(e) => handleChange('branch', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.branch ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Center Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.centerName}
              onChange={(e) => handleChange('centerName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.centerName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter center name"
            />
            {errors.centerName && <p className="text-red-500 text-xs mt-1">{errors.centerName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Center Day <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.centerDay}
              onChange={(e) => handleChange('centerDay', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.centerDay ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Day</option>
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            {errors.centerDay && <p className="text-red-500 text-xs mt-1">{errors.centerDay}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Center Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.centerTime}
              onChange={(e) => handleChange('centerTime', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.centerTime ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.centerTime && <p className="text-red-500 text-xs mt-1">{errors.centerTime}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => handleChange('assignedTo', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.assignedTo ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Officer</option>
              {officers.map(officer => (
                <option key={officer} value={officer}>{officer}</option>
              ))}
            </select>
            {errors.assignedTo && <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person Name
            </label>
            <input
              type="text"
              value={formData.contactPersonName}
              onChange={(e) => handleChange('contactPersonName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter contact person name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person Number
            </label>
            <input
              type="tel"
              value={formData.contactPersonNumber}
              onChange={(e) => handleChange('contactPersonNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter contact number"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Place
            </label>
            <input
              type="text"
              value={formData.meetingPlace}
              onChange={(e) => handleChange('meetingPlace', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meeting place"
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Toggle
            checked={formData.isActive}
            onChange={(checked) => handleChange('isActive', checked)}
            label="Active Status"
          />
        </div>
      </div>

      {/* Address Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          🏠 Address
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address1}
              onChange={(e) => handleChange('address1', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.address1 ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter primary address"
            />
            {errors.address1 && <p className="text-red-500 text-xs mt-1">{errors.address1}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address 2
            </label>
            <input
              type="text"
              value={formData.address2}
              onChange={(e) => handleChange('address2', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter secondary address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landmark
            </label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => handleChange('landmark', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter landmark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Village <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.village}
              onChange={(e) => handleChange('village', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.village ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Village</option>
              {villages.map(village => (
                <option key={village} value={village}>{village}</option>
              ))}
            </select>
            {errors.village && <p className="text-red-500 text-xs mt-1">{errors.village}</p>}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Save Center
        </button>
      </div>
    </form>
  );
};