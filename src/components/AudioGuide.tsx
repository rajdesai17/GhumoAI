import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Info } from 'lucide-react';
import { textToSpeech } from '../lib/elevenLabs';

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Create the narrative text
  const narrative = `Welcome to ${placeName}! ${fullText} ${
    historicalFacts.length > 0 
      ? `\n\nDid you know? ${historicalFacts.join(' ')}` 
      : ''
  } ${
    bestTimeToVisit 
      ? `\n\nThe best time to visit is ${bestTimeToVisit}.` 
      : ''
  } ${
    highlights.length > 0 
      ? `\n\nKey highlights include: ${highlights.join(', ')}.` 
      : ''
  }`;

  // Initialize audio when component mounts or narrative changes
  useEffect(() => {
    let isMounted = true;

    const generateAudio = async () => {
      try {
        setIsLoading(true);
        const audioBuffer = await textToSpeech(narrative);
        
        if (!isMounted) return;

        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const newAudio = new Audio(url);
        
        newAudio.onended = () => {
          setIsPlaying(false);
        };

        newAudio.onerror = (error) => {
          console.error('Audio playback error:', error);
          setIsPlaying(false);
        };

        setAudio(newAudio);
      } catch (error) {
        console.error('Error generating audio:', error);
        setIsPlaying(false);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    generateAudio();

    return () => {
      isMounted = false;
      if (audio) {
        audio.pause();
        URL.revokeObjectURL(audio.src);
      }
    };
  }, [narrative]);

  // Handle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audio) {
      audio.volume = isMuted ? 1 : 0;
    }
  };

  // Handle play/pause
  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={`Listen to guide for ${placeName}`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Generating Audio...</span>
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
          disabled={isLoading}
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