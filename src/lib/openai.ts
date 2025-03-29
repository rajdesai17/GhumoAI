import OpenAI from 'openai';
import type { UserPreferences, Itinerary } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateTourItinerary(preferences: UserPreferences): Promise<Itinerary> {
  const prompt = `Generate a detailed tour itinerary for ${preferences.location} with the following preferences:
    - Duration: ${preferences.duration}
    - Transport Mode: ${preferences.transportMode}
    - Interests: ${preferences.interests.join(", ")}
    
    Format the response as a JSON object with:
    - title: A catchy title for the tour
    - places: Array of locations to visit, each with:
      - id: A unique string identifier
      - name: Place name
      - description: Brief description
      - duration: Recommended time in minutes (number)
      - location: [latitude, longitude]
      - type: Type of place (landmark, museum, park, etc.)
    - transportTimes: Array of numbers representing estimated travel times between places in minutes
    - totalDuration: Total duration of the tour in minutes (number)
    
    Focus on creating a realistic, time-appropriate itinerary that matches the interests.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert travel guide with deep knowledge of locations worldwide. Generate detailed, accurate tour itineraries based on user preferences. Always return transport times as simple numbers in minutes."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const response = completion.choices[0].message.content;
  const tourData = JSON.parse(response || "{}");

  // Validate and ensure transport times are numbers
  if (tourData.transportTimes) {
    tourData.transportTimes = tourData.transportTimes.map((time: any) => {
      if (typeof time === 'object' && time !== null) {
        // If it's an object, try to extract the time value
        return typeof time.time === 'number' ? time.time : 0;
      }
      return typeof time === 'number' ? time : 0;
    });
  }

  // Calculate the route coordinates from the places
  const route = tourData.places.map((place: any) => place.location);
  
  return {
    ...tourData,
    route,
    transportMode: preferences.transportMode,
  };
}