import React from 'react';
import { Clock, Navigation2, Eye, Car } from 'lucide-react';
import type { Itinerary } from '../types';

interface TourDetailsProps {
  itinerary: Itinerary;
  onSaveTour?: () => void;
  onStartNavigation?: () => void;
  onViewLocation?: (placeId: string) => void;
}

export default function TourDetails({ 
  itinerary, 
  onSaveTour, 
  onStartNavigation,
  onViewLocation 
}: TourDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{itinerary.title}</h1>
            <div className="flex items-center mt-2 space-x-4 text-gray-600">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>Total Duration: {itinerary.totalDuration} mins</span>
              </div>
              <div className="flex items-center">
                <Car className="w-5 h-5 mr-2" />
                <span>Transport: {itinerary.transportMode}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onSaveTour}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Tour
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Itinerary</h2>
            <div className="space-y-6">
              {itinerary.places.map((place, index) => (
                <div key={place.id} className="relative">
                  {index < itinerary.places.length - 1 && (
                    <div className="absolute left-4 top-14 bottom-0 w-0.5 bg-blue-200" />
                  )}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{place.name}</h3>
                            <p className="text-gray-600 mt-1">{place.description}</p>
                          </div>
                          <button
                            onClick={() => onViewLocation?.(place.id)}
                            className="ml-4 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View on map"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center bg-white px-3 py-1 rounded-full">
                            <Clock className="w-4 h-4 mr-1 text-blue-500" />
                            <span>Explore: {place.duration} mins</span>
                          </div>
                          {index < itinerary.places.length - 1 && (
                            <div className="flex items-center bg-white px-3 py-1 rounded-full">
                              <Car className="w-4 h-4 mr-1 text-blue-500" />
                              <span>Travel to next: {itinerary.transportTimes[index]} mins</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Tour Actions</h2>
            <div className="space-y-3">
              <button
                onClick={onStartNavigation}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Navigation2 className="w-5 h-5" />
                <span>Start Navigation</span>
              </button>
              <button className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50">
                <span>Listen to Audio Guide</span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Tips for Your Tour</h2>
            <ul className="space-y-2 text-gray-600">
              <li>• Bring comfortable walking shoes</li>
              <li>• Carry water and snacks</li>
              <li>• Check opening hours of attractions</li>
              <li>• Keep your phone charged for navigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}