import React, { useState } from "react";
import PortraitCard from "./PortraitCard";
import LandscapeCard from "./LandscapeCard";

interface YourJourneyProps {
  setCard: (cardType: string | null) => void;
}

const YourJourney: React.FC<YourJourneyProps> = ({ setCard }) => {
  const [cardType, setCardType] = useState<"portrait" | "landscape">("portrait");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 my-17 relative">
      {/* Top Divider */}
      <div className="max-w-5xl mx-auto mb-8">
      </div>

      {/* Main Content */}
      <div className="w-[90%] mx-auto">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center w-full">
            <h2 className="text-xl font-cinzel text-[#C8A97E] whitespace-nowrap mr-6">
              Your Journey
            </h2>
            <div className="h-1 bg-[#C8A97E] flex-grow"></div>
          </div>

          {/* Filter Icons (Portrait & Landscape) */}
          <div className="flex space-x-4">
            <button
              className={`relative w-12 h-12 group flex justify-center items-center ${
                cardType === "portrait" ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => setCardType("portrait")}
            >
              <img src="Any.svg" alt="Portrait Filter" className="w-10 h-10" />
              <img
                src="Any-After.svg"
                alt="Portrait Hover"
                className="w-10 h-10 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </button>

            <button
              className={`relative w-12 h-12 group flex justify-center items-center ${
                cardType === "landscape" ? "opacity-100" : "opacity-50"
              }`}
              onClick={() => setCardType("landscape")}
            >
              <img
                src="filter2.svg"
                alt="Landscape Filter"
                className="w-10 h-10"
              />
              <img
                src="filter2-after.svg"
                alt="Landscape Hover"
                className="w-10 h-10 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </button>
          </div>
        </div>

        {/* Dynamic Card Display */}
        <div className="bg-[#1e1e1e] w-full p-4 max-h-[1240px] overflow-x-auto scrollbar-thin scrollbar-thinner">
          {cardType === "portrait" ? <PortraitCard /> : <LandscapeCard />}
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="max-w-7xl mx-auto mt-8">
      </div>
    </div>
  );
};

export default YourJourney;