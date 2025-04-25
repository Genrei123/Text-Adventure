import React, { useState, useEffect } from "react";

interface NihGameCardProps {
  userId?: string;
}

const NihGameCard: React.FC<NihGameCardProps> = ({ userId: propUserId }) => {
  const [userId, setUserId] = useState<string | null>(propUserId || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = () => {
      try {
        const userData = localStorage.getItem("userData");
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.id) {
            setUserId(parsedData.id);
          }
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!propUserId) {
      fetchUserId();
    } else {
      setIsLoading(false);
    }
  }, [propUserId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-8xl mx-auto px-4 md:px-8 my-17 relative">
        <div className="flex justify-center items-center h-[400px]">
          <p className="text-white">Loading adventure...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="w-full max-w-8xl mx-auto px-4 md:px-8 my-17 relative">
        <div className="flex justify-center items-center h-[400px]">
          <p className="text-white">Please log in to access this adventure</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[80%] max-w-8xl mx-auto px-4 md:px-8 my-17 relative mb-0">
     <div className="flex items-center justify-between mb-6">
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C8A97E] to-[#C8A97E]" />
          <h2 className="text-3xl font-cinzel text-[#C8A97E] whitespace-nowrap mr-6 ml-6">
            Story Mode
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#C8A97E] via-[#C8A97E] to-transparent" />
        </div>
      </div>
      <br />

      {/* Main Content */}
      <div className="px-2">
        <div className="relative w-[100%] h-[400px] rounded-lg overflow-hidden mb-8 mx-auto group">
          {/* Default Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover transition-all duration-300"
            style={{
              backgroundImage: `url('nih.png')`,
              backgroundPosition: window.innerWidth < 768 ? 'left' : 'center',
            }}
          ></div>

          {/* Hover Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-top opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              backgroundImage: `url('/images/hover-bg.jpg')`,
            }}
          ></div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
            <div
              className="absolute bottom-16 right-4 sm:right-12 max-w-md text-right z-10 text-white"
            >
              <h3 className="text-3xl md:text-5xl font-cinzel font-extrabold text-[#F1E3C6] mb-4">
              Uncover the Secrets of Nih
              </h3>
              <p className="text-lg md:text-2xl font-playfair font-bold text-[#FFFBEA] mb-4">
              Mystery surrounds you. Will you be the one to unveil the truth?
              </p>

              {/* Button */}
              <div className="flex justify-end gap-4">
              <a
              href={`/game/nih/${userId}`}
              className="px-6 py-3 border-2 border-[#C8A97E] text-[#C8A97E] bg-transparent hover:bg-[#C8A97E] hover:text-[#1E1E1E] hover:stroke-[#F1E3C6] text-sm md:text-lg font-bold uppercase rounded font-cinzel transition-all duration-500 ease-in-out"
              >
              Play NIH Adventure
              </a>
              </div>
            </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="mt-4 w-[100%] mx-auto relative top-[.85rem]">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C8A97E] to-[#C8A97E]" />
          <div className="w-2 h-2 rotate-45 bg-[#C8A97E]" />
          <div className="flex-1 h-px bg-gradient-to-r from-[#C8A97E] via-[#C8A97E] to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default NihGameCard;