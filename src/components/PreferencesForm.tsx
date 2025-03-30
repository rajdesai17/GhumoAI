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
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Location Input */}
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-slate-900">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              Where would you like to explore?
            </label>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={preferences.location}
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                placeholder="Enter a city or location"
                className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              {preferences.location && (
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 hover:text-blue-600" />
                </button>
              )}
            </div>
            {locationError && (
              <p className="text-sm text-red-600 text-center">{locationError}</p>
            )}
          </div>

          {/* Duration Selection */}
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-slate-900">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              How long would you like to explore?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {[2, 4, 6, 8].map(hours => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, duration: hours })}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200
                    ${preferences.duration === hours
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <div className="text-lg sm:text-xl mb-1">{hours}</div>
                  <div className="text-xs sm:text-sm">Hours</div>
                </button>
              ))}
            </div>
          </div>

          {/* Transport Mode Selection */}
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-slate-900">
              <Car className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              How would you like to get around?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto">
              {transportOptions.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPreferences({ ...preferences, transportMode: mode.id as UserPreferences['transportMode'] })}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2
                    ${preferences.transportMode === mode.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span className="text-xl sm:text-2xl">{mode.icon}</span>
                  <span className="text-xs sm:text-sm font-medium">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interests Selection */}
          <div className="space-y-3 sm:space-y-4">
            <label className="flex items-center justify-center gap-2 text-base sm:text-lg font-semibold text-slate-900">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              What interests you?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
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
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200
                    ${preferences.interests.includes(interest.label)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span className="text-xs sm:text-sm font-medium">{interest.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !preferences.location}
            className="flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 text-white rounded-full text-sm sm:text-base font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Planning...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Plan My Tour</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}