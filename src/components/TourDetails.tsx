import React from 'react';
import { Clock, Navigation2, Eye, Car, MapPin, Save, Trash2, Timer } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveTour } from '../lib/tourService';
import { openGoogleMapsDirections } from '../lib/maps';
import type { Itinerary } from '../types';

interface TourDetailsProps {
  itinerary: Itinerary;
  onSaveTour: () => void;
  onStartNavigation: () => void;
  onViewLocation?: (placeId: string) => void;
  canSave: boolean;
}

export default function TourDetails({ 
  itinerary, 
  onSaveTour, 
  onStartNavigation,
  onViewLocation,
  canSave
}: TourDetailsProps) {
  const { user } = useAuth();

  const handleSaveTour = async () => {
    if (!user) return;
    
    try {
      await saveTour(user.id, itinerary);
      onSaveTour();
    } catch (error) {
      console.error('Error saving tour:', error);
    }
  };

  const handleGetDirections = (location: [number, number], placeName: string) => {
    openGoogleMapsDirections(location, placeName);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{itinerary.title}</h2>
        <div className="flex items-center text-gray-600">
          <Clock className="w-5 h-5 mr-2" />
          <span>Total Duration: {itinerary.totalDuration} mins</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Places to Visit</h3>
          <ul className="space-y-4">
            {itinerary.places.map((place, index) => (
              <li key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="ml-3 flex-1">
                    <h4 className="text-base font-medium text-gray-900">{place.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{place.description}</p>
                    
                    {/* Time Information */}
                    <div className="mt-3 flex flex-wrap gap-3">
                      <div className="flex items-center text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        <Timer className="w-4 h-4 mr-1 text-blue-500" />
                        <span>Explore: {place.duration} mins</span>
                      </div>
                      {index < itinerary.places.length - 1 && (
                        <div className="flex items-center text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                          <Car className="w-4 h-4 mr-1 text-blue-500" />
                          <span>Travel to next: {itinerary.transportTimes[index]} mins</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleGetDirections(place.location, place.name)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Navigation2 className="w-4 h-4 mr-1" />
                        Get Directions
                      </button>
                      {onViewLocation && (
                        <button
                          onClick={() => onViewLocation(place.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View on Map
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Transportation</h3>
          <p className="text-gray-600">{itinerary.transportation}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
          <p className="text-gray-600">{itinerary.notes}</p>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={onStartNavigation}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center justify-center"
          >
            <Navigation2 className="w-5 h-5 mr-2" />
            Start Navigation
          </button>
          {canSave && (
            <button
              onClick={handleSaveTour}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center justify-center"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}