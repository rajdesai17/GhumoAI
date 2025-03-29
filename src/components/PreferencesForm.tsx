import React, { useState } from 'react';
import { MapPin, Clock, Car, Heart } from 'lucide-react';
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
  });

  const interestOptions = [
    'History', 'Food', 'Nature', 'Culture', 'Art', 
    'Shopping', 'Nightlife', 'Architecture'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Plan Your Adventure</h2>
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-gray-700 mb-2">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </label>
          <input
            type="text"
            value={preferences.location}
            onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
            placeholder="Enter your location"
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
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
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Tour...
          </>
        ) : (
          'Generate Itinerary'
        )}
      </button>
    </form>
  );
}