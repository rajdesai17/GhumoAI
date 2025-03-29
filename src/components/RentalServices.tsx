import React, { useState, useMemo } from 'react';
import { Car, Filter, Bike, Truck } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: 'bike' | 'scooty' | 'sedan' | 'suv' | 'luxury';
  pricePerHour: number;
  pricePerDay: number;
  image: string;
  seats: number;
  available: boolean;
  location: string;
  rating: number;
}

const dummyVehicles: Vehicle[] = [
  {
    id: 'bike1',
    name: 'Royal Enfield Classic 350',
    type: 'bike',
    pricePerHour: 150,
    pricePerDay: 800,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80',
    seats: 2,
    available: true,
    location: 'City Center',
    rating: 4.5
  },
  {
    id: 'scooty1',
    name: 'Honda Activa 6G',
    type: 'scooty',
    pricePerHour: 100,
    pricePerDay: 500,
    image: 'https://images.unsplash.com/photo-1601512986351-9b0e01fcf2d3?auto=format&fit=crop&q=80',
    seats: 2,
    available: true,
    location: 'Downtown',
    rating: 4.2
  },
  {
    id: 'sedan1',
    name: 'Honda City',
    type: 'sedan',
    pricePerHour: 400,
    pricePerDay: 2500,
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80',
    seats: 5,
    available: true,
    location: 'Airport',
    rating: 4.7
  },
  {
    id: 'suv1',
    name: 'Toyota Fortuner',
    type: 'suv',
    pricePerHour: 600,
    pricePerDay: 3500,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80',
    seats: 7,
    available: true,
    location: 'City Center',
    rating: 4.8
  },
  {
    id: 'luxury1',
    name: 'Mercedes-Benz E-Class',
    type: 'luxury',
    pricePerHour: 1000,
    pricePerDay: 6000,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80',
    seats: 5,
    available: true,
    location: 'Premium Zone',
    rating: 4.9
  }
];

const RentalServices: React.FC = () => {
  const [filters, setFilters] = useState({
    type: 'all',
    priceRange: 'all',
    location: 'all',
    seats: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

  const filteredVehicles = useMemo(() => {
    return dummyVehicles.filter(vehicle => {
      if (filters.type !== 'all' && vehicle.type !== filters.type) return false;
      
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (vehicle.pricePerDay < min || vehicle.pricePerDay > max) return false;
      }
      
      if (filters.location !== 'all' && vehicle.location !== filters.location) return false;
      
      if (filters.seats !== 'all' && vehicle.seats !== parseInt(filters.seats)) return false;
      
      return true;
    });
  }, [filters]);

  const locations = [...new Set(dummyVehicles.map(v => v.location))];
  const seatOptions = [...new Set(dummyVehicles.map(v => v.seats))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Rental Services</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              className="border rounded-md p-2"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="all">All Types</option>
              <option value="bike">Bike</option>
              <option value="scooty">Scooty</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="luxury">Luxury</option>
            </select>

            <select
              className="border rounded-md p-2"
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            >
              <option value="all">All Prices</option>
              <option value="0-1000">Under ₹1000/day</option>
              <option value="1000-2500">₹1000 - ₹2500/day</option>
              <option value="2500-5000">₹2500 - ₹5000/day</option>
              <option value="5000-999999">Above ₹5000/day</option>
            </select>

            <select
              className="border rounded-md p-2"
              value={filters.location}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
            >
              <option value="all">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              className="border rounded-md p-2"
              value={filters.seats}
              onChange={(e) => setFilters({...filters, seats: e.target.value})}
            >
              <option value="all">All Seat Capacities</option>
              {seatOptions.map(seats => (
                <option key={seats} value={seats}>{seats} Seats</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={vehicle.image} 
              alt={vehicle.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">{vehicle.name}</h3>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 text-gray-600">{vehicle.rating}</span>
              </div>
              <div className="mt-2 text-gray-600">
                <p>Type: {vehicle.type.charAt(0).toUpperCase() + vehicle.type.slice(1)}</p>
                <p>Location: {vehicle.location}</p>
                <p>Seats: {vehicle.seats}</p>
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-900">₹{vehicle.pricePerDay}/day</p>
                <p className="text-sm text-gray-600">₹{vehicle.pricePerHour}/hour</p>
              </div>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalServices; 