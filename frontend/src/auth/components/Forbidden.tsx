import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../context/LoadingContext';
import LoadingBook from '../../components/LoadingBook';

const Forbidden: React.FC = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { navigateWithLoading } = useLoading();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 bg-[#1E1E1E] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
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
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-cinzel text-[#C8A97E] mb-4">Forbidden Realm</h1>
      <p className="text-[#8B7355] text-2xl font-playfair text-center mb-8">
      You lack the mystical key to enter.
      </p>
      <button
        onClick={() => navigateWithLoading('/home')}
        className="px-6 py-2 bg-[#3D2E22] text-[#C8A97E] rounded hover:bg-[#4D3E32] transition-colors font-cinzel"
      >
        Return to Safety
      </button>
    </div>
  );
};

export default Forbidden;