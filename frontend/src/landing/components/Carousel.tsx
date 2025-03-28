import React, { useState, useEffect } from "react";

const images = [
  "src/assets/posa.jpg",
  "src/assets/Placeholder.png",
  "src/assets/view.png",
];

export const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-scroll every 3 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentIndex]); // Runs when currentIndex updates

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gray-900">
      <button
        onClick={prevSlide}
        className="absolute left-5 text-white bg-gray-700 p-4 rounded-full hover:bg-gray-600"
      >
        ❮
      </button>

      <div className="w-full h-[80%] flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-contain transition-opacity duration-700 ease-in-out"
        />
      </div>

      <button
        onClick={nextSlide}
        className="absolute right-5 text-white bg-gray-700 p-4 rounded-full hover:bg-gray-600"
      >
        ❯
      </button>
    </div>
  );
};
