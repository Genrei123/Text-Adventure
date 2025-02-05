import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch in local storage
      const token = localStorage.getItem("username");
      if (!token) {
        return;
      }
      setUsername(token);
      console.log("Token:", token);
    };


    // Parse username from the query string
    const params = new URLSearchParams(location.search);
    const usernameParam = params.get('username');
    if (usernameParam) {
      setUsername(decodeURIComponent(usernameParam));
    }

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // const response = await axios.get('/auth/logout');
      // const data = response.data;
      // window.location.href = data.redirectUrl;

      // Clear local storage
      localStorage.removeItem("username");
      localStorage.removeItem("token");

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <nav className="bg-[#3D2E22] py-2 px-4 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
        <div className="flex justify-between items-center">
          <div className="text-xl font-cinzel text-[#C8A97E]">Sage.AI</div>
          {/* Remove comment if the searchbar is now done */}
          {/* <SearchBar /> */}
          <div className="flex items-center space-x-2">
            {username ? (
              <>
                <span className="font-playfair text-[#E5D4B3]">
                  Welcome, {username}
                </span>
                
                <button
                  className="bg-[#8B4513] hover:bg-[#723A10] px-3 py-1 rounded text-sm font-medium text-[#E5D4B3] border border-[#C8A97E]"
                  onClick={handleLogout}
                >
                  Leave Realm
                </button>
              </>
            ) : (
              <>
                <span className="font-playfair text-[#E5D4B3]">
                  Not logged in
                </span>
                <button
                  className="bg-[#C8A97E] hover:bg-[#B39671] px-3 py-1 rounded text-sm font-medium text-[#1E1E1E] border border-[#E5D4B3]"
                  onClick={() => navigate("/login")}
                >
                  Enter Realm
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
