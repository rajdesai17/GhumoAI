import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreferencesForm from './components/PreferencesForm';
import TourDetails from './components/TourDetails';
import Map from './components/Map';
import Navbar from './components/Navbar';
import MyTours from './components/MyTours';
import RentalServices from './components/RentalServices';
import { Itinerary, UserPreferences } from './types';
import { AuthProvider } from './contexts/AuthContext';
import { generateTourItinerary } from './lib/openai';

function TourPlanner() {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
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
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
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
        <div className="max-w-[90rem] mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Left side: Tour Details */}
            <div className="w-[45%] min-w-[400px]">
              <TourDetails
                itinerary={itinerary}
                currentLocation={currentLocation}
                activePlaceIndex={activePlaceIndex}
                onStartNavigation={handleStartNavigation}
                onSaveTour={handleSaveTour}
                canSave={true}
              />
            </div>
            
            {/* Right side: Map */}
            <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden sticky top-24 h-[calc(100vh-8rem)]">
              <Map
                center={mapCenter}
                itinerary={itinerary}
                currentLocation={currentLocation}
                activePlaceIndex={activePlaceIndex}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<TourPlanner />} />
              <Route path="/my-tours" element={<MyTours />} />
              <Route path="/vehicle-rental" element={<RentalServices />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;