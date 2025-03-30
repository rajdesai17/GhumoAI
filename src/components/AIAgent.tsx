import React, { useState } from 'react';
import { Send, Bot, Loader2, Calendar, Hotel, MapPin, Clock, User, Mail, Phone } from 'lucide-react';
import { openai } from '../lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
}

interface TourPlan {
  destination: string;
  duration: number;
  preferences: string[];
  itinerary: {
    day: number;
    activities: Array<{
      name: string;
      duration: string;
      description: string;
      bestTime?: string;
      tips?: string[];
    }>;
  }[];
  hotels: Array<{
    id: number;
    name: string;
    type: 'Budget' | 'Mid-Range' | 'Luxury';
    pricePerNight: number;
    rating: number;
    description: string;
    location: string;
    amenities: string[];
  }>;
  tips: string[];
  weather: {
    bestTime: string;
    temperature: string;
    conditions: string;
  };
  transportation: {
    fromAirport: string;
    localTransport: string[];
  };
}

const DESTINATION_DATA: Record<string, TourPlan> = {
  jaipur: {
    destination: 'Jaipur',
    duration: 3,
    preferences: ['cultural', 'sightseeing', 'shopping'],
    itinerary: [
      {
        day: 1,
        activities: [
          { 
            name: 'Hawa Mahal', 
            duration: '1.5 hours', 
            description: 'Visit the iconic Palace of Winds, a five-story palace with 953 windows. Built in 1799, it was designed to allow royal ladies to observe street festivities while unseen from the outside.',
            bestTime: 'Early morning (8:00 AM - 10:00 AM)',
            tips: ['Visit early to avoid crowds', 'Photography from outside is best during sunrise']
          },
          { 
            name: 'City Palace', 
            duration: '2 hours', 
            description: 'Explore the royal residence that combines Rajasthani and Mughal architecture. The palace complex includes the Chandra Mahal, Mubarak Mahal, and various museums.',
            bestTime: 'Morning (10:00 AM - 12:00 PM)',
            tips: ['Book guided tour in advance', 'Visit the museum for historical artifacts']
          },
          { 
            name: 'Lunch at Rawat Misthan Bhandar', 
            duration: '1 hour', 
            description: 'Famous for Pyaz Kachori, Pyaaz ki Sabzi, and other Rajasthani delicacies. Established in 1960, it\'s a local favorite.',
            bestTime: '12:30 PM - 1:30 PM',
            tips: ['Try their signature Pyaz Kachori', 'Visit during non-peak hours']
          },
          { 
            name: 'Amber Fort', 
            duration: '3 hours', 
            description: 'Visit the magnificent hilltop fort-palace complex. Don\'t miss the Sheesh Mahal (Hall of Mirrors) and the Ganesh Pol gate.',
            bestTime: 'Afternoon (2:00 PM - 5:00 PM)',
            tips: ['Take an elephant ride up the fort', 'Stay for the light and sound show in the evening']
          }
        ]
      },
      {
        day: 2,
        activities: [
          { 
            name: 'Jaigarh Fort & Nahargarh Fort', 
            duration: '3 hours', 
            description: 'Visit both forts for panoramic city views. Jaigarh Fort houses the world\'s largest cannon on wheels, and Nahargarh offers stunning sunset views.',
            bestTime: 'Morning (9:00 AM - 12:00 PM)',
            tips: ['Start early to avoid heat', 'Carry water and snacks']
          },
          { 
            name: 'Johari Bazaar', 
            duration: '2 hours', 
            description: 'Explore the famous jewelry market. Known for traditional jewelry, textiles, and handicrafts.',
            bestTime: 'Afternoon (2:00 PM - 4:00 PM)',
            tips: ['Bargain for better prices', 'Visit multiple shops before buying']
          },
          { 
            name: 'Chokhi Dhani', 
            duration: '3 hours', 
            description: 'Experience traditional Rajasthani culture with folk dances, camel rides, and authentic cuisine.',
            bestTime: 'Evening (6:00 PM - 9:00 PM)',
            tips: ['Book in advance', 'Try the traditional thali']
          }
        ]
      },
      {
        day: 3,
        activities: [
          { 
            name: 'Albert Hall Museum', 
            duration: '1.5 hours', 
            description: 'Visit the oldest museum in Rajasthan, showcasing artifacts, paintings, and sculptures.',
            bestTime: 'Morning (10:00 AM - 11:30 AM)',
            tips: ['Photography requires separate ticket', 'Visit during weekdays for fewer crowds']
          },
          { 
            name: 'Jal Mahal', 
            duration: '1 hour', 
            description: 'Visit the water palace situated in the middle of Man Sagar Lake. While you can\'t enter the palace, the view from the banks is spectacular.',
            bestTime: 'Late afternoon (4:00 PM - 5:00 PM)',
            tips: ['Best for photography during sunset', 'Visit during monsoon for full water level']
          }
        ]
      }
    ],
    hotels: [
      {
        id: 1,
        name: 'Hotel Pearl Palace',
        type: 'Budget',
        pricePerNight: 1500,
        rating: 4.2,
        description: 'Heritage-style hotel with rooftop restaurant and pool. Located in the heart of the city, close to major attractions.',
        location: 'Hawa Mahal Road, Bani Park',
        amenities: ['Free WiFi', 'Rooftop Restaurant', 'Swimming Pool', '24/7 Front Desk']
      },
      {
        id: 2,
        name: 'Hotel Clarks Amer',
        type: 'Mid-Range',
        pricePerNight: 3500,
        rating: 4.5,
        description: 'Modern hotel with excellent amenities and central location. Known for its buffet spread and service quality.',
        location: 'Malviya Nagar, Near Jawahar Circle',
        amenities: ['Free WiFi', 'Multiple Restaurants', 'Swimming Pool', 'Fitness Center', 'Spa']
      },
      {
        id: 3,
        name: 'Rambagh Palace',
        type: 'Luxury',
        pricePerNight: 25000,
        rating: 4.8,
        description: 'Former residence of the Maharaja of Jaipur, now a luxury hotel. Experience royal living with world-class service.',
        location: 'Bhawani Singh Road, Rambagh',
        amenities: ['Luxury Spa', 'Fine Dining', 'Swimming Pool', 'Tennis Court', 'Horse Riding', 'Butler Service']
      }
    ],
    tips: [
      'Visit historical sites early morning to avoid crowds and heat',
      'Carry water and wear comfortable shoes for extensive walking',
      'Bargain while shopping in local markets',
      'Book hotels and attractions in advance during peak season',
      'Try local street food but be careful with hygiene',
      'Use Uber or Ola for convenient local transportation',
      'Carry sunscreen and hats for sun protection',
      'Respect local customs and dress modestly'
    ],
    weather: {
      bestTime: 'October to March',
      temperature: '15°C to 30°C',
      conditions: 'Pleasant and dry weather, ideal for sightseeing'
    },
    transportation: {
      fromAirport: 'Jaipur International Airport is 13 km from city center. Take a taxi (30-40 mins) or airport shuttle.',
      localTransport: ['Uber/Ola cabs', 'Auto-rickshaws', 'Cycle rickshaws', 'Local buses']
    }
  },
  // Add more destinations here...
};

