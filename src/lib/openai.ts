import OpenAI from 'openai';
import type { UserPreferences, Itinerary, Place, FoodSpot, TourPlanWithHotels } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Helper function to calculate distance between two points in km
function calculateDistance(point1: [number, number], point2: [number, number]): number {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to find optimal meal times based on tour duration and start time
function calculateMealTimeSlots(places: RawPlace[]): { time: string, location: [number, number], nearestPlace: string }[] {
  const totalDuration = places.reduce((acc, place) => acc + place.duration, 0);
  const mealSlots = [];
  
  const currentTime = 9; // Assume tour starts at 9 AM
  let currentDuration = 0;
  
  // Calculate lunch time (between 12-2 PM)
  for (let i = 0; i < places.length; i++) {
    currentDuration += places[i].duration;
    const timeAtPlace = currentTime + (currentDuration / 60);
    
    if (timeAtPlace >= 12 && timeAtPlace <= 14) {
      mealSlots.push({
        time: 'lunch',
        location: places[i].location,
        nearestPlace: places[i].name
      });
      break;
    }
  }
  
  // Calculate dinner time (between 6-8 PM) if tour is long enough
  if (totalDuration > 480) { // If tour is longer than 8 hours
    for (let i = places.length - 1; i >= 0; i--) {
      const timeAtPlace = currentTime + (currentDuration / 60);
      if (timeAtPlace >= 18 && timeAtPlace <= 20) {
        mealSlots.push({
          time: 'dinner',
          location: places[i].location,
          nearestPlace: places[i].name
        });
        break;
      }
      currentDuration -= places[i].duration;
    }
  }
  
  return mealSlots;
}

// Types for validation
interface RawPlace {
  id: string;
  name: string;
  description: string;
  location: [number, number];
  duration: number;
  type: string;
}

interface RawItinerary {
  title: string;
  places: RawPlace[];
  totalDuration: number;
  transportTimes: number[];
  transportMode?: string;
}

// Validate the itinerary data structure
function validateItineraryData(data: unknown): data is RawItinerary {
  const d = data as RawItinerary;
  return !!(
    d &&
    Array.isArray(d.places) &&
    d.places.every((place: RawPlace) =>
      place.id &&
      place.name &&
      place.description &&
      Array.isArray(place.location) &&
      place.location.length === 2 &&
      typeof place.duration === 'number' &&
      place.type
    ) &&
    typeof d.title === 'string' &&
    typeof d.totalDuration === 'number' &&
    Array.isArray(d.transportTimes)
  );
}

// Validate food spot data
function validateFoodData(data: unknown): data is FoodSpot[] {
  const d = data as FoodSpot[];
  return Array.isArray(d) && d.every(spot =>
    spot.id &&
    spot.name &&
    Array.isArray(spot.location) &&
    spot.location.length === 2 &&
    ['restaurant', 'cafe', 'street_food', 'food_court'].includes(spot.type) &&
    Array.isArray(spot.cuisineTypes) &&
    ['budget', 'moderate', 'expensive'].includes(spot.priceRange) &&
    typeof spot.rating === 'number' &&
    spot.rating >= 0 && spot.rating <= 5 &&
    typeof spot.reviews === 'number' &&
    spot.openingHours &&
    spot.description &&
    Array.isArray(spot.recommendations)
  );
}

export async function generateTourItinerary(preferences: UserPreferences): Promise<TourPlanWithHotels> {
  try {
    const prompt = `Generate a detailed tour itinerary for ${preferences.location} with the following preferences:
      - Duration: ${preferences.duration} days
      - Transport Mode: ${preferences.transportMode}
      - Interests: ${preferences.interests.join(", ")}
      
      Format the response as a JSON object with:
      - title: A catchy title for the tour
      - places: Array of locations to visit, each with:
        - name: Place name
        - description: Brief description
        - duration: Recommended time in minutes
        - location: [latitude, longitude]
        - type: Type of place (landmark, museum, park, etc.)
        - historicalFacts: Array of interesting historical facts
        - bestTimeToVisit: Best time to visit this place
        - highlights: Array of key highlights
      - transportTimes: Array of estimated travel times between places in minutes
      - hotels: Array of 3 hotel recommendations, each with:
        - name: Hotel name
        - type: "budget", "mid-range", or "luxury"
        - pricePerNight: Price in INR
        - rating: Rating out of 5
        - description: Brief description
        - amenities: Array of available amenities
        - location: Location description
      - duration: Number of days for the tour
      - preferences: Object containing user preferences
      
      Focus on creating a realistic, time-appropriate itinerary that matches the interests.
      For hotels, ensure a mix of budget, mid-range, and luxury options with realistic pricing.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert travel guide with deep knowledge of locations worldwide. Generate detailed, accurate tour itineraries based on user preferences."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate itinerary');
    }

    const data = await response.json();
    const tourData = JSON.parse(data.choices[0].message.content);

    // Add IDs to hotels
    tourData.hotels = tourData.hotels.map((hotel: any, index: number) => ({
      ...hotel,
      id: index + 1
    }));

    return tourData as TourPlanWithHotels;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error('Failed to generate itinerary. Please try again.');
  }
}