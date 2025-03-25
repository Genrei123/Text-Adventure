import React, { useState, useEffect } from "react";
import axios from "axios";
import CoinStore from "../subscription/CoinStore";

interface GameHeaderProps {
  title?: string; // Optional title prop from Game model
}

const GameHeader: React.FC<GameHeaderProps> = ({ title }) => {
  const [showModal, setShowModal] = useState(false);
  const [coins, setCoins] = useState<number>(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  // Improved fetchCoins function with cache control
  const fetchCoins = async (forceRefresh = false) => {
    const email = localStorage.getItem("email") || 
      (localStorage.getItem("userData") && 
      JSON.parse(localStorage.getItem("userData") || "{}").email);
    
    if (!email) return;
    
    // Only fetch if force refresh or it's been more than 2 seconds
    const now = Date.now();
    if (forceRefresh || now - lastFetchTime > 2000) {
      try {
        console.log("GameHeader: Fetching coins at", new Date().toLocaleTimeString());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/shop/coins?email=${encodeURIComponent(email)}`);
        
        console.log("GameHeader: Received coins:", response.data.coins);
        setCoins(response.data.coins);
        setLastFetchTime(now);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchCoins(true);
    
    // Set up polling every 5 seconds for background updates
    const intervalId = setInterval(() => {
      fetchCoins();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Listen for the custom coinUpdate event
  useEffect(() => {
    const handleCoinUpdate = () => {
      console.log("GameHeader: Coin update event received");
      fetchCoins(true);
    };
    
    window.addEventListener('coinUpdate', handleCoinUpdate);
    
    return () => {
      window.removeEventListener('coinUpdate', handleCoinUpdate);
    };
  }, []);
  
  return (
    <nav className="bg-[#1E1E1E] py-[1.06rem] px-0 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
      <div className="flex justify-between items-center">
        <div className="text-xl font-cinzel text-[#C8A97E] font-bold hidden sm:block ml-[5%]">SAGE.AI</div>
        <div className="flex items-center">
          <div className="absolute left-[40%] transform -translate-x-1/2 text-s font-cinzel text-[#ffffff] font-bold sm:text-base truncate max-w-[20ch]">
            {title || "Untitled Game"}
          </div>
        </div>
        <div className="flex items-center">
          <img src="/Coin.svg" alt="Coins" className="w-6 h-6" />
          <span className="text-x1 font-cinzel text-[#ffffff] font-bold ml-2">
            {new Intl.NumberFormat().format(coins)}
          </span>
          <button 
            className="mr-1 relative group" 
            onClick={() => {
              setShowModal(true);
              fetchCoins(true); // Force refresh when opening store
            }}
          >
            <img src="/add.svg" alt="Button" className="w-7 h-6 mr-[10%]" />
            <img src="/add-after.svg" alt="Hover Button" className="w-7 h-6 mr-[10%] absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          {showModal && (
            <CoinStore 
              onClose={() => {
                setShowModal(false);
                fetchCoins(true); // Force refresh when closing store
              }} 
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default GameHeader;