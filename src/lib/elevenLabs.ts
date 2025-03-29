import axios from 'axios';

const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';

if (!ELEVEN_LABS_API_KEY) {
  console.error('ElevenLabs API key is not set in environment variables');
}

export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  if (!ELEVEN_LABS_API_KEY) {
    throw new Error('ElevenLabs API key is not configured');
  }

  try {
    const response = await axios.post(
      `${ELEVEN_LABS_API_URL}/text-to-speech/amiAXapsDOAiHJqbsAZj`,
      {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.detail || error.message;
      
      if (status === 401) {
        throw new Error('Invalid ElevenLabs API key. Please check your configuration.');
      } else if (status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (status === 400) {
        throw new Error('Invalid request. Please check the text content.');
      } else {
        throw new Error(`ElevenLabs API error: ${message}`);
      }
    }
    throw new Error('Failed to generate speech');
  }
} 