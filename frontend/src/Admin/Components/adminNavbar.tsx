import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, User } from "lucide-react";
import socketIOClient from "socket.io-client";

// const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL);

const AdminNavbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = localStorage.getItem("userData");
      if (!storedUserData) {
        return null;
      }

      const userData = JSON.parse(storedUserData);
      const username = userData.username;
      setUsername(username);
    };

    const params = new URLSearchParams(window.location.search);
    const usernameParam = params.get("username");
    if (usernameParam) {
      setUsername(decodeURIComponent(usernameParam));
      localStorage.setItem("email", decodeURIComponent(usernameParam));
    }

    fetchUserData();

    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark-theme", newDarkMode);
  };

  return (
    <>
      <nav className="bg-[#3D2E22] py-2 px-4 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
        <div className="flex justify-between items-center">
          {/* Logo - visible on all screens now */}
          <div>
            <img
              src="/SageAI.png"
              alt="Sage.AI Logo"
              className="h-10"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            {/* <button
              onClick={toggleTheme}
              className="rounded-full p-2 bg-[#2A1F17] border border-[#C8A97E] text-[#C8A97E] hover:text-[#E5D4B3] transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}

            {/* User section */}
            {/* {username ? (
              <>
    
                <span className="hidden md:inline font-playfair text-[#E5D4B3]">
                  Welcome, {username}
                </span>
        
                <div className="md:hidden rounded-full p-2 bg-[#2A1F17] border border-[#C8A97E] text-[#C8A97E]">
                  <User size={20} />
                </div>

              
              </>
            ) : (
              <>
                <span className="hidden md:inline font-playfair text-[#E5D4B3]">
                  Not logged in
                </span>
                <button
                  className="bg-[#C8A97E] hover:bg-[#B39671] px-3 py-1 rounded text-sm font-medium text-[#1E1E1E] border border-[#E5D4B3]"
                  onClick={() => navigate("/login")}
                >
                  
                  <span className="hidden md:inline">Enter Realm</span>
                  <span className="md:hidden">Login</span>
                </button>
              </>
            )} */}
          </div>
        </div>
      </nav>

      {/* Removed Logout Confirmation Modal */}
    </>
  );
};

export default AdminNavbar;
