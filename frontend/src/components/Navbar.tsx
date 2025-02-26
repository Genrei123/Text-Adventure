import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, ChevronDown, X, LogOut} from "lucide-react";
import socketIOClient from 'socket.io-client';

const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL);

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPopularity, setSelectedPopularity] = useState("all");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = windowWidth < 768; // Define mobile breakpoint
  
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/home";
  const genres = [
    "Fantasy",
    "Dark Fantasy",
    "High Fantasy",
    "Medieval",
    "Magic",
  ];
  const tags = ["Adventure", "Dragons", "Magic System", "Kingdom", "Quest"];
  const popularityOptions = [
    { label: "Past Day", value: "1day" },
    { label: "Past Moon", value: "30days" },
    { label: "Past Year", value: "1year" },
    { label: "All Time", value: "all" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Collapse search on resize to desktop
      if (window.innerWidth >= 768 && isSearchExpanded) {
        setIsSearchExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isSearchExpanded]);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) {
          return null;
      }

      const userData = JSON.parse(storedUserData);
      const username = userData.username;
      setUsername(username);
    };

    const params = new URLSearchParams(window.location.search);
    const usernameParam = params.get('username');
    if (usernameParam) {
      setUsername(decodeURIComponent(usernameParam));
      localStorage.setItem("email", decodeURIComponent(usernameParam));
    }

    fetchUserData();
    
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const sampleStories = [
        "The Lost Scrolls of Aldor",
        "Legends of the Crystal Keep",
        "The Last Sage",
        "Realm of Ancient Magic",
      ];
      setSuggestions(
        sampleStories.filter((story) =>
          story.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      if (token && email) {
        socket.emit('leave', { route: window.location.pathname, email, token });
      }

      localStorage.removeItem("email");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setShowFilters(false); // Close filters when opening search
    }
  };

  // Get the appropriate placeholder text based on screen width
  const getPlaceholderText = () => {
    return windowWidth < 640 ? "Search" : "Search the ancient scrolls...";
  };

  // Generate initials for the profile circle
  const getInitials = () => {
    if (!username) return "?";
    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Get a consistent color based on username (extra code for fun)
  const getProfileColor = () => {
    if (!username) return "#8B4513";
    
    // Simple hash function to generate a color
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Convert to hex color (keeping it in brown/gold palette)
    const hue = Math.abs(hash) % 60 + 30; // 30-90 range (browns/golds)
    const saturation = 70 + (Math.abs(hash) % 30); // 70-100%
    const lightness = 40 + (Math.abs(hash) % 20); // 40-60%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <>
      <nav className="bg-[#3D2E22] py-2 px-4 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
        <div className="flex flex-col space-y-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center">
            {/* Logo - Hidden when search is expanded on mobile */}
            {!(isMobile && isSearchExpanded) && (
              <div className="flex items-center">
                <img 
                  src="/SageAI.png" 
                  alt="Sage.AI Logo" 
                  className="h-10" 
                  onClick={() => navigate("/home")}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}

            {/* Search Bar and Filter Button - Visible only on the Home Page */}
            {isHomePage && (
              <div className={`flex items-center space-x-2 ${isMobile && isSearchExpanded ? 'w-full' : ''}`}>
                {isMobile ? (
                  /* Mobile Search Icon/Expanded Search */
                  <div className={`transition-all duration-300 ${isSearchExpanded ? 'w-full' : 'w-auto'}`}>
                    {isSearchExpanded ? (
                      <div className="flex items-center w-full relative">
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full p-2 pl-10 rounded-full bg-[#E5D4B3] text-[#3D2E22] placeholder-[#8B4513] border-2 border-[#C8A97E] focus:outline-none focus:border-[#8B4513]"
                        />
                        <Search
                          className="absolute left-3 top-2.5 text-[#8B4513]"
                          size={20}
                        />
                        <button
                          onClick={toggleSearch}
                          className="absolute right-12 top-2.5 text-[#8B4513]"
                        >
                          <X size={20} />
                        </button>
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className="absolute right-3 top-2.5 text-[#8B4513]"
                        >
                          <ChevronDown
                            className={`transform transition-transform ${
                              showFilters ? "rotate-180" : ""
                            }`}
                            size={20}
                          />
                        </button>
                        {suggestions.length > 0 && (
                          <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded-lg mt-1 top-10 shadow-lg overflow-hidden">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="p-2 hover:bg-[#C8A97E] cursor-pointer text-[#3D2E22]"
                                onClick={() => setSearchQuery(suggestion)}
                              >
                                {suggestion}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={toggleSearch}
                        className="p-2 rounded-full bg-[#E5D4B3] border-2 border-[#C8A97E] text-[#8B4513]"
                        aria-label="Search"
                      >
                        <Search size={20} />
                      </button>
                    )}
                  </div>
                ) : (
                  /* Desktop Search */
                  <div className="relative w-40 sm:w-52 md:w-80 lg:w-96">
                    <input
                      type="text"
                      placeholder={getPlaceholderText()}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-2 pl-10 rounded-full bg-[#E5D4B3] text-[#3D2E22] placeholder-[#8B4513] border-2 border-[#C8A97E] focus:outline-none focus:border-[#8B4513]"
                    />
                    <Search
                      className="absolute left-3 top-2.5 text-[#8B4513]"
                      size={20}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded-lg mt-1 shadow-lg overflow-hidden">
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2 hover:bg-[#C8A97E] cursor-pointer text-[#3D2E22]"
                            onClick={() => setSearchQuery(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Filters Toggle for Desktop */}
                {!isMobile && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-[#C8A97E] hover:text-[#E5D4B3]"
                  >
                    Filter
                    <ChevronDown
                      className={`ml-1 transform transition-transform ${
                        showFilters ? "rotate-180" : ""
                      }`}
                      size={20}
                    />
                  </button>
                )}
              </div>
            )}

            {/* Theme toggle and User section - Hidden when search is expanded on mobile */}
            {!(isMobile && isSearchExpanded) && (
              <div className="flex items-center space-x-2">
                {/* User Profile/Login */}
                {username ? (
                  <div className="flex items-center space-x-2">
                    {isMobile ? (
                      /* Mobile: Profile Circle */
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                        style={{ backgroundColor: getProfileColor() }}
                        title={username}
                      >
                        {getInitials()}
                      </div>
                    ) : (
                      /* Desktop: Username */
                      <span className="font-playfair text-[#E5D4B3]">
                        Welcome, {username}
                      </span>
                    )}
                    
                    {/* Logout Button */}
                    {isMobile ? (
                      <button
                        className="p-2 rounded-full bg-[#8B4513] hover:bg-[#723A10] text-[#E5D4B3] border border-[#C8A97E]"
                        onClick={openLogoutModal}
                        title="Leave Realm"
                      >
                        <LogOut size={18} />
                      </button>
                    ) : (
                      <button
                        className="bg-[#8B4513] hover:bg-[#723A10] px-3 py-1 rounded text-sm font-medium text-[#E5D4B3] border border-[#C8A97E]"
                        onClick={openLogoutModal}
                      >
                        Leave Realm
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {!isMobile && (
                      <span className="font-playfair text-[#E5D4B3]">
                        Not logged in
                      </span>
                    )}
                    <button
                      className="bg-[#C8A97E] hover:bg-[#B39671] px-3 py-1 rounded text-sm font-medium text-[#1E1E1E] border border-[#E5D4B3]"
                      onClick={() => navigate("/login")}
                    >
                      {isMobile ? "Enter" : "Enter Realm"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Filters Section */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#2A1F17] p-4 rounded border border-[#C8A97E]">
              {/* Genres */}
              <div className="space-y-2">
                <h3 className="font-cinzel text-[#C8A97E]">Schools of Magic</h3>
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center">
                    <input
                      type="checkbox"
                      id={genre}
                      checked={selectedGenres.includes(genre)}
                      onChange={() =>
                        setSelectedGenres((prev) =>
                          prev.includes(genre)
                            ? prev.filter((g) => g !== genre)
                            : [...prev, genre]
                        )
                      }
                      className="mr-2 accent-[#C8A97E]"
                    />
                    <label htmlFor={genre} className="text-[#E5D4B3]">
                      {genre}
                    </label>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <h3 className="font-cinzel text-[#C8A97E]">
                  Mystical Attributes
                </h3>
                {tags.map((tag) => (
                  <div key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onChange={() =>
                        setSelectedTags((prev) =>
                          prev.includes(tag)
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        )
                      }
                      className="mr-2 accent-[#C8A97E]"
                    />
                    <label htmlFor={tag} className="text-[#E5D4B3]">
                      {tag}
                    </label>
                  </div>
                ))}
              </div>

              {/* Popularity */}
              <div className="space-y-2">
                <h3 className="font-cinzel text-[#C8A97E]">Time Chronicles</h3>
                {popularityOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={option.value}
                      name="popularity"
                      value={option.value}
                      checked={selectedPopularity === option.value}
                      onChange={(e) => setSelectedPopularity(e.target.value)}
                      className="mr-2 accent-[#C8A97E]"
                    />
                    <label htmlFor={option.value} className="text-[#E5D4B3]">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2A1F17] border-2 border-[#C8A97E] rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="font-cinzel text-xl text-[#E5D4B3] mb-4 text-center">Leave the Realm?</h2>
            <p className="text-[#C8A97E] mb-6 text-center">
              Are you sure you wish to depart from these mystical lands? Your journey will be paused until your return.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeLogoutModal}
                className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#E5D4B3] rounded border border-[#C8A97E]"
              >
                Stay
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#8B4513] hover:bg-[#723A10] text-[#E5D4B3] rounded border border-[#C8A97E]"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;