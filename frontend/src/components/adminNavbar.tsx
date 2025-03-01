import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, LogOut, User, X } from "lucide-react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL);

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (token && email) {
        socket.emit("leave", { route: window.location.pathname, email, token });
      }

      localStorage.removeItem("email");
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
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 bg-[#2A1F17] border border-[#C8A97E] text-[#C8A97E] hover:text-[#E5D4B3] transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User section */}
            {username ? (
              <>
                {/* On larger screens show text, on mobile show icon */}
                <span className="hidden md:inline font-playfair text-[#E5D4B3]">
                  Welcome, {username}
                </span>
                {/* Profile icon for mobile */}
                <div className="md:hidden rounded-full p-2 bg-[#2A1F17] border border-[#C8A97E] text-[#C8A97E]">
                  <User size={20} />
                </div>
                
                {/* On larger screens show button text, on mobile show icon */}
                <button
                  className="md:flex hidden bg-[#8B4513] hover:bg-[#723A10] px-3 py-1 rounded text-sm font-medium text-[#E5D4B3] border border-[#C8A97E]"
                  onClick={openLogoutModal}
                >
                  Leave Realm
                </button>
                {/* Logout icon for mobile */}
                <button
                  className="md:hidden flex items-center justify-center rounded-full p-2 bg-[#8B4513] border border-[#C8A97E] text-[#E5D4B3]"
                  onClick={openLogoutModal}
                  aria-label="Leave Realm"
                >
                  <LogOut size={20} />
                </button>
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
                  {/* Responsive text for login button */}
                  <span className="hidden md:inline">Enter Realm</span>
                  <span className="md:hidden">Login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2A1F17] border-2 border-[#C8A97E] rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-playfair text-[#E5D4B3]">Confirm Exit</h3>
              <button 
                className="text-[#C8A97E] hover:text-[#E5D4B3]"
                onClick={closeLogoutModal}
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-[#E5D4B3] mb-6">
              Are you sure you wish to leave this realm? Your journey will be paused until you return.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button 
                className="px-4 py-2 bg-[#2A1F17] border border-[#C8A97E] text-[#C8A97E] hover:bg-[#3D2E22] rounded"
                onClick={closeLogoutModal}
              >
                Stay
              </button>
              <button 
                className="px-4 py-2 bg-[#8B4513] text-[#E5D4B3] hover:bg-[#723A10] rounded border border-[#C8A97E]"
                onClick={handleLogout}
              >
                Leave Realm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;