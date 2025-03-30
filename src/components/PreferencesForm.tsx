import React, { useState } from 'react';
import { MapPin, Clock, Car, Heart, Loader2, Crosshair } from 'lucide-react';
import type { UserPreferences } from '../types';

interface PreferencesFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading?: boolean;
}

const interestOptions = [
  { id: 'history', label: 'History', icon: '🏛️' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'culture', label: 'Culture', icon: '🎭' },
  { id: 'art', label: 'Art', icon: '🎨' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'architecture', label: 'Architecture', icon: '🏰' }
];

const transportOptions = [
  { id: 'walking', label: 'Walking', icon: '🚶' },
  { id: 'biking', label: 'Biking', icon: '🚲' },
  { id: 'car', label: 'Car', icon: '🚗' },
  { id: 'public', label: 'Public Transport', icon: '🚌' }
];

export default function PreferencesForm({ onSubmit, isLoading }: PreferencesFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    location: '',
    duration: 2,
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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          
          setPreferences(prev => ({
            ...prev,
            location: data.display_name.split(',')[0],
            coordinates: [position.coords.latitude, position.coords.longitude]
          }));
        } catch {
          setLocationError('Failed to get location name');
        } finally {
          setIsGettingLocation(false);
        }
      },
      () => {
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

  return (
    <div className="min-h-[calc(100vh-12rem)] bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-auto overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Location Input */}
          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-900">
              <MapPin className="w-5 h-5 text-blue-500" />
              Where would you like to go?
            </label>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={preferences.location}
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                placeholder="Enter your destination"
                className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-800 text-center text-lg"
                required
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
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
              <p className="text-sm text-red-600 text-center">{locationError}</p>
            )}
          </div>

          {/* Duration Selection */}
          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-900">
              <Clock className="w-5 h-5 text-blue-500" />
              How long would you like to explore?
            </label>
            <div className="max-w-xl mx-auto">
              <select
                value={preferences.duration}
                onChange={(e) => setPreferences({ ...preferences, duration: parseInt(e.target.value) })}
                className="w-full px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-slate-800 text-center text-lg appearance-none"
              >
                <option value={2}>2 Hours</option>
                <option value={4}>4 Hours</option>
                <option value={8}>8 Hours (Full Day)</option>
              </select>
            </div>
          </div>

          {/* Transport Mode */}
          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-900">
              <Car className="w-5 h-5 text-blue-500" />
              How would you like to get around?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {transportOptions.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, transportMode: mode.id as UserPreferences['transportMode'] })}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                    ${preferences.transportMode === mode.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span className="text-2xl">{mode.icon}</span>
                  <span className="font-medium">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interests Selection */}
          <div className="space-y-3">
            <label className="flex items-center justify-center gap-2 text-lg font-semibold text-slate-900">
              <Heart className="w-5 h-5 text-blue-500" />
              What interests you?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {interestOptions.map(interest => (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => {
                    const newInterests = preferences.interests.includes(interest.label)
                      ? preferences.interests.filter(i => i !== interest.label)
                      : [...preferences.interests, interest.label];
                    setPreferences({ ...preferences, interests: newInterests });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                    ${preferences.interests.includes(interest.label)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span className="text-2xl">{interest.icon}</span>
                  <span className="font-medium">{interest.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <div className="max-w-xl mx-auto">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-4 px-6 rounded-xl transition-all duration-200 text-lg font-semibold
                ${isLoading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                } text-white`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Creating Your Perfect Tour...
                </>
              ) : (
                <>
                  Generate Itinerary
                  <span className="ml-2">✨</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}