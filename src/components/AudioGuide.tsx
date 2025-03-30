import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Info, AlertCircle, Loader2 } from 'lucide-react';
import { textToSpeech, getVoices, stopSpeaking, resumeSpeaking, isPaused } from '../lib/speech';

interface AudioGuideProps {
  briefText: string;
  fullText: string;
  placeName: string;
  historicalFacts?: string[];
  bestTimeToVisit?: string;
  highlights?: string[];
}

const AudioGuide: React.FC<AudioGuideProps> = ({ 
  briefText, 
  fullText, 
  placeName, 
  historicalFacts = [], 
  bestTimeToVisit, 
  highlights = [] 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voiceInitialized, setVoiceInitialized] = useState(false);

  // Create the narrative text with proper formatting
  const narrative = [
    `Welcome to ${placeName}!`,
    fullText,
    historicalFacts.length > 0 
      ? `Did you know? ${historicalFacts.join(' ')}` 
      : '',
    bestTimeToVisit 
      ? `The best time to visit is ${bestTimeToVisit}.` 
      : '',
    highlights.length > 0 
      ? `Key highlights include: ${highlights.join(', ')}.` 
      : ''
  ]
    .filter(Boolean) // Remove empty strings
    .join(' '); // Join with spaces

  // Initialize voice when component mounts
  useEffect(() => {
    let mounted = true;
    const maxRetries = 3;
    let retryCount = 0;

    const loadVoices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const voices = await getVoices();
        if (!mounted) return;

        if (voices.length > 0) {
          // Try to find a good English voice
          const englishVoice = voices.find(voice => 
            voice.lang.startsWith('en-') && 
            (voice.name.includes('Google') || voice.name.includes('Microsoft'))
          ) || voices.find(voice => voice.lang.startsWith('en-')) || voices[0];

          setSelectedVoice(englishVoice);
          setVoiceInitialized(true);
        } else {
          throw new Error('No suitable voices found');
        }
      } catch (error) {
        if (!mounted) return;
        console.error('Error loading voices:', error);
        
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying voice initialization (${retryCount}/${maxRetries})...`);
          setTimeout(loadVoices, 1000); // Retry after 1 second
        } else {
          setError('Failed to initialize text-to-speech. Please try refreshing the page.');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadVoices();
    return () => {
      mounted = false;
      stopSpeaking();
    };
  }, []);

  // Handle play/pause
  const togglePlay = async () => {
    try {
      setError(null);
      
      if (isPlaying) {
        if (isPaused()) {
          resumeSpeaking();
        } else {
          stopSpeaking();
          setIsPlaying(false);
        }
      } else {
        setIsLoading(true);
        await textToSpeech(narrative, {
          voice: selectedVoice || undefined,
          rate: 0.9, // Slightly slower for better clarity
          pitch: 1,
          volume: isMuted ? 0 : 1,
          onStart: () => {
            setIsPlaying(true);
            setIsLoading(false);
          },
          onEnd: () => {
            setIsPlaying(false);
            setIsLoading(false);
          },
          onError: (errorMessage) => {
            console.error('Speech synthesis error:', errorMessage);
            setError('Failed to play audio. Please try again.');
            setIsPlaying(false);
            setIsLoading(false);
          }
        });
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError(error instanceof Error ? error.message : 'Failed to play audio guide');
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isPlaying) {
      stopSpeaking();
      textToSpeech(narrative, {
        voice: selectedVoice || undefined,
        rate: 0.9,
        pitch: 1,
        volume: !isMuted ? 0 : 1,
        onError: (errorMessage) => {
          console.error('Speech synthesis error:', errorMessage);
          setError('Failed to update audio settings. Please try again.');
          setIsPlaying(false);
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          disabled={!voiceInitialized || isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={`Listen to guide for ${placeName}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause Guide</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Play Guide</span>
            </>
          )}
        </button>
        <button
          onClick={toggleMute}
          disabled={!isPlaying}
          className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          title="Show/Hide Details"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      {showDetails && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-sm">
          <div className="space-y-2">
            <p className="text-gray-600">{briefText}</p>
            {historicalFacts.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900">Historical Facts:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {historicalFacts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>
            )}
            {bestTimeToVisit && (
              <div>
                <h4 className="font-medium text-gray-900">Best Time to Visit:</h4>
                <p className="text-gray-600">{bestTimeToVisit}</p>
              </div>
            )}
            {highlights.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900">Key Highlights:</h4>
                <ul className="list-disc list-inside text-gray-600">
                  {highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioGuide; 