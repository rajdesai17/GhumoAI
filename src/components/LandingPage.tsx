import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Compass, Clock, Map, Share2 } from 'lucide-react';
import bgImage from '../assets/bg.png';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-white">
        <div className="container mx-auto px-6 py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-left">
              <h1 className="text-5xl font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                Personal City Guide,{' '}
                <span className="text-blue-600">Anytime, Anywhere</span>
              </h1>
              <p className="text-lg mb-8 text-slate-600 leading-relaxed max-w-xl">
                Ghumo is your AI guide, delivering personalized city tours with complete audio insights, perfectly tailored to your schedule and interests.
              </p>
              <Link
                to="/plan-tour"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200"
              >
                Start Exploring
                <Compass className="w-5 h-5 ml-2" />
              </Link>
            </div>
            
            {/* Right Illustration */}
            <div className="relative h-full flex items-center justify-center lg:justify-end">
              <img
                src={bgImage}
                alt="Travel Illustration"
                className="w-full h-auto max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Explore any city in just 5 steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="group p-5 rounded-xl bg-white hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                <Map className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Start point</h3>
              <p className="text-sm text-slate-600">
                Begin by selecting your starting point. It could be a central location like the main train station or your hotel.
              </p>
            </div>

            <div className="group p-5 rounded-xl bg-white hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                <Car className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Transportation</h3>
              <p className="text-sm text-slate-600">
                Choose how you want to explore - leisurely walk, bike ride, or vehicle rental to cover more ground.
              </p>
            </div>

            <div className="group p-5 rounded-xl bg-white hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Duration</h3>
              <p className="text-sm text-slate-600">
                Set your preferred duration, whether it's a few hours or a full day of exploration.
              </p>
            </div>

            <div className="group p-5 rounded-xl bg-white hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center mb-3">
                <Compass className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Type</h3>
              <p className="text-sm text-slate-600">
                Select your interests - historical sites, culture, food, or shopping. We'll customize it for you.
              </p>
            </div>

            <div className="group p-5 rounded-xl bg-white hover:shadow-lg transition-all duration-200">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center mb-3">
                <Share2 className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">Tour generated</h3>
              <p className="text-sm text-slate-600">
                Your personalized tour is ready! Follow the route and enjoy full audio guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            The Ultimate Blend of City Exploration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900 mb-2">Personalized routes</h3>
              <p className="text-sm text-slate-600">
                Get customized itineraries based on your preferences and interests.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900 mb-2">Real-time audio guidance</h3>
              <p className="text-sm text-slate-600">
                Listen to engaging audio guides as you explore each location.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900 mb-2">Hidden gems</h3>
              <p className="text-sm text-slate-600">
                Discover off-the-beaten-path locations and local favorites.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900 mb-2">Historical insights</h3>
              <p className="text-sm text-slate-600">
                Learn fascinating stories and historical facts about each place.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900 mb-2">Route sharing</h3>
              <p className="text-sm text-slate-600">
                Share your favorite routes with friends and family.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900 mb-2">Local expertise</h3>
              <p className="text-sm text-slate-600">
                Access recommendations from locals and travel experts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg mb-8 text-slate-300 max-w-2xl mx-auto">
            Join thousands of travelers who trust Ghumo for their travel needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/plan-tour"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200"
            >
              Plan Your Tour
              <Compass className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/vehicle-rental"
              className="inline-flex items-center px-6 py-3 bg-white text-slate-900 rounded-full font-medium hover:bg-slate-100 transition-all duration-200"
            >
              Rent a Vehicle
              <Car className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;