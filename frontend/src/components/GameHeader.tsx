import React, { useState, useEffect } from "react";
import axios from "../../config/axiosConfig";
import CoinStore from "../subscription/CoinStore";

interface GameHeaderProps {
  title?: string; // Optional title prop from Game model
}

const GameHeader: React.FC<GameHeaderProps> = ({ title }) => {
  const [showModal, setShowModal] = useState(false);
  const [coins, setCoins] = useState<number>(0);

  useEffect(() => {
    const fetchCoins = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get(`/shop/coins?email=${email}`);
          setCoins(response.data.coins);
        } catch (error) {
          console.error('Error fetching coins:', error);
        }
      }
    };

    fetchCoins();
  }, []);

  return (
    <nav className="bg-[#1E1E1E] py-[1.06rem] px-0 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
      <div className="flex justify-between items-center">
        <div className="text-xl font-cinzel text-[#C8A97E] font-bold hidden sm:block ml-[5%]">SAGE.AI</div>
        <div className="flex items-center">
          <div className="absolute left-[40%] transform -translate-x-1/2 text-s font-cinzel text-[#ffffff] font-bold sm:text-base truncate max-w-[20ch]">
            {title || "Untitled Game"} {/* Use dynamic title with fallback */}
          </div>
        </div>
        <div className="flex items-center">
          <img src="/Coin.svg" alt="Coins" className="w-6 h-6" />
          <span className="text-x1 font-cinzel text-[#ffffff] font-bold ml-2">
            {new Intl.NumberFormat().format(coins)}
          </span>
          <button className="mr-1 relative group" onClick={() => setShowModal(true)}>
            <img src="/add.svg" alt="Button" className="w-7 h-6 mr-[10%]" />
            <img src="/add-after.svg" alt="Hover Button" className="w-7 h-6 mr-[10%] absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          {showModal && <CoinStore onClose={() => setShowModal(false)} />}
        </div>
      </div>
    </nav>
  );
};

export default GameHeader;