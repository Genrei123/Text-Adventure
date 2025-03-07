import React from 'react';
import { useNavigate } from "react-router-dom"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import LoadingBook from '../../components/LoadingBook';

interface CarouselProps {
  slides: Array<{
    id: string;
    title: string;
    description: string;
    image_data: string;
  }>;
  isLoading?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({ slides, isLoading }) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-[#1E1E1E]/50 rounded-lg flex items-center justify-center">
        <LoadingBook message="Loading Featured Games..." size="md" />
      </div>
    );
  }

  const carouselSettings = {
    dots: true,
    infinite: false, // Change to false
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false, // Turn off temporarily for testing
    arrows: true, // Add arrows for clarity
    centerMode: false, // Turn this off
    // Remove centerPadding
  }

  const handlePlayGame = (gameId: string) => {
    navigate(`/game-details/${gameId}`)
  }

  // In your Carousel component
return (
  <div className="w-full max-w-8xl mx-auto px-4 md:px-8 my-17 relative">
    <Slider {...carouselSettings}>
      {slides.map((slide, index) => (
        <div key={index} className="px-2 relative">
          <div className="relative h-[250px] sm:h-[350px] rounded-lg overflow-hidden shadow-2xl translate-y-[5%]">
            {/* Dark Overlay for Better Contrast */}
            <div className="absolute inset-0 bg-black/50"></div>
            <img 
              src={`${import.meta.env.VITE_BACKEND_URL}${slide.image_data}` || "/placeholder.svg"} 
              alt={slide.title} 
              className="w-full h-full object-cover" 
            />

            {/* Text Content */}
            <div className="absolute bottom-4 sm:bottom-16 right-4 sm:right-12 w-full sm:max-w-md text-right z-10 text-white drop-shadow-lg px-2 sm:px-0">
              <h3 className="text-2xl sm:text-5xl font-cinzel font-extrabold text-[#F1E3C6] mb-2 sm:mb-4 line-clamp-2">
                {slide.title}
              </h3>
              <p className="text-lg sm:text-2xl font-playfair font-bold text-[#FFFBEA] line-clamp-3">
                {slide.description}
              </p>
              <button 
                onClick={() => handlePlayGame(slide.id)}
                className="mt-2 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-[#C8A97E] hover:bg-[#D8B98E] text-white text-base sm:text-lg font-bold uppercase rounded font-cinzel drop-shadow-lg"
              >
                Play Game
              </button>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  </div>
)
}

export default Carousel

