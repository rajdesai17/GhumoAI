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
  historicalFacts?: string[];
  bestTimeToVisit?: string;
  highlights?: string[];
}

export interface FoodSpot {
  id: string;
  name: string;
  description: string;
  location: [number, number];
  type: string;
  cuisineTypes: string[];
  priceRange: 'budget' | 'moderate' | 'expensive';
  rating: number;
  reviews: number;
  openingHours: string;
  distance?: number;
  recommendations: string[];
}

export interface Itinerary {
  title: string;
  places: Place[];
  transportation: string;
  notes: string;
  totalDuration: number; // in minutes
  transportTimes: number[]; // array of travel times between places in minutes
  foodRecommendations?: FoodSpot[];
  tips?: string[];
}