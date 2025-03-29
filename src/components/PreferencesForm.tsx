import React, { useState } from 'react';
import { MapPin, Clock, Car, Heart, Loader2, Crosshair } from 'lucide-react';
import type { UserPreferences } from '../types';

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

export default function PreferencesForm({ onSubmit, isLoading }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    location: '',
    duration: '2hours',
    transportMode: 'walking',
    interests: [],
    coordinates: undefined
  });

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>();

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError(undefined);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get the location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          
          setPreferences(prev => ({
            ...prev,
            location: data.display_name.split(',')[0], // Use first part of address
            coordinates: [position.coords.latitude, position.coords.longitude]
          }));
        } catch (error) {
          setLocationError('Failed to get location name');
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        setLocationError('Failed to get your location. Please ensure location access is enabled.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  const interestOptions = [
    'History', 'Food', 'Nature', 'Culture', 'Art', 
    'Shopping', 'Nightlife', 'Architecture'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan Your Adventure</h2>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={preferences.location}
              onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
              placeholder="Enter your location"
              className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
              title="Use current location"
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Crosshair className="w-5 h-5" />
              )}
            </button>
          </div>
          {locationError && (
            <p className="mt-1 text-sm text-red-600">{locationError}</p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <Clock className="w-5 h-5" />
            <span>Duration</span>
          </label>
          <select
            value={preferences.duration}
            onChange={(e) => setPreferences({ ...preferences, duration: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2hours">2 Hours</option>
            <option value="halfday">Half Day</option>
            <option value="fullday">Full Day</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <Car className="w-5 h-5" />
            <span>Transport Mode</span>
          </label>
          <select
            value={preferences.transportMode}
            onChange={(e) => setPreferences({ ...preferences, transportMode: e.target.value as UserPreferences['transportMode'] })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="walking">Walking</option>
            <option value="biking">Biking</option>
            <option value="car">Car</option>
            <option value="public">Public Transport</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <Heart className="w-5 h-5" />
            <span>Interests</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {interestOptions.map((interest) => (
              <label key={interest} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferences.interests.includes(interest)}
                  onChange={(e) => {
                    const newInterests = e.target.checked
                      ? [...preferences.interests, interest]
                      : preferences.interests.filter(i => i !== interest);
                    setPreferences({ ...preferences, interests: newInterests });
                  }}
                  className="rounded text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{interest}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex items-center justify-center py-2 px-4 rounded-md transition-colors duration-200 ${
          isLoading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            Generating Tour...
          </>
        ) : (
          'Generate Itinerary'
        )}
      </button>
    </form>
  );
}