import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PreferencesForm from './components/PreferencesForm';
import Map from './components/Map';
import TourDetails from './components/TourDetails';
import VehicleRental from './components/RentalServices';
import Navbar from './components/Navbar';
import MyTours from './components/MyTours';
import { generateTourItinerary } from './lib/openai';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import type { UserPreferences, Itinerary } from './types';

function TourPlanner() {
  const [itinerary, setItinerary] = useState<Itinerary>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const { user } = useAuth();
  
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
      <main className="max-w-[90rem] mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
            <div className="flex gap-8">
              {/* Left side: Tour Details */}
              <div className="w-[45%] min-w-[400px]">
                <TourDetails 
                  itinerary={itinerary}
                  onSaveTour={() => console.log('Saving tour...')}
                  onStartNavigation={() => console.log('Starting navigation...')}
                  canSave={!!user}
                />
              </div>
              
              {/* Right side: Map */}
              <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden sticky top-24 h-[calc(100vh-8rem)]">
                <Map
                  center={mapCenter}
                  itinerary={itinerary}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <AuthProvider>
      <Router>
        {showLanding ? (
          <LandingPage onGetStarted={() => setShowLanding(false)} />
        ) : (
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<TourPlanner />} />
                <Route path="/vehicle-rental" element={<VehicleRental />} />
                <Route path="/my-tours" element={<MyTours />} />
              </Routes>
            </div>
          </div>
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;