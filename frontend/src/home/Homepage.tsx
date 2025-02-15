import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import Footer from '../components/Footer';
import SearchBar from '../components/Searchbar';
import Sidebar from '../components/Sidebar';
import PortraitCard from './components/PortraitCard';
import BookCard from './components/BookCard';
import Navbar from '../components/Navbar';

interface HomepageProps {
  onLogout: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  const [card, setCard] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch in local storage
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      setUsername(token);
      console.log('Token:', token);
    };


    fetchUserData();

    // Parse username from the query string
    const params = new URLSearchParams(location.search);
    const usernameParam = params.get('username');
    if (usernameParam) {
      setUsername(decodeURIComponent(usernameParam));
      localStorage.setItem('username', usernameParam);
    }
  }, [location]);
    

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
      <Navbar/>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-row w-full">
            <Sidebar/>
          </div>

        {!PortraitCard && (
          <div>
            <h1 className="text-4xl font-bold font-cinzel text-[#C8A97E] mb-4">
              Welcome to Sage.AI
            </h1>
            <p className="text-xl font-playfair text-[#E5D4B3]">
              {username ? `Hello, ${username}! Your adventure begins now.` : 'Please log in to start your journey.'}
            </p>
          </div>
        )}
      </div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <div className="flex justify-center w-full px-4 md:px-0 items-center">
        <h2 className="text-2xl font-cinzel text-[#C8A97E] mr-4">your journey</h2>
        <div className="w-full md:w-[60%] h-1 bg-[#C8A97E]"></div>
        <div className="flex justify-end space-x-4 md:flex-row flex-col md:items-center items-end">
          <button
            className="p-2 relative group w-12 h-12 md:w-10 md:h-10"
            onClick={() => setCard("portrait")}
          >
            <img src="Any.svg" alt="Button 1" className="w-full h-full" />
            <img
              src="Any-After.svg"
              alt="Hover Button 1"
              className="w-[70%] h-[70%] absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </button>
          <button
            className="p-2 relative group w-12 h-12 md:w-10 md:h-10"
            onClick={() => setCard("landscape")}
          >
            <img src="filter2.svg" alt="Button 2" className="w-full h-full" />
            <img
              src="filter2-after.svg"
              alt="Hover Button 2"
              className="w-[70%] h-[70%] absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </button>
        </div>
      </div>
      {/* placeholder for memories */}
      
      <div className="bg-[#1e1e1e] w-[90%] p-4 mx-auto my-10 max-h-[1240px] overflow-x-auto scrollbar-thin scrollbar-thinner">
      <div className="flex justify-end space-x-4">
              </div>
              <br></br>
            <PortraitCard />
            
        </div>
        <style>
          {`
          /* Custom scrollbar styles */
          .scrollbar-thin::-webkit-scrollbar {
            height: 8px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #B28F4C;
            border-radius: 10px;
            border: 2px solid transparent;
          }
          /* Custom Scrollbar Styles */
          .scrollbar-thinner::-webkit-scrollbar {
            width: 4px; /* Adjust width */
            height: 4px; /* Adjust height for horizontal scrollbar */
          }

          .scrollbar-thinner::-webkit-scrollbar-thumb {
            background-color: #C8A97E; /* Thumb color */
            border-radius: 10px; /* Round edges */
          }

          .scrollbar-thinner::-webkit-scrollbar-track {
            background-color: transparent; /* Track color */
          }

        `}
        </style>
    </div>

  );
};

export default Homepage;