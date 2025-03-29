export interface UserPreferences {
  location: string;
  duration: string;
  transportMode: 'walking' | 'biking' | 'car' | 'public';
  interests: string[];
}

export interface Place {
  id: string;
  name: string;
  description: string;
  location: [number, number]; // [latitude, longitude]
  duration: number; // in minutes
  type: string;
}

export interface Itinerary {
  title: string;
  places: Place[];
  totalDuration: number;
  transportMode: string;
  route: [number, number][]; // Array of [latitude, longitude] coordinates
  transportTimes: number[]; // Array of times between places in minutes
}