import React, { useState } from 'react';
import { VillageFormData } from '../../types/village';

interface VillageFormProps {
  onSubmit: (data: VillageFormData) => void;
  onCancel: () => void;
  initialData?: Partial<VillageFormData>;
}

export const VillageForm: React.FC<VillageFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<VillageFormData>({
    // General Information
    countryName: initialData.countryName || '',
    branchId: initialData.branchId || '',
    villageName: initialData.villageName || '',
    villageClassification: initialData.villageClassification || '',
    pincode: initialData.pincode || '',
    district: initialData.district || '',
    postOffice: initialData.postOffice || '',
    mohallaName: initialData.mohallaName || '',
    panchayatName: initialData.panchayatName || '',
    policeStation: initialData.policeStation || '',
    contactPersonName: initialData.contactPersonName || '',
    language: initialData.language || '',
    customerBaseExpected: initialData.customerBaseExpected || 0,
    
    // MFI Information
    mfi1Name: initialData.mfi1Name || '',
    mfi1ApproxCust: initialData.mfi1ApproxCust || 0,
    mfi2Name: initialData.mfi2Name || '',
    mfi2ApproxCust: initialData.mfi2ApproxCust || 0,
    mfi3Name: initialData.mfi3Name || '',
    mfi3ApproxCust: initialData.mfi3ApproxCust || 0,
    mfi4Name: initialData.mfi4Name || '',
    mfi4ApproxCust: initialData.mfi4ApproxCust || 0,
    
    // Distance Information
    distanceFromBranch: initialData.distanceFromBranch || 0,
    mainRoadDistance: initialData.mainRoadDistance || 0,
    schoolDistance: initialData.schoolDistance || 0,
    nearestSchoolName: initialData.nearestSchoolName || '',
    bankDistance: initialData.bankDistance || 0,
    nearestBankName: initialData.nearestBankName || '',
    hospitalDistance: initialData.hospitalDistance || 0,
    nearestHospitalName: initialData.nearestHospitalName || '',
    marketDistance: initialData.marketDistance || 0,
    nearestMarketName: initialData.nearestMarketName || '',
    policeStationDistance: initialData.policeStationDistance || 0,
    
    // Amenities
    numberOfSchools: initialData.numberOfSchools || 0,
    totalClinics: initialData.totalClinics || 0,
    totalKiryanaStores: initialData.totalKiryanaStores || 0,
    totalGeneralStores: initialData.totalGeneralStores || 0,
    totalTailors: initialData.totalTailors || 0,
    totalVegetableStalls: initialData.totalVegetableStalls || 0,
    totalFruitStalls: initialData.totalFruitStalls || 0,
    totalTeaStalls: initialData.totalTeaStalls || 0,
    totalDairies: initialData.totalDairies || 0,
    totalCattle: initialData.totalCattle || 0,
    totalHotels: initialData.totalHotels || 0,
    totalStationeryShops: initialData.totalStationeryShops || 0,
    privateHospitalBeds: initialData.privateHospitalBeds || 0,
    governmentHospitalBeds: initialData.governmentHospitalBeds || 0,
    totalAashaWorkers: initialData.totalAashaWorkers || 0,
    
    // Population
    population: initialData.population || 0,
    menPopulation: initialData.menPopulation || 0,
    womenPopulation: initialData.womenPopulation || 0,
    literateMen: initialData.literateMen || 0,
    literateWomen: initialData.literateWomen || 0,
    
    // Road and House Type
    totalKutchaHouses: initialData.totalKutchaHouses || 0,
    totalPakkaHouses: initialData.totalPakkaHouses || 0,
    roadType: initialData.roadType || '',
    schoolType: initialData.schoolType || '',
    hospitalType: initialData.hospitalType || '',
    
    // Religion
    religionMajority: initialData.religionMajority || '',
    category: initialData.category || '',
    casteMajority: initialData.casteMajority || '',
  });

  const [errors, setErrors] = useState<Partial<VillageFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<VillageFormData> = {};

    // Mandatory fields validation
    if (!formData.countryName) newErrors.countryName = 'Country name is required';
    if (!formData.branchId) newErrors.branchId = 'Branch ID is required';
    if (!formData.villageName) newErrors.villageName = 'Village name is required';
    if (!formData.villageClassification) newErrors.villageClassification = 'Village classification is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact person name is required';
    if (!formData.language) newErrors.language = 'Language is required';
    if (!formData.customerBaseExpected) newErrors.customerBaseExpected = 'Customer base expected is required';
    if (!formData.distanceFromBranch) newErrors.distanceFromBranch = 'Distance from branch is required';
    if (!formData.bankDistance) newErrors.bankDistance = 'Bank distance is required';
    if (!formData.nearestBankName) newErrors.nearestBankName = 'Nearest bank name is required';
    if (!formData.hospitalDistance) newErrors.hospitalDistance = 'Hospital distance is required';
    if (!formData.nearestHospitalName) newErrors.nearestHospitalName = 'Nearest hospital name is required';
    if (!formData.policeStationDistance) newErrors.policeStationDistance = 'Police station distance is required';
    if (!formData.population) newErrors.population = 'Population is required';
    if (!formData.roadType) newErrors.roadType = 'Road type is required';
    if (!formData.schoolType) newErrors.schoolType = 'School type is required';
    if (!formData.hospitalType) newErrors.hospitalType = 'Hospital type is required';
    if (!formData.religionMajority) newErrors.religionMajority = 'Religion majority is required';
    if (!formData.category) newErrors.category = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof VillageFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[80vh] overflow-y-auto dark:bg-gray-800">
      {/* General Information Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
          📋 General Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Country Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.countryName}
              onChange={(e) => handleChange('countryName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.countryName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter country name"
            />
            {errors.countryName && <p className="text-red-500 text-xs mt-1">{errors.countryName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Branch ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.branchId}
              onChange={(e) => handleChange('branchId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.branchId ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter branch ID"
            />
            {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Village Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.villageName}
              onChange={(e) => handleChange('villageName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.villageName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter village name"
            />
            {errors.villageName && <p className="text-red-500 text-xs mt-1">{errors.villageName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Village Classification <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.villageClassification}
              onChange={(e) => handleChange('villageClassification', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.villageClassification ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Classification</option>
              <option value="Rural">Rural</option>
              <option value="Urban">Urban</option>
              <option value="Semi-Urban">Semi-Urban</option>
            </select>
            {errors.villageClassification && <p className="text-red-500 text-xs mt-1">{errors.villageClassification}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.pincode ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter pincode"
            />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              District
            </label>
            <input
              type="text"
              value={formData.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter district"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Post Office
            </label>
            <input
              type="text"
              value={formData.postOffice}
              onChange={(e) => handleChange('postOffice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter post office"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mohalla Name
            </label>
            <input
              type="text"
              value={formData.mohallaName}
              onChange={(e) => handleChange('mohallaName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter mohalla name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Panchayat Name
            </label>
            <input
              type="text"
              value={formData.panchayatName}
              onChange={(e) => handleChange('panchayatName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter panchayat name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Police Station
            </label>
            <input
              type="text"
              value={formData.policeStation}
              onChange={(e) => handleChange('policeStation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter police station"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Person Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contactPersonName}
              onChange={(e) => handleChange('contactPersonName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.contactPersonName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter contact person name"
            />
            {errors.contactPersonName && <p className="text-red-500 text-xs mt-1">{errors.contactPersonName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.language ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Language</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Bengali">Bengali</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Marathi">Marathi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Kannada">Kannada</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Punjabi">Punjabi</option>
            </select>
            {errors.language && <p className="text-red-500 text-xs mt-1">{errors.language}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Base Expected <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.customerBaseExpected}
              onChange={(e) => handleChange('customerBaseExpected', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.customerBaseExpected ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter expected customer base"
              min="0"
            />
            {errors.customerBaseExpected && <p className="text-red-500 text-xs mt-1">{errors.customerBaseExpected}</p>}
          </div>
        </div>
      </div>

      {/* MFI Information Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
          🏦 MFI Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name of MFI 1
            </label>
            <input
              type="text"
              value={formData.mfi1Name}
              onChange={(e) => handleChange('mfi1Name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter MFI 1 name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Approx. CUST MFI 1
            </label>
            <input
              type="number"
              value={formData.mfi1ApproxCust}
              onChange={(e) => handleChange('mfi1ApproxCust', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter approximate customers"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name of MFI 2
            </label>
            <input
              type="text"
              value={formData.mfi2Name}
              onChange={(e) => handleChange('mfi2Name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter MFI 2 name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Approx. CUST MFI 2
            </label>
            <input
              type="number"
              value={formData.mfi2ApproxCust}
              onChange={(e) => handleChange('mfi2ApproxCust', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter approximate customers"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name of MFI 3
            </label>
            <input
              type="text"
              value={formData.mfi3Name}
              onChange={(e) => handleChange('mfi3Name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter MFI 3 name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Approx. CUST MFI 3
            </label>
            <input
              type="number"
              value={formData.mfi3ApproxCust}
              onChange={(e) => handleChange('mfi3ApproxCust', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter approximate customers"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name of MFI 4
            </label>
            <input
              type="text"
              value={formData.mfi4Name}
              onChange={(e) => handleChange('mfi4Name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter MFI 4 name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Approx. CUST MFI 4
            </label>
            <input
              type="number"
              value={formData.mfi4ApproxCust}
              onChange={(e) => handleChange('mfi4ApproxCust', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter approximate customers"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Distance Information Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
          📏 Distance (in KMs)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Distance From Branch <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.distanceFromBranch}
              onChange={(e) => handleChange('distanceFromBranch', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.distanceFromBranch ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter distance in KMs"
              min="0"
            />
            {errors.distanceFromBranch && <p className="text-red-500 text-xs mt-1">{errors.distanceFromBranch}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Main Road Distance
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.mainRoadDistance}
              onChange={(e) => handleChange('mainRoadDistance', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter distance in KMs"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              School Distance
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.schoolDistance}
              onChange={(e) => handleChange('schoolDistance', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter distance in KMs"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nearest School Name
            </label>
            <input
              type="text"
              value={formData.nearestSchoolName}
              onChange={(e) => handleChange('nearestSchoolName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter nearest school name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bank Distance <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.bankDistance}
              onChange={(e) => handleChange('bankDistance', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.bankDistance ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter distance in KMs"
              min="0"
            />
            {errors.bankDistance && <p className="text-red-500 text-xs mt-1">{errors.bankDistance}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nearest Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nearestBankName}
              onChange={(e) => handleChange('nearestBankName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.nearestBankName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter nearest bank name"
            />
            {errors.nearestBankName && <p className="text-red-500 text-xs mt-1">{errors.nearestBankName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hospital Distance <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.hospitalDistance}
              onChange={(e) => handleChange('hospitalDistance', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.hospitalDistance ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter distance in KMs"
              min="0"
            />
            {errors.hospitalDistance && <p className="text-red-500 text-xs mt-1">{errors.hospitalDistance}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nearest Hospital Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nearestHospitalName}
              onChange={(e) => handleChange('nearestHospitalName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.nearestHospitalName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter nearest hospital name"
            />
            {errors.nearestHospitalName && <p className="text-red-500 text-xs mt-1">{errors.nearestHospitalName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Market Distance
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.marketDistance}
              onChange={(e) => handleChange('marketDistance', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter distance in KMs"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nearest Market Name
            </label>
            <input
              type="text"
              value={formData.nearestMarketName}
              onChange={(e) => handleChange('nearestMarketName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter nearest market name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Police Station Distance <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.policeStationDistance}
              onChange={(e) => handleChange('policeStationDistance', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.policeStationDistance ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter distance in KMs"
              min="0"
            />
            {errors.policeStationDistance && <p className="text-red-500 text-xs mt-1">{errors.policeStationDistance}</p>}
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
          🏪 Amenities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Schools
            </label>
            <input
              type="number"
              value={formData.numberOfSchools}
              onChange={(e) => handleChange('numberOfSchools', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Clinics
            </label>
            <input
              type="number"
              value={formData.totalClinics}
              onChange={(e) => handleChange('totalClinics', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Kiryana Stores
            </label>
            <input
              type="number"
              value={formData.totalKiryanaStores}
              onChange={(e) => handleChange('totalKiryanaStores', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total General Stores
            </label>
            <input
              type="number"
              value={formData.totalGeneralStores}
              onChange={(e) => handleChange('totalGeneralStores', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Tailors
            </label>
            <input
              type="number"
              value={formData.totalTailors}
              onChange={(e) => handleChange('totalTailors', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Vegetable Stalls
            </label>
            <input
              type="number"
              value={formData.totalVegetableStalls}
              onChange={(e) => handleChange('totalVegetableStalls', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Fruit Stalls
            </label>
            <input
              type="number"
              value={formData.totalFruitStalls}
              onChange={(e) => handleChange('totalFruitStalls', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Tea Stalls
            </label>
            <input
              type="number"
              value={formData.totalTeaStalls}
              onChange={(e) => handleChange('totalTeaStalls', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Dairies
            </label>
            <input
              type="number"
              value={formData.totalDairies}
              onChange={(e) => handleChange('totalDairies', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Cattle
            </label>
            <input
              type="number"
              value={formData.totalCattle}
              onChange={(e) => handleChange('totalCattle', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Hotels
            </label>
            <input
              type="number"
              value={formData.totalHotels}
              onChange={(e) => handleChange('totalHotels', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Stationery Shops
            </label>
            <input
              type="number"
              value={formData.totalStationeryShops}
              onChange={(e) => handleChange('totalStationeryShops', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Private Hospital Beds
            </label>
            <input
              type="number"
              value={formData.privateHospitalBeds}
              onChange={(e) => handleChange('privateHospitalBeds', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Government Hospital Beds
            </label>
            <input
              type="number"
              value={formData.governmentHospitalBeds}
              onChange={(e) => handleChange('governmentHospitalBeds', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Aasha Workers
            </label>
            <input
              type="number"
              value={formData.totalAashaWorkers}
              onChange={(e) => handleChange('totalAashaWorkers', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Population Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
          👥 Population
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Population <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.population}
              onChange={(e) => handleChange('population', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.population ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter total population"
              min="0"
            />
            {errors.population && <p className="text-red-500 text-xs mt-1">{errors.population}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Men Population
            </label>
            <input
              type="number"
              value={formData.menPopulation}
              onChange={(e) => handleChange('menPopulation', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter men population"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Women Population
            </label>
            <input
              type="number"
              value={formData.womenPopulation}
              onChange={(e) => handleChange('womenPopulation', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter women population"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Literate Men
            </label>
            <input
              type="number"
              value={formData.literateMen}
              onChange={(e) => handleChange('literateMen', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter literate men"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Literate Women
            </label>
            <input
              type="number"
              value={formData.literateWomen}
              onChange={(e) => handleChange('literateWomen', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter literate women"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Road and House Type Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
          🏠 Road and House Type
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Kutcha Houses
            </label>
            <input
              type="number"
              value={formData.totalKutchaHouses}
              onChange={(e) => handleChange('totalKutchaHouses', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Pakka Houses
            </label>
            <input
              type="number"
              value={formData.totalPakkaHouses}
              onChange={(e) => handleChange('totalPakkaHouses', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter number"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Road Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.roadType}
              onChange={(e) => handleChange('roadType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.roadType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Road Type</option>
              <option value="Paved">Paved</option>
              <option value="Unpaved">Unpaved</option>
              <option value="Gravel">Gravel</option>
              <option value="Dirt">Dirt</option>
            </select>
            {errors.roadType && <p className="text-red-500 text-xs mt-1">{errors.roadType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              School Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.schoolType}
              onChange={(e) => handleChange('schoolType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.schoolType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select School Type</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Both">Both</option>
              <option value="None">None</option>
            </select>
            {errors.schoolType && <p className="text-red-500 text-xs mt-1">{errors.schoolType}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Hospital Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.hospitalType}
              onChange={(e) => handleChange('hospitalType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.hospitalType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Hospital Type</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Both">Both</option>
              <option value="None">None</option>
            </select>
            {errors.hospitalType && <p className="text-red-500 text-xs mt-1">{errors.hospitalType}</p>}
          </div>
        </div>
      </div>

      {/* Religion Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-600">
          🕉️ Religion
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Religion Majority <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.religionMajority}
              onChange={(e) => handleChange('religionMajority', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.religionMajority ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Religion</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Buddhist">Buddhist</option>
              <option value="Jain">Jain</option>
              <option value="Other">Other</option>
            </select>
            {errors.religionMajority && <p className="text-red-500 text-xs mt-1">{errors.religionMajority}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="EWS">EWS</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Caste Majority
            </label>
            <input
              type="text"
              value={formData.casteMajority}
              onChange={(e) => handleChange('casteMajority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter caste majority"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Save Village
        </button>
      </div>
    </form>
  );
};