import React, { useState } from 'react';
import { Clock, Navigation2, Eye, Car, MapPin, Save, Timer, Lightbulb, Info, Hotel } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { saveTour } from '../lib/tourService';
import { openGoogleMapsDirections } from '../lib/maps';
import type { Itinerary, TourPlanWithHotels } from '../types';
import AudioGuide from './AudioGuide';
import HotelRecommendations from './HotelRecommendations';

interface TourDetailsProps {
  itinerary: TourPlanWithHotels;
  onSaveTour: () => void;
  onStartNavigation: (placeIndex: number) => void;
  onViewLocation?: (placeId: string) => void;
  canSave: boolean;
  activePlaceIndex?: number;
  currentLocation?: [number, number];
  onSelectHotel?: (hotelId: number) => void;
}

export default function TourDetails({ 
  itinerary, 
  onSaveTour, 
  onStartNavigation,
  onViewLocation,
  canSave,
  activePlaceIndex,
  currentLocation,
  onSelectHotel
}: TourDetailsProps) {
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlace, setExpandedPlace] = useState<number | null>(null);
  const [showHotels, setShowHotels] = useState(false);

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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{itinerary.title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{itinerary.totalDuration} mins</span>
            </div>
            <button
              onClick={() => setShowHotels(!showHotels)}
              className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showHotels 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Hotel className="w-4 h-4 mr-2" />
              Hotels
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showHotels ? (
          <HotelRecommendations
            hotels={itinerary.hotels}
            selectedHotelId={itinerary.selectedHotelId}
            onSelectHotel={(hotelId) => onSelectHotel?.(hotelId)}
          />
        ) : (
          <>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Places to Visit</h3>
              <ul className="space-y-4">
                {itinerary.places.map((place, index) => (
                  <li 
                    key={index} 
                    className={`bg-gray-50 rounded-xl p-4 border ${
                      activePlaceIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-1">{place.name}</h4>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center text-xs text-gray-600 bg-white px-2 py-1 rounded-full border border-gray-100">
                                <Timer className="w-3 h-3 mr-1 text-blue-500" />
                                <span>Explore: {place.duration} mins</span>
                              </div>
                              {index < itinerary.places.length - 1 && (
                                <div className="flex items-center text-xs text-gray-600 bg-white px-2 py-1 rounded-full border border-gray-100">
                                  <Car className="w-3 h-3 mr-1 text-blue-500" />
                                  <span>Next stop: {itinerary.transportTimes[index]} mins</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {isNavigating && index === activePlaceIndex && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Current Stop
                            </span>
                          )}
                        </div>

                        <div className="relative mb-3">
                          <p className="text-sm text-gray-600 pr-6 line-clamp-2">
                            {getBriefDescription(place.description)}
                          </p>
                          <button
                            onClick={() => setExpandedPlace(expandedPlace === index ? null : index)}
                            className="absolute right-0 top-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Toggle details"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>

                        {expandedPlace === index && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100 text-sm text-gray-600">
                            <p className="mb-3">{place.description}</p>
                            {place.historicalFacts && place.historicalFacts.length > 0 && (
                              <div className="mb-3">
                                <strong className="text-gray-900">Historical Facts:</strong>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                  {place.historicalFacts.map((fact, i) => (
                                    <li key={i}>{fact}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {place.bestTimeToVisit && (
                              <div className="mb-3">
                                <strong className="text-gray-900">Best Time to Visit:</strong>
                                <p className="mt-1">{place.bestTimeToVisit}</p>
                              </div>
                            )}
                            {place.highlights && place.highlights.length > 0 && (
                              <div>
                                <strong className="text-gray-900">Highlights:</strong>
                                <ul className="list-disc list-inside mt-1 space-y-1">
                                  {place.highlights.map((highlight, i) => (
                                    <li key={i}>{highlight}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-3">
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
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Navigation2 className="w-3 h-3 mr-1.5" />
                            {isNavigating && index === activePlaceIndex ? 'Navigating...' : 'Navigate'}
                          </button>
                          <button
                            onClick={() => handleGetDirections(place.location, place.name)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <MapPin className="w-3 h-3 mr-1.5" />
                            Directions
                          </button>
                          {onViewLocation && (
                            <button
                              onClick={() => onViewLocation(place.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Eye className="w-3 h-3 mr-1.5" />
                              View
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {itinerary.tips && itinerary.tips.length > 0 && (
              <div className="mt-6 bg-yellow-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tips for Your Tour</h3>
                <ul className="space-y-2">
                  {itinerary.tips.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <Lightbulb className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {canSave && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveTour}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Tour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}