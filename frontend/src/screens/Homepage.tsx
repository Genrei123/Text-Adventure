import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig/axiosConfig';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';

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
          {/* leftsidebar */}
          <div className="hidden md:block w-1/15 h-10 p-6 absolute top-12 left-0 md:w-1/15 md:h-[calc(127vh-4rem)] md:p-6">
            <ul className="space-y-2 md:space-y-0 md:flex md:flex-col">
              <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                <img src="src/assets/Home.svg" className="w-9 h-9 group-hover:opacity-0" />
                <img src="src/assets/Home-after.svg" className="w-9 h-9 absolute top-0 left-3 opacity-0 group-hover:opacity-100" />
              </li>
              <br />
              <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                <img src="src/assets/Settings.svg" className="w-9 h-9 group-hover:opacity-0" />
                <img src="src/assets/Settings-after.svg" className="w-9 h-9 absolute top-0 left-3 opacity-0 group-hover:opacity-100" />
              </li>
              <br />
              <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                <img src="src/assets/Message.svg" className="w-13 h-13 group-hover:opacity-0" />
                <img src="src/assets/Message-after.svg" className="w-13 h-13 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
              </li>
              <br />
              <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                <img src="src/assets/Any.svg" className="w-15 h-15 group-hover:opacity-0" />
                <img src="src/assets/Any-after.svg" className="w-15 h-15 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
              </li>
            </ul>
          </div>
          {/* upper side bar */}
          <div className="block md:hidden w-full p-1 top-12 left-0 h-50 absolute">
            <ul className="flex justify-around">
              <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                <img src="src/assets/Home.svg" className="w-4.5 h-4.5 group-hover:opacity-0" />
                <img src="src/assets/Home-after.svg" className="w-4.5 h-4.5 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
              </li>
              <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                <img src="src/assets/Settings.svg" className="w-4.5 h-4.5 group-hover:opacity-0" />
                <img src="src/assets/Settings-after.svg" className="w-4.5 h-4.5 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
              </li>
              <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                <img src="src/assets/Message.svg" className="w-6.5 h-6.5 group-hover:opacity-0" />
                <img src="src/assets/Message-after.svg" className="w-6.5 h-6.5 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
              </li>
              <li className="flex justify-center items-center cursor-pointer m-1.5 relative group">
                <img src="src/assets/Any.svg" className="w-7.5 h-7.5 group-hover:opacity-0" />
                <img src="src/assets/Any-after.svg" className="w-7.5 h-7.5 absolute top-0 left-0 opacity-0 group-hover:opacity-100" />
              </li>
            </ul>
          </div>
          </div>
          
        <h1 className="text-4xl font-bold font-cinzel text-[#C8A97E] mb-4">
          Welcome to Sage.AI
        </h1>
        <p className="text-xl font-playfair text-[#E5D4B3]">
          {username ? `Hello, ${username}! Your adventure begins now.` : 'Please log in to start your journey.'}
        </p>
      </div>
    </div>

  );
};

export default Homepage;