const generateTourPlan = (message: string): TourPlan | null => {
  // Extract destination and duration using regex
  const destinationMatch = message.match(/(?:going to|trip to|getaway in|visit|tour of|plan|for)\s+(\w+)/i);
  const durationMatch = message.match(/(\d+)\s*days?/i);
  
  if (!destinationMatch || !durationMatch) return null;

  const destination = destinationMatch[1].toLowerCase();
  const duration = parseInt(durationMatch[1]);

  // Check if we have data for this destination
  if (DESTINATION_DATA[destination]) {
    return {
      ...DESTINATION_DATA[destination],
      duration: Math.min(duration, DESTINATION_DATA[destination].duration)
    };
  }

  return null;
};

const renderHotelCard = (hotel: TourPlan['hotels'][0]) => {
  return (
    <div key={hotel.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{hotel.name}</h3>
          <p className="text-sm text-gray-600">{hotel.type}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">₹{hotel.pricePerNight}/night</p>
          <p className="text-sm">⭐ {hotel.rating}/5</p>
        </div>
      </div>
      <p className="text-sm mt-2">{hotel.description}</p>
      <div className="mt-2">
        <p className="text-sm text-gray-600">📍 {hotel.location}</p>
        <p className="text-sm text-gray-600">��️ {hotel.amenities.join(' • ')}</p>
      </div>
      <button
        onClick={() => handleBookHotel(hotel)}
        className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Book Now
      </button>
    </div>
  );
};

const handleBookHotel = (hotel: TourPlan['hotels'][0]) => {
  setSelectedHotel(hotel);
  setBookingState('collecting_details');
  setMessages(prev => [...prev, {
    text: `Great choice! To book ${hotel.name}, simply type your details in this format:
${hotel.name}
Your Name
your@email.com
1234567890`,
    isUser: false
  }]);
};

const formatTourPlan = (plan: TourPlan): string => {
  let response = `Here's your ${plan.duration}-day travel plan for ${plan.destination}:\n\n`;

  // Add weather information
  response += `🌤️ Weather Information:\n`;
  response += `• Best time to visit: ${plan.weather.bestTime}\n`;
  response += `• Temperature: ${plan.weather.temperature}\n`;
  response += `• Conditions: ${plan.weather.conditions}\n\n`;

  // Add itinerary
  response += `📅 Daily Itinerary:\n`;
  plan.itinerary.forEach(day => {
    response += `\nDay ${day.day}:\n`;
    day.activities.forEach(activity => {
      response += `• ${activity.name} - ${activity.duration}\n`;
      response += `  ${activity.description}\n`;
      if (activity.bestTime) {
        response += `  ⏰ Best time: ${activity.bestTime}\n`;
      }
      if (activity.tips && activity.tips.length > 0) {
        response += `  💡 Tips: ${activity.tips.join(', ')}\n`;
      }
    });
  });

  // Add hotel options
  response += '\n🏨 Available Hotels:\n';
  plan.hotels.forEach(hotel => {
    response += `\n**${hotel.name}**\n`;
    response += `- Price: ₹${hotel.pricePerNight} per night\n`;
    response += `- Rating: ${hotel.rating}/5\n`;
    response += `- Key Amenities:\n`;
    hotel.amenities.slice(0, 3).forEach(amenity => {
      response += `  - ${amenity}\n`;
    });
  });

  response += '\nNote: Prices may vary based on demand and season.\n';
  return response;
};

const AIAgent: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; isHotelList?: boolean; hotels?: TourPlan['hotels'] }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TourPlan | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [bookingState, setBookingState] = useState<'idle' | 'collecting_details' | 'confirming'>('idle');
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    phone: ''
  });
  const [selectedHotel, setSelectedHotel] = useState<TourPlan['hotels'][0] | null>(null);

  const systemPrompt = `You are a concise travel assistant. Follow these rules:
  1. Keep responses brief and to the point
  2. Use bullet points for lists
  3. Include only essential information
  4. Format with minimal emojis
  5. For tour plans:
     - List only top 3-4 activities per day
     - Include exact timings
     - Add 1-2 key tips per activity
  6. For hotels:
     - Show only price, rating, and key amenities
     - Keep descriptions short
  7. For booking confirmations:
     - Show booking reference
     - List check-in/out times
     - Include cancellation policy`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const updatedHistory = [...chatHistory, { role: 'user', content: userMessage }];
      
      if (bookingState === 'collecting_details') {
        // Parse user details from simple text format
        const lines = userMessage.split('\n').map(line => line.trim());
        if (lines.length >= 3) {
          const [name, email, phone] = lines.slice(-3); // Take last 3 lines
          if (name && email && phone) {
            const bookingRef = `BK${Date.now().toString().slice(-6)}`;
            const confirmationMessage = `✅ Booking Confirmed!

Booking Reference: ${bookingRef}
Guest: ${name}
Hotel: ${selectedHotel?.name}
Duration: ${currentPlan?.duration} days
Total: ₹${selectedHotel ? selectedHotel.pricePerNight * (currentPlan?.duration || 0) : 0}

Check-in: 2:00 PM
Check-out: 12:00 PM

A confirmation email has been sent to ${email}
For any changes, quote your booking reference: ${bookingRef}

Would you like to plan another trip?`;
            
            setMessages(prev => [...prev, { text: confirmationMessage, isUser: false }]);
            setBookingState('idle');
            setSelectedHotel(null);
            setUserDetails({ name: '', email: '', phone: '' });
          } else {
            setMessages(prev => [...prev, { 
              text: 'Please provide your details in this format:\nYour Name\nyour@email.com\n1234567890', 
              isUser: false 
            }]);
          }
        } else {
          setMessages(prev => [...prev, { 
            text: 'Please provide your details in this format:\nYour Name\nyour@email.com\n1234567890', 
            isUser: false 
          }]);
        }
      } else {
        // First try to generate plan from local data
        const localPlan = generateTourPlan(userMessage);
        
        if (localPlan) {
          setCurrentPlan(localPlan);
          // Add tour plan and hotel cards
          setMessages(prev => [
            ...prev, 
            { text: formatTourPlan(localPlan), isUser: false },
            { 
              text: 'Select a hotel to proceed with booking:',
              isUser: false,
              isHotelList: true,
              hotels: localPlan.hotels
            }
          ]);
        } else {
          // If no local data, use OpenAI
          const tourResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              { role: 'system', content: systemPrompt },
              ...updatedHistory
            ],
            temperature: 0.7,
            max_tokens: 800
          });

          const response = tourResponse.choices[0].message.content;
          setMessages(prev => [...prev, { text: response || 'Sorry, I could not generate a plan.', isUser: false }]);
        }
      }

      const assistantResponse = messages[messages.length - 1]?.text || '';
      setChatHistory(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

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
            Ask me to plan your trip and suggest hotels! Try:
            "Plan a trip to Jaipur for 3 days"
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
                  {message.isHotelList ? (
                    <div>
                      <p className="font-medium mb-3">{message.text}</p>
                      {currentPlan?.hotels.map(hotel => renderHotelCard(hotel))}
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
                  )}
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
              placeholder={
                bookingState === 'collecting_details' 
                  ? "Type your name, email and phone number (each on a new line)"
                  : "Type your message here..."
              }
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