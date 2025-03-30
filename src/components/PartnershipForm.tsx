import React, { useState } from 'react';
import { X, Car, Bike, Truck, Building2, Phone, Mail, MapPin } from 'lucide-react';

interface PartnershipFormProps {
  onClose: () => void;
}

interface FormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  vehicleTypes: ('car' | 'bike' | 'truck')[];
  vehicleCount: number;
  commission: number;
}

const PartnershipForm: React.FC<PartnershipFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    vehicleTypes: [],
    vehicleCount: 0,
    commission: 10 // Default commission rate
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Partnership form submitted:', formData);
    // Show success message and close form
    onClose();
  };

  const toggleVehicleType = (type: 'car' | 'bike' | 'truck') => {
    setFormData(prev => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter(t => t !== type)
        : [...prev.vehicleTypes, type]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-[100]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3 sm:p-4 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Partner With Us</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Business Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter business name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, ownerName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter owner name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter complete business address"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Types
                </label>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => toggleVehicleType('car')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      formData.vehicleTypes.includes('car')
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    <Car className="w-5 h-5" />
                    Cars
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVehicleType('bike')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      formData.vehicleTypes.includes('bike')
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    <Bike className="w-5 h-5" />
                    Bikes
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleVehicleType('truck')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      formData.vehicleTypes.includes('truck')
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-gray-300 text-gray-700 hover:border-blue-500'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    Trucks
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Vehicles
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.vehicleCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleCount: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Commission Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Commission Information</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700">
                  Our platform charges a commission of {formData.commission}% on each booking. 
                  This helps us maintain the platform and provide marketing services to reach more customers.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Partnership Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnershipForm; 