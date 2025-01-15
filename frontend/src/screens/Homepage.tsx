import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../axiosConfig/axiosConfig';
import Footer from '../components/Footer';

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
      <nav className="bg-[#3D2E22] py-2 px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-cinzel text-[#C8A97E]">Sage.AI</div>
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