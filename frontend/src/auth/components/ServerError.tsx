import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-cinzel mb-4">Magical Mishap</h1>
      <p className="text-xl md:text-2xl font-playfair mb-8">Our wizards are working to restore order</p>
      <button 
        onClick={() => navigate('/home')}
        className="px-6 py-3 bg-[#311F17] text-white font-playfair text-lg rounded-lg hover:bg-[#4A2E22] transition duration-300 flex items-center space-x-2"
      >
        <img src="/wand.svg" alt="Wand" className="w-6 h-6" />
        <span>Cast a Return Spell</span>
      </button>
    </div>
  );
};

export default ServerError;