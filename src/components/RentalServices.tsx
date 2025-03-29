import React, { useState } from 'react';
import { Search, Filter, Car, Bike, Truck, Clock, Users, Fuel } from 'lucide-react';

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

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || vehicle.type === selectedType;
    const matchesPrice = vehicle.pricePerDay >= priceRange[0] && vehicle.pricePerDay <= priceRange[1];
    return matchesSearch && matchesType && matchesPrice;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vehicle Rental Services</h1>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="car">Cars</option>
              <option value="bike">Bikes</option>
              <option value="truck">Trucks</option>
            </select>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {vehicle.type === 'car' && <Car className="w-6 h-6 text-blue-500" />}
                {vehicle.type === 'bike' && <Bike className="w-6 h-6 text-green-500" />}
                {vehicle.type === 'truck' && <Truck className="w-6 h-6 text-orange-500" />}
                <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                vehicle.available
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {vehicle.available ? 'Available' : 'Not Available'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{vehicle.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4" />
                  <span>{vehicle.fuelType}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{vehicle.capacity} seats</span>
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  ₹{vehicle.pricePerDay}/day
                </div>
              </div>
            </div>

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!vehicle.available}
            >
              {vehicle.available ? 'Rent Now' : 'Not Available'}
            </button>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RentalServices; 