import React from "react";

interface StartAdventureProps {
  onCreateStory: () => void;
  onBrowse: () => void;
}

const StartAdventure: React.FC<StartAdventureProps> = ({
  onCreateStory,
  onBrowse,
}) => {
  return (
    <div className="w-full max-w-8xl mx-auto px-4 md:px-8 my-17 relative">
      {/* Top Divider */}
      <div className="mb-8 w-[80%] mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#C8A97E] to-[#C8A97E]" />
          <div className="w-2 h-2 rotate-45 bg-[#C8A97E]" />
          <div className="flex-1 h-px bg-gradient-to-r from-[#C8A97E] via-[#C8A97E] to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-2">
        <div className="relative w-[80%] h-[400px] rounded-lg overflow-hidden mb-8 mx-auto group">
          {/* Default Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            }}
          ></div>

          {/* Hover Background Image */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-top opacity-0 group-hover:opacity-100 transition-all duration-300"
            style={{
              backgroundImage: `url('landing3.gif')`, // Replace with your hover image URL
            }}
          ></div>

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Content */}
          <div className="absolute bottom-16 right-12 max-w-md text-right z-10 text-white drop-shadow-lg">
            <h3 className="text-3xl md:text-5xl font-cinzel font-extrabold text-[#F1E3C6] mb-4">
              Your Adventure Awaits
            </h3>
            <p className="text-lg md:text-2xl font-playfair font-bold text-[#FFFBEA] mb-4">
              Will you forge your own path, or explore the stories of others?
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={onCreateStory}
                className="px-6 py-3 border border-[#C8A97E] text-[#C8A97E] bg-transparent hover:bg-[#C8A97E] hover:text-[#1E1E1E] text-sm md:text-lg font-bold uppercase rounded font-cinzel drop-shadow-lg transition-all duration-300"
              >
                Create Story
              </button>

              {/* <button
                onClick={onBrowse}
                className="px-6 py-3 bg-[#C8A97E] hover:bg-[#D8B98E] text-white text-sm md:text-lg font-bold uppercase rounded font-cinzel drop-shadow-lg transition-all duration-300"
              >
                Browse Stories
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="mt-8"></div>
    </div>
  );
};

export default StartAdventure;