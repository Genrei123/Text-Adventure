import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CoinStore from "../subscription/CoinStore";
import { useNavigate } from "react-router-dom";

interface GameHeaderProps {
  title?: string; // Optional title prop from Game model
}

const GameHeader: React.FC<GameHeaderProps> = ({ title }) => {
  const [showModal, setShowModal] = useState(false);
  const [coins, setCoins] = useState<number>(0);
  const lastFetchTimeRef = useRef<number>(0);
  const navigate = useNavigate();
  
  // Improved fetchCoins function with cache control - but no automatic polling
  const fetchCoins = async (forceRefresh = false) => {
    const email = localStorage.getItem("email") || 
      (localStorage.getItem("userData") && 
      JSON.parse(localStorage.getItem("userData") || "{}").email);
    
    if (!email) return;
    
    // Only fetch if force refresh or it's been more than 2 seconds
    const now = Date.now();
    if (forceRefresh || now - lastFetchTimeRef.current > 2000) {
      try {
        console.log("GameHeader: Fetching coins at", new Date().toLocaleTimeString());
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/shop/coins?email=${encodeURIComponent(email)}`);
        
        console.log("GameHeader: Received coins:", response.data.coins);
        setCoins(response.data.coins);
        lastFetchTimeRef.current = now;
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    }
  };
  
  // Initial fetch on component mount - but no polling
  useEffect(() => {
    // Initial fetch with force refresh
    fetchCoins(true);
    
    // No polling interval setup
  }, []);
  
  // Listen for the custom coinUpdate event with direct balance updates
  useEffect(() => {
    const handleCoinUpdate = (event: Event) => {
      console.log("GameHeader: Coin update event received");
      
      // Check if the event has a detail property with newBalance
      if ((event as CustomEvent)?.detail?.newBalance !== undefined) {
        // Use the provided balance directly without making an API call
        console.log("GameHeader: Using provided balance:", (event as CustomEvent).detail.newBalance);
        setCoins((event as CustomEvent).detail.newBalance);
        lastFetchTimeRef.current = Date.now();
      } else {
        // Only fetch if no balance was provided
        fetchCoins(true);
      }
    };
    
    window.addEventListener('coinUpdate', handleCoinUpdate);
    
    return () => {
      window.removeEventListener('coinUpdate', handleCoinUpdate);
    };
  }, []);
  
  // Handle store open/close
  const handleOpenStore = () => {
    setShowModal(true);
    fetchCoins(true); // Force refresh when opening store
  };
  
  const handleCloseStore = () => {
    setShowModal(false);
    fetchCoins(true); // Force refresh when closing store
  };
  
  return (
    <nav className="bg-[#1E1E1E] py-[1.06rem] px-0 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
      <div className="flex justify-between items-center">
        <div className="text-xl font-cinzel text-[#C8A97E] font-bold hidden sm:block ml-[5%]" onClick={() => navigate("/home")}>SAGE.AI </div>

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
            onClick={handleOpenStore}
          >
            <img src="/add.svg" alt="Button" className="w-7 h-6 mr-[10%]" />
            <img src="/add-after.svg" alt="Hover Button" className="w-7 h-6 mr-[10%] absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          {showModal && <CoinStore onClose={handleCloseStore} />}
        </div>
      </div>
    </nav>
  );
};

export default GameHeader;