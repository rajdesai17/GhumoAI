import React from 'react';
import { Clock, Navigation2 } from 'lucide-react';
import type { Itinerary } from '../types';

interface TourDetailsProps {
  itinerary: Itinerary;
  onSaveTour?: () => void;
  onStartNavigation?: () => void;
}

export default function TourDetails({ itinerary, onSaveTour, onStartNavigation }: TourDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{itinerary.title}</h1>
            <div className="flex items-center mt-2 text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <span>{itinerary.totalDuration} mins Tour</span>
            </div>
          </div>
          <button
            onClick={onSaveTour}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
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
                        <h3 className="font-semibold text-gray-900">{place.name}</h3>
                        <p className="text-gray-600 mt-1">{place.description}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{place.duration} mins</span>
                          {index < itinerary.places.length - 1 && (
                            <span className="ml-3">
                              {itinerary.transportTimes[index]} mins to next stop
                            </span>
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
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
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