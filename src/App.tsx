import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PreferencesForm from './components/PreferencesForm';
import Map from './components/Map';
import TourDetails from './components/TourDetails';
import VehicleRental from './components/VehicleRental';
import Navbar from './components/Navbar';
import { generateTourItinerary } from './lib/openai';
import type { UserPreferences, Itinerary } from './types';
import RentalServices from './components/RentalServices';

function TourPlanner() {
  const [itinerary, setItinerary] = useState<Itinerary>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  
  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    setLoading(true);
    setError(undefined);
    
    // Update map center if user provided coordinates
    if (preferences.coordinates) {
      setMapCenter(preferences.coordinates);
    }
    
    try {
      const tourData = await generateTourItinerary(preferences);
      setItinerary(tourData);
      
      // If we have places, center the map on the first location
      if (tourData.places.length > 0) {
        setMapCenter(tourData.places[0].location);
      }
    } catch (err) {
      console.error('Error generating tour:', err);
      setError('Failed to generate tour itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {!itinerary ? (
            <>
              <div className="max-w-2xl mx-auto">
                <PreferencesForm onSubmit={handlePreferencesSubmit} isLoading={loading} />
                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="max-w-3xl mx-auto">
                <TourDetails 
                  itinerary={itinerary}
                  onSaveTour={() => console.log('Saving tour...')}
                  onStartNavigation={() => console.log('Starting navigation...')}
                />
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-[500px]">
                  <Map
                    center={mapCenter}
                    itinerary={itinerary}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <Router>
      {showLanding ? (
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<TourPlanner />} />
              <Route path="/rental-services" element={<RentalServices />} />
              <Route path="/my-tours" element={
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                  <h1 className="text-3xl font-bold text-gray-900">My Tours (Coming Soon)</h1>
                </div>
              } />
            </Routes>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;