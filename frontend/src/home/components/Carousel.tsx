import type React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface CarouselProps {
  slides: {
    image: string
    title: string
    description: string
  }[]
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    centerMode: true,
    centerPadding: "0px",
    className: "center",
    appendDots: (dots: React.ReactNode) => (
    <div className="absolute bottom-1 left-0 right-0">
      <ul className="flex justify-center items-center space-x-2">{dots}</ul>
    </div>
    ),
    customPaging: (i: number) => (
      <div className="w-3 h-3 rounded-full transition-all duration-300 bg-gray-400 hover:bg-gray-600" />
    ),
  }

  return (
    <div className="w-full max-w-8xl mx-auto px-4 md:px-8 my-17 relative">
      <Slider {...carouselSettings}>
        {slides.map((slide, index) => (
          <div key={index} className="px-2 relative">
            <div className="relative h-[600px] rounded-lg overflow-hidden shadow-2xl">
              {/* Dark Overlay for Better Contrast */}
              <div className="absolute inset-0 bg-black/50"></div>
              <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />

              {/* Text Content */}
              <div className="absolute bottom-16 right-12 max-w-md text-right z-10 text-white drop-shadow-lg">
                <h3 className="text-5xl font-cinzel font-extrabold text-[#F1E3C6] mb-4">{slide.title}</h3>
                <p className="text-2xl font-playfair font-bold text-[#FFFBEA]">{slide.description}</p>
                <button className="mt-4 px-6 py-3 bg-[#C8A97E] hover:bg-[#D8B98E] text-white text-lg font-bold uppercase rounded font-cinzel drop-shadow-lg">
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

