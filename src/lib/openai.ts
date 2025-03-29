import OpenAI from 'openai';
import type { UserPreferences, Itinerary, Place, FoodSpot } from '../types';

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

export async function generateTourItinerary(preferences: UserPreferences): Promise<Itinerary> {
  try {
    // First, generate the main itinerary with more specific instructions
    const prompt = `Create a detailed tour itinerary for ${preferences.location} based on these preferences:
- Duration: ${preferences.duration} hours
- Interests: ${preferences.interests.join(', ')}
- Pace: ${preferences.pace}
${preferences.additionalNotes ? `Additional notes: ${preferences.additionalNotes}` : ''}

Please provide a JSON response with the following structure:
{
  "title": "Descriptive tour title",
  "places": [{
    "id": "unique_string",
    "name": "Place name",
    "description": "Detailed description",
    "location": [latitude, longitude],
    "duration": minutes_as_number,
    "type": "attraction_type"
  }],
  "totalDuration": total_minutes_as_number,
  "transportTimes": [minutes_between_stops_as_numbers],
  "transportMode": "walking"
}

Ensure all coordinates are accurate and verified for ${preferences.location}.
Duration should be realistic for each location.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ 
        role: "system", 
        content: "You are a knowledgeable tour guide with accurate information about locations worldwide. Always verify coordinates and provide realistic durations."
      },
      { role: "user", content: prompt }],
      temperature: 0.7,
    });

    const itineraryData = JSON.parse(completion.choices[0].message.content || '{}');
    
    if (!validateItineraryData(itineraryData)) {
      throw new Error('Invalid itinerary data structure received from API');
    }

    // Calculate the route from places
    const route = itineraryData.places.map((place: Place) => place.location);
    
    // Calculate optimal meal time slots based on the tour schedule
    const mealTimeSlots = calculateMealTimeSlots(itineraryData.places);
    
    // Generate food recommendations for each meal slot
    const foodPromises = mealTimeSlots.map(async slot => {
      const nearbyPrompt = `Suggest 1-2 highly-rated food spots near ${slot.nearestPlace} in ${preferences.location} for ${slot.time}. The food spot should be within 500 meters of coordinates [${slot.location.join(', ')}]. Consider:
- Must be open during ${slot.time} hours
- Should be easily accessible from the tour route
- Verified cuisine types and specialties
- Recent reviews and ratings
- Exact coordinates

Please provide a JSON array response where each food spot has:
{
  "id": "unique_string",
  "name": "Verified restaurant name",
  "location": [exact_latitude, exact_longitude],
  "type": "restaurant|cafe|street_food|food_court",
  "cuisineTypes": ["cuisine1", "cuisine2"],
  "priceRange": "budget|moderate|expensive",
  "rating": number_0_to_5,
  "reviews": number_of_reviews,
  "openingHours": "verified_hours",
  "description": "detailed_description",
  "recommendations": ["dish1", "dish2"],
  "distance": distance_in_km_from_nearest_stop
}

Ensure all information is current and verified.`;

      const foodCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ 
          role: "system", 
          content: "You are a local food expert with up-to-date knowledge of restaurants and eateries. Provide only verified information with accurate coordinates and current operating hours."
        },
        { role: "user", content: nearbyPrompt }],
        temperature: 0.7,
      });

      return JSON.parse(foodCompletion.choices[0].message.content || '[]');
    });

    const foodSpotsArrays = await Promise.all(foodPromises);
    const foodData = foodSpotsArrays.flat();
    
    if (!validateFoodData(foodData)) {
      throw new Error('Invalid food recommendation data structure received from API');
    }

    // Filter food spots to ensure they're actually along the route
    const filteredFoodSpots = foodData.filter(spot => {
      // Find minimum distance to any point on the route
      const minDistance = Math.min(...route.map(point => 
        calculateDistance(point, spot.location)
      ));
      return minDistance <= 0.5; // Within 500 meters of the route
    });

    // Combine the itinerary with food recommendations and route
    return {
      ...itineraryData,
      route,
      transportMode: itineraryData.transportMode || 'walking',
      foodRecommendations: filteredFoodSpots,
    };

  } catch (error) {
    console.error('Error generating itinerary:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse API response. Please try again.');
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate itinerary. Please try again.');
  }
}