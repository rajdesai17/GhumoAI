import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Compass, Clock, Map, Share2 } from 'lucide-react';
import bgImage from '../assets/bg.png';

const LandingPage: React.FC = () => {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-left space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Personal City Guide,{' '}
                <span className="text-blue-600">Anytime, Anywhere</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Ghumo is your AI guide, delivering personalized city tours with complete audio insights, perfectly tailored to your schedule and interests.
              </p>
              <div>
                <Link
                  to="/plan-tour"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Start Exploring
                  <Compass className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
            
            {/* Right Illustration */}
            <div className="flex items-center justify-center lg:justify-end">
              <img
                src={bgImage}
                alt="Travel Illustration"
                className="w-full max-w-md lg:max-w-lg object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-slate-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">
            Explore any city in just 5 steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Start point</h3>
              <p className="text-slate-600">
                Begin by selecting your starting point. It could be a central location like the main train station or your hotel.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Transportation</h3>
              <p className="text-slate-600">
                Choose how you want to explore - leisurely walk, bike ride, or vehicle rental to cover more ground.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Duration</h3>
              <p className="text-slate-600">
                Set your preferred duration, whether it's a few hours or a full day of exploration.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Type</h3>
              <p className="text-slate-600">
                Select your interests - historical sites, culture, food, or shopping. We'll customize it for you.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tour generated</h3>
              <p className="text-slate-600">
                Your personalized tour is ready! Follow the route and enjoy full audio guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">
            The Ultimate Blend of City Exploration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Personalized routes",
                description: "Get customized itineraries based on your preferences and interests."
              },
              {
                title: "Real-time audio guidance",
                description: "Listen to engaging audio guides as you explore each location."
              },
              {
                title: "Hidden gems",
                description: "Discover off-the-beaten-path locations and local favorites."
              },
              {
                title: "Historical insights",
                description: "Learn fascinating stories and historical facts about each place."
              },
              {
                title: "Route sharing",
                description: "Share your favorite routes with friends and family."
              },
              {
                title: "Local expertise",
                description: "Access recommendations from locals and travel experts."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-slate-300 mb-6">
              Join thousands of travelers who trust Ghumo for their travel needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/plan-tour"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Plan Your Tour
                <Compass className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/vehicle-rental"
                className="inline-flex items-center px-8 py-4 bg-white text-slate-900 rounded-full font-medium hover:bg-slate-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Rent a Vehicle
                <Car className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;