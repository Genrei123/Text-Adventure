import React, { useState, useEffect } from 'react';

const loadingPhrases = [
  "Rolling for initiative...",
  "Summoning ancient scrolls...",
  "Gathering mystical energies...",
  "Consulting the elder sages...",
  "Brewing potions of loading...",
  "Channeling arcane powers...",
  "Decoding ancient runes...",
  "Awakening sleeping dragons...",
  "Forging legendary connections...",
  "Casting loading spells...",
  "Towards another timeline!",
  "Thou shall not avert thine eyes...",
  "ARgggggggh...",
];

interface LoadingScreenProps {
  fadeIn: boolean;
  fadeOut: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fadeIn, fadeOut }) => {
  const [phrase, setPhrase] = useState('');

  useEffect(() => {
    const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
    setPhrase(randomPhrase);
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#1E1E1E] flex items-center justify-center
        transition-all duration-500 ease-in-out
        ${fadeIn ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${fadeOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
    >
      <div className={`flex flex-col items-center justify-center transform transition-all duration-500 delay-200
        ${fadeIn || fadeOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
      >
        <div className="w-64 h-64 relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain"
          >
            <source src="/loading-book.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="mt-4 text-[#C8A97E] font-cinzel text-xl animate-pulse text-center">
          {phrase}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 