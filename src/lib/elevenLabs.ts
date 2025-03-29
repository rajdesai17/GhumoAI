import axios from 'axios';

const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';

// Default voice IDs - you can find more at https://api.elevenlabs.io/v1/voices
const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
const MALE_VOICE_ID = 'MF4J4IDTRo0AxOO4dpFR'; // Josh voice

interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  labels: Record<string, string>;
}

interface TextToSpeechOptions {
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: SpeechSynthesisVoice;
}

function validateApiKey() {
  if (!ELEVEN_LABS_API_KEY) {
    console.error('ElevenLabs API key is missing. Please set VITE_ELEVEN_LABS_API_KEY in your .env file.');
    throw new Error('ElevenLabs API key is not configured. Please set VITE_ELEVEN_LABS_API_KEY in your environment variables.');
  }

  if (!ELEVEN_LABS_API_KEY.startsWith('sk_')) {
    console.error('Invalid ElevenLabs API key format. API key should start with "sk_"');
    throw new Error('Invalid ElevenLabs API key format. Please check your configuration.');
  }
}

export function textToSpeech(text: string, options: TextToSpeechOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis is not supported in this browser'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    // Set voice if provided
    if (options.voice) {
      utterance.voice = options.voice;
    }

    // Handle events
    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    // Start speaking
    window.speechSynthesis.speak(utterance);
  });
}

export function getVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      resolve(voices);
    } else {
      // If voices aren't loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
}

export function stopSpeaking(): void {
  window.speechSynthesis.cancel();
}

export function pauseSpeaking(): void {
  window.speechSynthesis.pause();
}

export function resumeSpeaking(): void {
  window.speechSynthesis.resume();
}

export function isSpeaking(): boolean {
  return window.speechSynthesis.speaking;
}

export function isPaused(): boolean {
  return window.speechSynthesis.paused;
}

function handleElevenLabsError(error: any): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.detail || error.message;
    
    switch (status) {
      case 401:
        console.error('ElevenLabs API key validation failed:', message);
        throw new Error('Invalid ElevenLabs API key. Please check your configuration and make sure the key is valid.');
      case 429:
        throw new Error('Rate limit exceeded. Please try again later.');
      case 400:
        throw new Error(`Invalid request: ${message}. Please check the text content and voice ID.`);
      case 422:
        throw new Error(`Invalid input: ${message}. Please check the text content.`);
      case 404:
        throw new Error(`Voice not found. Please check the voice ID.`);
      default:
        throw new Error(`ElevenLabs API error: ${message}`);
    }
  }
  throw error;
}

export function createAudioElement(audioData: ArrayBuffer): HTMLAudioElement {
  const blob = new Blob([audioData], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  
  // Clean up the URL when the audio is loaded
  audio.onload = () => URL.revokeObjectURL(url);
  
  return audio;
} 