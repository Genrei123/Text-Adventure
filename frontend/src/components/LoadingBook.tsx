import React from 'react';

interface LoadingBookProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingBook: React.FC<LoadingBookProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-64 h-64'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${sizes[size]}`}>
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
      <p className="mt-4 text-[#C8A97E] font-cinzel text-xl animate-pulse text-center w-full">
        {message}
      </p>
    </div>
  );
};

export default LoadingBook; 