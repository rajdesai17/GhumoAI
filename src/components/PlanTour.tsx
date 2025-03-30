import React from 'react';
import PreferencesForm from './PreferencesForm';
import type { UserPreferences } from '../types';

const PlanTour: React.FC = () => {
  const handleSubmit = (preferences: UserPreferences) => {
    // Handle form submission
    console.log('Submitted preferences:', preferences);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Plan Your Tour</h1>
          <p className="text-lg text-slate-600">
            Tell us about your preferences and we'll create a personalized tour itinerary for you.
          </p>
        </div>
        <PreferencesForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default PlanTour; 