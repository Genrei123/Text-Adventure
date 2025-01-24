import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig/axiosConfig';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import Sidebar from '../components/Sidebar';
import PortraitCard from '../components/PortraitCard';

interface HomepageProps {
  onLogout: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Parse username from the query string
    const params = new URLSearchParams(location.search);
    const usernameParam = params.get('username');
    if (usernameParam) {
      setUsername(decodeURIComponent(usernameParam));
    }
  }, [location]);

  const handleLogout = async () => {

    try {
      const response = await axios.get('/auth/logout');
      const data = response.data; 
      window.location.href = data.redirectUrl;
    }

    catch (error) {
      console.error('Logout failed', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-[#E5D4B3] flex flex-col">
      <nav className="bg-[#3D2E22] py-2 px-4 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
        <div className="flex justify-between items-center">
          <div className="text-xl font-cinzel text-[#C8A97E]">Sage.AI</div>
          {/* Remove comment if the searchbar is now done */}
          {/* <SearchBar /> */}
          <div className="flex items-center space-x-2">
            {username ? (
              <>
                <span className="font-playfair text-[#E5D4B3]">Welcome, {username}</span>
                <button
                  className="bg-[#8B4513] hover:bg-[#723A10] px-3 py-1 rounded text-sm font-medium text-[#E5D4B3] border border-[#C8A97E]"
                  onClick={handleLogout}
                >
                  Leave Realm
                </button>
              </>
            ) : (
              <>
                <span className="font-playfair text-[#E5D4B3]">Not logged in</span>
                <button
                  className="bg-[#C8A97E] hover:bg-[#B39671] px-3 py-1 rounded text-sm font-medium text-[#1E1E1E] border border-[#E5D4B3]"
                  onClick={() => navigate('/login')}
                >
                  Enter Realm
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-row w-full">
            <Sidebar/>
          </div>
        <h1 className="text-4xl font-bold font-cinzel text-[#C8A97E] mb-4">
          Welcome to Sage.AI
        </h1>
        <p className="text-xl font-playfair text-[#E5D4B3]">
          {username ? `Hello, ${username}! Your adventure begins now.` : 'Please log in to start your journey.'}
        </p>
      </div>
      {/* placeholder for memories */}

        <div className="bg-[#1e1e1e] border border-black w-[full] p-4 mx-auto my-10 mx-[5%] max-h-[1240px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#C8A97E] scrollbar-track-transparent">
              <div className="flex justify-end space-x-4">
            <button
              className="p-2"
              onClick={() => console.log('Button 1 clicked')}
            >
              <img src="filter1.svg" alt="Button 1" className="w-10 h-10" />
            </button>
            <button
              className="p-2"
              onClick={() => console.log('Button 2 clicked')}
            >
              <img src="filter2.svg" alt="Button 2" className="w-6 h-6" />
            </button>
              </div>
              <br></br>
            <PortraitCard/>
        </div>
        <style>{`
          /* Custom scrollbar styles */
          .scrollbar-thin::-webkit-scrollbar {
            width: 8px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #B28F4C;
            border-radius: 10px;
            border: 2px solid transparent;
          }
        `}</style>
    </div>

  );
};

export default Homepage;