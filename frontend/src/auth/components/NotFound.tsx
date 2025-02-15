import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl font-cinzel mb-4">Lost in the Dark?</h1>
      <p className="text-xl md:text-2xl font-playfair mb-8">Here, grab a torch</p>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-[#311F17] text-white font-playfair text-lg rounded-lg hover:bg-[#4A2E22] transition duration-300 flex items-center space-x-2"
      >
        <img src="/torch.svg" alt="Torch" className="w-6 h-6" />
        <span>Light Your Way Home</span>
      </button>
    </div>
  );
};

export default NotFound;