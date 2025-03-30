import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';

const Premium: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const getPrice = (basePrice: number) => {
    return billingCycle === 'yearly' ? basePrice * 0.8 : basePrice; // 20% discount for yearly
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Travel Experience
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Unlock premium features to customize your perfect journey with personalized tours and exclusive benefits.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-full shadow-sm border border-gray-200">
            <div className="flex items-center">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <p className="text-gray-600">Perfect for getting started</p>
            </div>

            <div className="mb-8">
              <div className="text-4xl font-bold text-gray-900">$0</div>
              <div className="text-gray-600">Forever free</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Generate basic tour itineraries</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Book available tours</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Access to refill stations</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-green-500" />
                <span>Basic AI travel assistance</span>
              </div>
            </div>

            <button className="w-full py-3 px-6 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <div className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4" />
                Popular
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium</h2>
              <p className="text-gray-600">Personalized travel experience</p>
            </div>

            <div className="mb-8">
              <div className="text-4xl font-bold text-gray-900">
                ${getPrice(29)}
                <span className="text-lg font-normal text-gray-600">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="text-gray-600">Billed annually</div>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Everything in Free, plus:</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Custom tour generation</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Preferred location selection</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Budget customization</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Priority AI assistance</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Exclusive travel deals</span>
              </div>
            </div>

            <button className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium; 