import React, { useState } from 'react';
import { Send, Bot, Loader2, Calendar, Hotel, MapPin, Clock } from 'lucide-react';

interface TourPlan {
  destination: string;
  duration: number;
  preferences: string[];
  itinerary: {
    day: number;
    activities: Array<{
      name: string;
      duration: string;
      description?: string;
    }>;
  }[];
  hotels: Array<{
    id: number;
    name: string;
    type: 'Budget' | 'Mid-Range' | 'Luxury';
    pricePerNight: number;
    rating: number;
    description: string;
  }>;
}

const generateTourPlan = (message: string): TourPlan | null => {
  // Extract destination and duration using regex
  const destinationMatch = message.match(/(?:going to|trip to|getaway in)\s+(\w+)/i);
  const durationMatch = message.match(/(\d+)\s*days?/i);
  
  if (!destinationMatch || !durationMatch) return null;

  const destination = destinationMatch[1];
  const duration = parseInt(durationMatch[1]);

  // Example tour plan for Jaipur (you can extend this for other cities)
  if (destination.toLowerCase() === 'jaipur') {
    return {
      destination: 'Jaipur',
      duration: duration,
      preferences: ['cultural', 'sightseeing'],
      itinerary: [
        {
          day: 1,
          activities: [
            { name: 'Hawa Mahal', duration: '1 hour', description: 'Visit the iconic Palace of Winds' },
            { name: 'City Palace', duration: '2 hours', description: 'Explore the royal residence' },
            { name: 'Lunch at Rawat Misthan Bhandar', duration: '1 hour', description: 'Famous for Pyaz Kachori' },
            { name: 'Amber Fort', duration: '3 hours', description: 'Sunset view recommended' },
            { name: 'Dinner at 1135 AD', duration: '2 hours', description: 'Royal dining experience' }
          ]
        },
        {
          day: 2,
          activities: [
            { name: 'Jaigarh Fort & Nahargarh Fort', duration: '3 hours', description: 'Panoramic city views' },
            { name: 'Johari Bazaar', duration: '2 hours', description: 'Local market exploration' },
            { name: 'Chokhi Dhani', duration: '3 hours', description: 'Cultural experience' }
          ]
        },
        {
          day: 3,
          activities: [
            { name: 'Albert Hall Museum', duration: '1.5 hours', description: 'Historical artifacts' },
            { name: 'Breakfast at Tapri Central', duration: '1 hour', description: 'Popular local cafe' },
            { name: 'Jal Mahal', duration: '1 hour', description: 'Scenic water palace' }
          ]
        }
      ],
      hotels: [
        {
          id: 1,
          name: 'Hotel Rosewood',
          type: 'Budget',
          pricePerNight: 1500,
          rating: 4.2,
          description: 'Comfortable stay with basic amenities in the heart of the city'
        },
        {
          id: 2,
          name: 'Hotel BlueMoon',
          type: 'Mid-Range',
          pricePerNight: 3500,
          rating: 4.5,
          description: 'Modern amenities with rooftop restaurant and pool'
        },
        {
          id: 3,
          name: 'The Royal Haveli',
          type: 'Luxury',
          pricePerNight: 8000,
          rating: 4.8,
          description: 'Heritage property with royal decor and premium services'
        }
      ]
    };
  }

  return null;
};

const formatTourPlan = (plan: TourPlan): string => {
  let response = `Here's your ${plan.duration}-day travel plan for ${plan.destination}:\n\n`;

  // Add itinerary
  plan.itinerary.forEach(day => {
    response += `📅 Day ${day.day}:\n`;
    day.activities.forEach(activity => {
      response += `• ${activity.name} - ${activity.duration}\n`;
      if (activity.description) {
        response += `  ${activity.description}\n`;
      }
    });
    response += '\n';
  });

  // Add hotel options
  response += '🏨 Hotel Options:\n';
  plan.hotels.forEach(hotel => {
    response += `${hotel.type === 'Budget' ? '💰' : hotel.type === 'Mid-Range' ? '💎' : '👑'} ${hotel.name}\n`;
    response += `   ₹${hotel.pricePerNight}/night | ⭐ ${hotel.rating}\n`;
    response += `   ${hotel.description}\n\n`;
  });

  response += '\nSelect a hotel by replying with its name or type (e.g., "Book Hotel BlueMoon" or "Book the mid-range option")';
  return response;
};

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TourPlan | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      // Check if it's a hotel booking request
      if (currentPlan && userMessage.toLowerCase().includes('book')) {
        const response = "Great! I've noted your hotel selection. You can modify your choice anytime. Would you like me to help you with anything else?";
        setMessages(prev => [...prev, { text: response, isUser: false }]);
      } else {
        // Generate new tour plan
        const plan = generateTourPlan(userMessage);
        if (plan) {
          setCurrentPlan(plan);
          const response = formatTourPlan(plan);
          setMessages(prev => [...prev, { text: response, isUser: false }]);
        } else {
          setMessages(prev => [...prev, { 
            text: "I couldn't understand your travel request. Please specify the destination and duration clearly (e.g., 'Plan a trip to Jaipur for 3 days')", 
            isUser: false 
          }]);
        }
      }
    } catch (error) {
      console.error('Error processing request:', error);
      setMessages(prev => [...prev, { 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <h1 className="text-xl font-semibold">AI Travel Assistant</h1>
          </div>
          <p className="text-blue-100 mt-2">
            Ask me to plan your trip and suggest hotels! Try something like:
            "I am going to Jaipur for 3 days, plan my tour and suggest hotels"
          </p>
        </div>

        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">Hello! How can I help you today?</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Plan multi-day itineraries</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
                  <Hotel className="w-4 h-4" />
                  <span>Get hotel recommendations</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Discover local attractions</span>
                </div>
                <div className="flex items-center gap-2 justify-center text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Optimize your schedule</span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your travel plans here..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAgent; 