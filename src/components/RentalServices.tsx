import React, { useState } from 'react';
import { Search, Filter, Car, Bike, Truck, Clock, Users, Fuel, Handshake } from 'lucide-react';
import PartnershipForm from './PartnershipForm';

interface Vehicle {
  id: string;
  name: string;
  type: 'car' | 'bike' | 'truck';
  pricePerDay: number;
  capacity: number;
  transmission: string;
  fuelType: string;
  available: boolean;
}

const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Toyota Innova',
    type: 'car',
    pricePerDay: 2500,
    capacity: 7,
    transmission: 'Manual',
    fuelType: 'Diesel',
    available: true
  },
  {
    id: '2',
    name: 'Honda City',
    type: 'car',
    pricePerDay: 1800,
    capacity: 5,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    available: true
  },
  {
    id: '3',
    name: 'Royal Enfield Classic 350',
    type: 'bike',
    pricePerDay: 800,
    capacity: 2,
    transmission: 'Manual',
    fuelType: 'Petrol',
    available: true
  },
  {
    id: '4',
    name: 'Tata Ace',
    type: 'truck',
    pricePerDay: 3500,
    capacity: 2,
    transmission: 'Manual',
    fuelType: 'Diesel',
    available: true
  }
];

const RentalServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'car' | 'bike' | 'truck'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showPartnershipForm, setShowPartnershipForm] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || vehicle.type === selectedType;
    const matchesPrice = vehicle.pricePerDay >= priceRange[0] && vehicle.pricePerDay <= priceRange[1];
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Vehicle Rental</h1>
          <p className="text-base sm:text-lg text-slate-600">
            Rent vehicles for your tour and explore at your own pace.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicles..."
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="w-full px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
                <option value="truck">Trucks</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={0}
                  max={1000}
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm sm:text-base text-slate-600 whitespace-nowrap">
                  Up to ₹{priceRange[0]}/hr
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {vehicle.type === 'car' && <Car className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />}
                  {vehicle.type === 'bike' && <Bike className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
                  {vehicle.type === 'truck' && <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{vehicle.name}</h3>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                  vehicle.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.available ? 'Available' : 'Not Available'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="text-slate-600">Price per hour</span>
                  <span className="font-semibold text-slate-900">₹{vehicle.pricePerDay}</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="text-slate-600">Capacity</span>
                  <span className="font-semibold text-slate-900">{vehicle.capacity} persons</span>
                </div>
                <div className="flex items-center justify-between text-sm sm:text-base">
                  <span className="text-slate-600">Location</span>
                  <span className="font-semibold text-slate-900">{vehicle.location}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowPartnershipForm(true)}
                  className="flex-1 px-4 py-2 text-sm sm:text-base font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Partner
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Partnership Form Modal */}
        {showPartnershipForm && (
          <PartnershipForm onClose={() => setShowPartnershipForm(false)} />
        )}
      </div>
    </div>
  );
};

export default RentalServices; 