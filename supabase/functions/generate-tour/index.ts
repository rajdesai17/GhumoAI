import { createClient } from "npm:@supabase/supabase-js@2.39.7";
import { Configuration, OpenAIApi } from "npm:openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface TourRequest {
  location: string;
  duration: string;
  transportMode: string;
  interests: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, duration, transportMode, interests } = await req.json() as TourRequest;

    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get("OPENAI_API_KEY"),
    }));

    const prompt = `Generate a detailed tour itinerary for ${location} with the following preferences:
      - Duration: ${duration}
      - Transport Mode: ${transportMode}
      - Interests: ${interests.join(", ")}
      
      Format the response as a JSON object with:
      - title: A catchy title for the tour
      - places: Array of locations to visit, each with:
        - name: Place name
        - description: Brief description
        - duration: Recommended time in minutes
        - location: [latitude, longitude]
        - type: Type of place (landmark, museum, park, etc.)
      - transportTimes: Array of estimated travel times between places in minutes
      
      Focus on creating a realistic, time-appropriate itinerary that matches the interests.`;

    const completion = await openai.createChatCompletion({
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
    });

    const response = completion.data.choices[0].message?.content;
    const tourData = JSON.parse(response || "{}");

    // Calculate the route coordinates from the places
    const route = tourData.places.map((place: any) => place.location);
    
    return new Response(
      JSON.stringify({
        ...tourData,
        route,
        transportMode,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate tour itinerary" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});