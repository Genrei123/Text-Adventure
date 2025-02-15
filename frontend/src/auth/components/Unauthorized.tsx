import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-cinzel mb-4">Unrecognized Traveler</h1>
      <p className="text-xl md:text-2xl font-playfair mb-8">Your aura is unfamiliar to these lands</p>
      <button 
        onClick={() => navigate('/login')}
        className="px-6 py-3 bg-[#311F17] text-white font-playfair text-lg rounded-lg hover:bg-[#4A2E22] transition duration-300 flex items-center space-x-2"
      >
        <img src="/scroll.svg" alt="Scroll" className="w-6 h-6" />
        <span>Present Your Credentials</span>
      </button>
    </div>
  );
};

export default Unauthorized;