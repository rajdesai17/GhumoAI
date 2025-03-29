export interface UserPreferences {
  location: string;
  duration: number;
  interests: string[];
  pace: 'relaxed' | 'moderate' | 'intense';
  additionalNotes?: string;
  coordinates?: [number, number]; // latitude, longitude
}

export interface Place {
  id: string;
  name: string;
  description: string;
  location: [number, number]; // [latitude, longitude]
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
  totalDuration: number;
  transportMode: string;
  route: [number, number][]; // Array of [latitude, longitude] coordinates
  transportTimes: number[]; // Array of times between places in minutes
  foodRecommendations: FoodSpot[];
}