import React from "react";

const FooterLine = ({ className = "", ...props }) => {
  return (
    <div className="w-full flex flex-col items-center relative mt-8">
      {/* Gradient line with owl */}
      <div className="w-full relative">
        {/* Owl Image positioned to sit on the gradient line */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 z-10"
          style={{ transform: "translate(-50%, -100%)" }}
        >
          <img
            src="/owl.png"
            alt="Owl"
            className="w-[200px] h-auto sm:w-[200px] md:w-[400px] lg:w-[500px] object-contain"
          />
        </div>

        {/* Gradient line */}
        <div
          className={`w-full h-[22px] flex justify-between items-center px-2 box-border text-md font-playfair ${className}`}
          style={{
            background: "linear-gradient(to right, #FFFFFF00, #B28F4CF5)",
          }}
          {...props}
        >
          <span className="pl-6 font-bold text-white hidden md:inline">
            OFFICIAL SAGE.AI Prototype v1.10rc.1
          </span>
          <span className="pr-6 font-bold text-white hidden md:inline">
            BSCS 3-A 2024
          </span>
          <span className="text-center w-full md:hidden text-white font-bold text-xs">
            SAGE.AI v1.10rc.1 • BSCS 3-A 2024
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterLine;
