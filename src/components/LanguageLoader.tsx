import React, { useState, useEffect, useCallback } from 'react';
import namasteIcon from '../assets/Namaste.svg';

interface LanguageLoaderProps {
  onComplete?: () => void;
}

const greetings = [
  { text: 'नमस्कार', language: 'Marathi' },
  { text: 'नमस्ते', language: 'Hindi' },
  { text: 'નમસ્તે', language: 'Gujarati' },
  { text: 'ನಮಸ್ಕಾರ', language: 'Kannada' },
  { text: 'வணக்கம்', language: 'Tamil' },
  { text: 'నమస్కారం', language: 'Telugu' },
  { text: 'ନମସ୍କାର', language: 'Odia' },
  { text: 'নমস্কার', language: 'Bengali' },
  { text: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ', language: 'Punjabi' },
  { text: 'Welcome', language: 'English' }
];

// Calculate duration per greeting to fit within 3.5 seconds
const TOTAL_DURATION = 3500; // 3.5 seconds
const DURATION_PER_GREETING = TOTAL_DURATION / greetings.length;

function LanguageLoader({ onComplete }: LanguageLoaderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = useCallback(() => {
    setIsComplete(true);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === greetings.length - 1) {
          clearInterval(interval);
          handleComplete();
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, DURATION_PER_GREETING);

    return () => clearInterval(interval);
  }, [handleComplete]);

  return (
    <div className={`fixed inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${isComplete ? 'opacity-0' : 'opacity-100'}`}>
      <div className="animate-pulse mb-8">
        <img 
          src={namasteIcon} 
          alt="Namaste" 
          className="w-24 h-24 md:w-32 md:h-32 text-blue-600 filter hover:drop-shadow-lg transition-all duration-300"
        />
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent animate-fade-in">
          {greetings[currentIndex].text}
        </h1>
        <p className="text-slate-600 text-lg animate-fade-in">
          {greetings[currentIndex].language}
        </p>
      </div>
      <div className="mt-8 flex space-x-2">
        {greetings.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-blue-600 w-4' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default LanguageLoader; 