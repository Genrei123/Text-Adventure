import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LoadingBook from '../../components/LoadingBook';

interface CarouselProps {
  isLoading?: boolean;
  slides: {
    id: string;
    title: string;
    description: string;
    image_data: string;
  }[];
}

const Carousel: React.FC<CarouselProps> = ({ isLoading, slides }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (isLoading) {
    return (
      <div className="w-full h-[400px] bg-[#1E1E1E]/50 rounded-lg flex items-center justify-center">
        <LoadingBook message="Loading Featured Games..." size="md" />
      </div>
    );
  }

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    centerMode: false,
    beforeChange: (oldIndex: number, newIndex: number) => setCurrentSlide(newIndex),
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-2 sm:bottom-4 w-full">
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-2 h-2 bg-[#C8A97E]/50 rounded-full hover:bg-[#C8A97E] transition-all duration-300" />
    ),
  };

  const handlePlayGame = (gameId: string) => {
    navigate(`/game-details/${gameId}`);
  };

  return (
    <div className="w-[90%] max-w-8xl mx-auto px-4 md:px-8 my-17 relative">
      {/* Custom styles for next/prev buttons and mobile width */}
      <style>{`
        .slick-prev,
        .slick-next {
          height: 5rem;
          width: 3rem;
          background-color: #C9B57B;
          border-radius: 1rem;
          z-index: 20;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .slick-prev:hover,
        .slick-next:hover {
          background-color: #B28F4C;
        }
        .slick-prev {
          left: 1rem;
        }
        .slick-next {
          right: 1rem;
        }
        .slick-prev::before,
        .slick-next::before {
          content: '';
        }
        .slick-prev::after,
        .slick-next::after {
          color: white;
          font-size: 2rem;
          font-weight: bold;
        }
        .slick-prev::after {
          content: '←';
        }
        .slick-next::after {
          content: '→';
        }
        @media (max-width: 640px) {
          .slick-prev,
          .slick-next {
            display: none !important;
          }
          .carousel-container {
            width: 115% !important;
            margin-left: -7.5%;
          }
        }
      `}</style>

      <div className="carousel-container">
        <Slider {...carouselSettings}>
          {slides.map((slide, index) => (
            <div key={index} className="px-2 relative">
              <div
                className={`relative h-[444px] sm:h-[702px] rounded-lg overflow-hidden shadow-2xl translate-y-[5%] transition-opacity duration-300 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: index === currentSlide ? '150ms' : '0ms' }}
              >
                {/* Main Image (Visible) */}
                <img
                  src={slide.image_data}
                  alt={slide.title}
                  className="relative w-full h-full object-cover z-10 brightness-75 opacity-50"
                />

                {/* Radial Dark Overlay Behind Text */}
                <div className="absolute inset-0 z-30 pointer-events-none">
                  <div
                    className="absolute bottom-[-10rem] right-[-10rem] w-[80rem] h-[80rem]"
                    style={{
                      background: 'radial-gradient(circle at bottom right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.0) 70%)',
                      borderRadius: '50%',
                    }}
                  />
                </div>

                {/* Text Content */}
                <div
                  className={`absolute bottom-10 sm:bottom-16 right-4 sm:right-12 w-full sm:max-w-md text-right z-40 text-white drop-shadow-lg px-2 sm:px-0 transition-transform duration-700 ease-in-out ${
                    index === currentSlide ? 'translate-x-0' : '-translate-x-10'
                  }`}
                >
                  <h3 className="text-2xl sm:text-5xl font-cinzel font-extrabold text-[#F1E3C6] mb-2 sm:mb-4 line-clamp-2">
                    {slide.title}
                  </h3>
                  <p className="text-lg sm:text-2xl font-playfair font-bold text-[#FFFBEA] line-clamp-3">
                    {slide.description}
                  </p>

                  <button
                    onClick={() => handlePlayGame(slide.id)}
                    className="mt-4 px-6 py-3 border border-[#C8A97E] text-[#C8A97E] bg-transparent hover:bg-[#C8A97E] hover:text-[#1E1E1E] text-sm md:text-lg font-bold uppercase rounded font-cinzel drop-shadow-lg transition-all duration-300"
                  >
                    Play Game
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;