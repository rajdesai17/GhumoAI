import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserTours, deleteTour } from '../lib/tourService';
import type { SavedTour } from '../lib/supabase';
import { Trash2, MapPin } from 'lucide-react';

export default function MyTours() {
  const { user } = useAuth();
  const [tours, setTours] = useState<SavedTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadTours();
    }
  }, [user]);

  const loadTours = async () => {
    try {
      setLoading(true);
      const userTours = await getUserTours(user!.id);
      setTours(userTours);
    } catch (err) {
      setError('Failed to load tours');
      console.error('Error loading tours:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTour = async (tourId: string) => {
    try {
      await deleteTour(tourId);
      setTours(tours.filter(tour => tour.id !== tourId));
    } catch (err) {
      console.error('Error deleting tour:', err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your tours</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tours</h1>
      
      {tours.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>You haven't saved any tours yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{tour.title}</h3>
                <button
                  onClick={() => handleDeleteTour(tour.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Destinations:</h4>
                <ul className="space-y-1">
                  {tour.destinations.map((destination, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {destination}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Created on {new Date(tour.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 