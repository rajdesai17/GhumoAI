import React, { useState } from 'react';
import { Clock, Navigation2, Eye, Car, MapPin, Save, Trash2, Timer, Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveTour } from '../lib/tourService';
import { openGoogleMapsDirections } from '../lib/maps';
import type { Itinerary } from '../types';
import AudioGuide from './AudioGuide';

interface TourDetailsProps {
  itinerary: Itinerary;
  onSaveTour: () => void;
  onStartNavigation: (placeIndex: number) => void;
  onViewLocation?: (placeId: string) => void;
  canSave: boolean;
  currentLocation?: [number, number];
  activePlaceIndex?: number;
}

export default function TourDetails({ 
  itinerary, 
  onSaveTour, 
  onStartNavigation,
  onViewLocation,
  canSave,
  currentLocation,
  activePlaceIndex
}: TourDetailsProps) {
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveTour = async () => {
    if (!user) return;
    
    try {
      setError(null);
      await saveTour(user.id, itinerary);
      onSaveTour();
    } catch (error) {
      console.error('Error saving tour:', error);
      setError('Failed to save tour. Please try again.');
    }
  };

  const handleGetDirections = (location: [number, number], placeName: string) => {
    try {
      openGoogleMapsDirections(location, placeName);
    } catch (error) {
      console.error('Error opening directions:', error);
      setError('Failed to open directions. Please try again.');
    }
  };

  const handleStartNavigation = (index: number) => {
    try {
      setIsNavigating(true);
      onStartNavigation(index);
    } catch (error) {
      console.error('Error starting navigation:', error);
      setError('Failed to start navigation. Please try again.');
    }
  };

  // Function to get first two lines of description
  const getBriefDescription = (description: string) => {
    const sentences = description.split('.');
    const firstTwoSentences = sentences.slice(0, 2).join('.') + '.';
    return firstTwoSentences;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

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
              <li key={index} className={`bg-gray-50 rounded-lg p-4 ${activePlaceIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">{place.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{place.description}</p>
                      </div>
                      {isNavigating && index === activePlaceIndex && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current Destination
                        </span>
                      )}
                    </div>
                    
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
                      <AudioGuide
                        briefText={getBriefDescription(place.description)}
                        fullText={place.description}
                        placeName={place.name}
                        historicalFacts={place.historicalFacts}
                        bestTimeToVisit={place.bestTimeToVisit}
                        highlights={place.highlights}
                      />
                      <button
                        onClick={() => handleStartNavigation(index)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Navigation2 className="w-4 h-4 mr-1" />
                        {isNavigating && index === activePlaceIndex ? 'Navigating...' : 'Start Navigation'}
                      </button>
                      <button
                        onClick={() => handleGetDirections(place.location, place.name)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
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
          {/* <h3 className="text-lg font-semibold text-gray-900 mb-2">Transportation</h3>
          <p className="text-gray-600">{itinerary.transportation}</p> */}
        </div>

        {/* <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Notes</h3>
          <p className="text-gray-600">{itinerary.notes}</p>
        </div> */}

        {itinerary.tips && itinerary.tips.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tips for Your Tour</h3>
            <ul className="space-y-2">
              {itinerary.tips.map((tip, index) => (
                <li key={index} className="flex items-start text-gray-600">
                  <Lightbulb className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {canSave && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveTour}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}