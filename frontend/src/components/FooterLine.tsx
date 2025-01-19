import React from 'react';

const FooterLine = ({ className = '', ...props }) => {
  return (
    <div
      className={`w-full h-[22px] flex justify-between items-center px-2 box-border text-md font-playfair ${className}`}
      style={{ background: 'linear-gradient(to right, #FFFFFF00, #B28F4CF5)' }}
      {...props}
    >
      <span className="pl-6 font-bold text-white hidden md:inline">OFFICIAL SAGE.AI Prototype v1.10rc.1</span>
      <span className="pr-6 font-bold text-white hidden md:inline">BSCS 3-A 2024</span>
    </div>
  );
};

export default FooterLine;
