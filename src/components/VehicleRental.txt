import React from 'react';
import { Car, Calendar, MapPin, Users } from 'lucide-react';

export default function VehicleRental() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Vehicle Rental</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search Form */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <MapPin className="w-5 h-5" />
                <span>Pickup Location</span>
              </label>
              <input
                type="text"
                placeholder="Enter pickup location"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <Calendar className="w-5 h-5" />
                <span>Pickup Date & Time</span>
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <Calendar className="w-5 h-5" />
                <span>Return Date & Time</span>
              </label>
              <input
                type="datetime-local"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 mb-2">
                <Users className="w-5 h-5" />
                <span>Number of Passengers</span>
              </label>
              <select className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4 Passengers</option>
                <option value="5">5 Passengers</option>
              </select>
            </div>

            <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Search Vehicles
            </button>
          </div>

          {/* Vehicle Types */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Available Vehicle Types</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <Car className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Economy</h3>
                    <p className="text-sm text-gray-500">Up to 2 passengers</p>
                  </div>
                </div>
                <span className="text-gray-900">From $30/day</span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <Car className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Compact</h3>
                    <p className="text-sm text-gray-500">Up to 3 passengers</p>
                  </div>
                </div>
                <span className="text-gray-900">From $40/day</span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:border-blue-500 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <Car className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">SUV</h3>
                    <p className="text-sm text-gray-500">Up to 5 passengers</p>
                  </div>
                </div>
                <span className="text-gray-900">From $60/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 