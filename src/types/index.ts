export interface UserPreferences {
  location: string;
  coordinates?: [number, number];
  interests: string[];
  duration: number; // in hours
  transportMode: 'walking' | 'driving' | 'transit' | 'bicycling';
  budget: 'low' | 'medium' | 'high';
  pace: 'relaxed' | 'moderate' | 'intense';
  additionalNotes?: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  location: [number, number];
  duration: number; // in minutes
  type: string;
}

export interface FoodSpot {
  id: string;
  name: string;
  location: [number, number];
  type: 'restaurant' | 'cafe' | 'street_food' | 'food_court';
  cuisineTypes: string[];
  priceRange: 'budget' | 'moderate' | 'expensive';
  rating: number;
  reviews: number;
  openingHours: string;
  description: string;
  recommendations: string[];
  distance?: number; // Distance from nearest tour spot
}

export interface Itinerary {
  title: string;
  places: Place[];
  transportation: string;
  notes: string;
  totalDuration: number; // in minutes
  transportTimes: number[]; // array of travel times between places in minutes
  foodRecommendations: FoodSpot[];
}