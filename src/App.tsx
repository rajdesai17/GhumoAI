import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreferencesForm from './components/PreferencesForm';
import TourDetails from './components/TourDetails';
import Map from './components/Map';
import Navbar from './components/Navbar';
import MyTours from './components/MyTours';
import RentalServices from './components/RentalServices';
import LandingPage from './components/LandingPage';
import RefillStations from './components/RefillStations';
import AIAgent from './components/AIAgent';
import Premium from './components/Premium';
import { TourPlanWithHotels, UserPreferences } from './types';
import { AuthProvider } from './contexts/AuthContext';
import { generateTourItinerary } from './lib/openai';
import LanguageLoader from './components/LanguageLoader';

function TourPlanner() {
  const [itinerary, setItinerary] = useState<TourPlanWithHotels | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | undefined>(undefined);
  const [activePlaceIndex, setActivePlaceIndex] = useState<number | undefined>(undefined);

  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateTourItinerary(preferences);
      setItinerary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNavigation = async (placeIndex: number) => {
    try {
      setActivePlaceIndex(placeIndex);
      
      // Get current location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const location: [number, number] = [
        position.coords.latitude,
        position.coords.longitude,
      ];
      setCurrentLocation(location);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    }
  };

  const handleLocationSelect = (location: [number, number]) => {
    if (itinerary) {
      const index = itinerary.places.findIndex(
        place => place.location[0] === location[0] && place.location[1] === location[1]
      );
      if (index !== -1) {
        setActivePlaceIndex(index);
      }
    }
  };

  const handleSaveTour = async () => {
    if (!itinerary) return;
    try {
      const response = await fetch('/api/save-tour', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itinerary),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tour');
    }
  };

  if (loading) {
    return <LanguageLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const mapCenter = currentLocation || (itinerary?.places[0]?.location || [0, 0]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {!itinerary ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-4">Plan Your Tour</h1>
            <p className="text-gray-600 text-center mb-8">
              Tell us about your preferences and we'll create a personalized tour itinerary for you.
            </p>
            <PreferencesForm onSubmit={handlePreferencesSubmit} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left side: Map */}
            <div className="lg:w-[40%] flex-shrink-0">
              <div className="sticky top-24 bg-white rounded-lg shadow-lg overflow-hidden aspect-square">
                <Map
                  center={mapCenter}
                  itinerary={itinerary}
                  currentLocation={currentLocation}
                  activePlaceIndex={activePlaceIndex}
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            </div>

            {/* Right side: Tour Details */}
            <div className="lg:w-[60%] flex-shrink-0">
              <TourDetails
                itinerary={itinerary}
                currentLocation={currentLocation}
                activePlaceIndex={activePlaceIndex}
                onStartNavigation={handleStartNavigation}
                onSaveTour={handleSaveTour}
                canSave={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Show loader for 3 seconds
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="bg-gray-50">
          {initialLoading ? (
            <LanguageLoader duration={1000} />
          ) : (
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/plan-tour" element={<TourPlanner />} />
                <Route path="/my-tours" element={<MyTours />} />
                <Route path="/vehicle-rental" element={<RentalServices />} />
                <Route path="/refill-stations" element={<RefillStations />} />
                <Route path="/ai-agent" element={<AIAgent />} />
                <Route path="/premium" element={<Premium />} />
              </Routes>
            </>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;