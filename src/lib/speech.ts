// Track current utterance for control
let currentUtterance: SpeechSynthesisUtterance | null = null;

interface TextToSpeechOptions {
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: SpeechSynthesisVoice;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onPause?: () => void;
  onResume?: () => void;
}

// Initialize speech synthesis and wait for voices to load
async function initSpeechSynthesis(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve(false);
      return;
    }

    // If voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      resolve(true);
      return;
    }

    // Wait for voices to load
    const timeoutId = setTimeout(() => {
      console.warn('Voice loading timed out after 5 seconds');
      resolve(false);
    }, 5000);

    window.speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timeoutId);
      resolve(true);
    };
  });
}

// Get available voices with retry mechanism
export async function getVoices(): Promise<SpeechSynthesisVoice[]> {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    const initialized = await initSpeechSynthesis();
    if (!initialized) {
      console.warn(`Failed to initialize speech synthesis, attempt ${retries + 1} of ${maxRetries}`);
      retries++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      continue;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      return voices.filter(voice => voice.lang.startsWith('en')); // Filter for English voices
    }

    retries++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
  }

  throw new Error('Failed to load voices after multiple attempts');
}

// Split text into manageable chunks
function splitTextIntoChunks(text: string): string[] {
  const MAX_CHUNK_LENGTH = 200;
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + ' ' + word).length > MAX_CHUNK_LENGTH) {
      chunks.push(currentChunk.trim());
      currentChunk = word;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + word;
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

// Main text-to-speech function with improved error handling and voice selection
export function textToSpeech(text: string, options: TextToSpeechOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check browser support
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      reject(new Error('Speech synthesis is not supported in this browser'));
      return;
    }

    // Ensure voices are loaded
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) {
      reject(new Error('No text-to-speech voices available. Please try again in a moment.'));
      return;
    }

    // Stop any current speech
    stopSpeaking();

    // Split text into chunks
    const chunks = splitTextIntoChunks(text);
    let currentChunkIndex = 0;

    // Function to speak the next chunk
    const speakNextChunk = () => {
      if (currentChunkIndex >= chunks.length) {
        if (options.onEnd) options.onEnd();
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIndex]);
      currentUtterance = utterance;

      // Apply options
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Set voice with fallback
      if (options.voice) {
        utterance.voice = options.voice;
      } else {
        // Try to find a good English voice
        const englishVoice = voices.find(v => 
          v.lang.startsWith('en-') && 
          (v.name.includes('Google') || v.name.includes('Microsoft'))
        ) || voices.find(v => v.lang.startsWith('en-')) || voices[0];
        
        utterance.voice = englishVoice;
      }

      // Event handlers with error recovery
      utterance.onstart = () => {
        if (currentChunkIndex === 0 && options.onStart) {
          options.onStart();
        }
      };

      utterance.onend = () => {
        currentChunkIndex++;
        // Small delay between chunks for better clarity
        setTimeout(speakNextChunk, 100);
      };

      utterance.onerror = (event) => {
        const errorMessage = event.error || 'Speech synthesis error';
        console.error('Speech synthesis error:', errorMessage);
        
        if (options.onError) {
          options.onError(errorMessage);
        }

        // Try to recover by moving to next chunk
        currentChunkIndex++;
        setTimeout(speakNextChunk, 500);
      };

      // Handle pause/resume events
      if (options.onPause) {
        utterance.onpause = () => options.onPause!();
      }
      if (options.onResume) {
        utterance.onresume = () => options.onResume!();
      }

      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error speaking utterance:', error);
        if (options.onError) {
          options.onError('Failed to start speech synthesis');
        }
        reject(error);
      }
    };

    // Start with the first chunk
    speakNextChunk();
  });
}

export function stopSpeaking(): void {
  window.speechSynthesis?.cancel();
  currentUtterance = null;
}

export function pauseSpeaking(): void {
  window.speechSynthesis?.pause();
}

export function resumeSpeaking(): void {
  window.speechSynthesis?.resume();
}

export function isSpeaking(): boolean {
  return window.speechSynthesis?.speaking || false;
}

export function isPaused(): boolean {
  return window.speechSynthesis?.paused || false;
} 