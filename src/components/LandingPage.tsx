import React from 'react';
import { Navigation } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Navigation className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">GhumoAI</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Explore</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Tours</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Map</a>
              <button
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Discover Your Perfect Journey with AI
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Experience personalized travel itineraries crafted by AI. Enter your preferences,
              and let us plan the perfect tour for you.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Planning Your Tour
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 mb-4">
                <Navigation className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Navigation</h3>
              <p className="text-gray-600">
                Get optimized routes based on your transportation preferences and available time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 mb-4">
                <Navigation className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Tours</h3>
              <p className="text-gray-600">
                Discover tours tailored to your interests, from history to food to culture.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-blue-600 mb-4">
                <Navigation className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Insights</h3>
              <p className="text-gray-600">
                Get AI-powered recommendations for the best local experiences and hidden gems.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}