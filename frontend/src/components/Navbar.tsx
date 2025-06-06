import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Search, ChevronDown, X, LogOut } from "lucide-react";
import socketIOClient from 'socket.io-client';
import axiosInstance from "../../config/axiosConfig";
import { debounce } from "lodash";
import { useNavbar } from "../context/NavbarContext";
import LogoutModal from "./LogoutModal";
import Button from "./Button";


// const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL);

// Game Interface
interface Game {
  id: number;
  title: string;
  slug: string;
  genre: string;
  subgenre: string;
  image_data?: string;
}

// Player Interface
interface Player {
  id: number;
  username: string;
  display_name?: string;
  image_url?: string;
}

interface NavbarProps { }

const Navbar: React.FC<NavbarProps> = () => {
  const { handleLogout, username, setUsername } = useNavbar();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<(Game | Player)[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPopularity, setSelectedPopularity] = useState("all");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = windowWidth < 768; // Define mobile breakpoint

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/home";

  //Logout modal shets
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  // const handleLogout = () => {
  //   // your logout logic
  //   closeLogoutModal();
  // };

  // Extract unique genres and subgenres from actual data
  const genres = [...new Set(games.map(game => game.genre))].filter(Boolean);

  // Use subgenres as tags
  const tags = [...new Set(games.map(game => game.subgenre))].filter(Boolean);

  const popularityOptions = [
    { label: "Past Day", value: "1day" },
    { label: "Past Moon", value: "30days" },
    { label: "Past Year", value: "1year" },
    { label: "All Time", value: "all" },
  ];

  // Fetch games and players data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch games
        const gamesResponse = await axiosInstance.get('/game/');
        if (gamesResponse.data) {
          setGames(gamesResponse.data);
        }

        // Fetch players
        const playersResponse = await axiosInstance.get('/admin/users/');
        if (playersResponse.data) {
          setPlayers(playersResponse.data);
        }
      } catch (error) {
        console.error('Error fetching player:', error);
      }
    };

    const fetchUserData = async () => {
      const email = localStorage.getItem('email');
      try {
        const response = await axiosInstance.get('/admin/users/verify/' + email);
        if (response.data) {
          setUsername(response.data.username);

          if (response.data.image_url != null) {
            setProfilePicture(import.meta.env.VITE_SITE_URL + response.data.image_url);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
    fetchData();
  }, [setUsername]);

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

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Debounced search query update
  const debouncedSetSearchQuery = useCallback(
    debounce((query) => setSearchQuery(query), 300),
    []
  );

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredPlayers = players.filter(player =>
        player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (player.display_name && player.display_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      // Combine and limit suggestions
      const combinedSuggestions = [...filteredGames, ...filteredPlayers].slice(0, 5);
      setSuggestions(combinedSuggestions);
      setHighlightedIndex(-1); // Reset highlighted index
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, games, players]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) => (prevIndex - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      handleSuggestionClick(suggestions[highlightedIndex]);
    }
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setShowFilters(false); // Close filters when opening search
    }
  };

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

  // Get a consistent color based on username
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

  // Render suggestion icon based on type
  const renderSuggestionIcon = (item: Game | Player) => {
    if ('title' in item) {
      // Game suggestion
      return item.image_data ? (
        <img
          src={import.meta.env.VITE_SITE_URL + item.image_data}
          alt={`${item.title} icon`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[#E5D4B3] text-xs">
          {item.title.substring(0, 2).toUpperCase()}
        </div>
      );
    } else {
      // Player suggestion
      return item.image_url ? (
        <img
          src={import.meta.env.VITE_SITE_URL + item.image_url}
          alt={`${item.username} avatar`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[#E5D4B3] text-xs">
          {item.username.substring(0, 2).toUpperCase()}
        </div>
      );
    }
  };

  // Handle suggestion on-click navigation yung sa endpoint
  const handleSuggestionClick = (item: Game | Player) => {
    if ('title' in item) {
      // Game suggestion
      navigate(`/game-details/${item.id}`);
    } else {
      // Player suggestion
      navigate(`/${item.username}`);
    }
    setSearchQuery(''); // Clear search after navigation
  };

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-50 bg-[#3D2E22] py-3 px-4 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)]">
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
                          onChange={(e) => debouncedSetSearchQuery(e.target.value)}
                          onKeyDown={handleKeyDown}
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
                            className={`transform transition-transform ${showFilters ? "rotate-180" : ""}`}
                            size={20}
                          />
                        </button>
                        {suggestions.length > 0 && (
                          <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded-lg mt-1 top-10 shadow-lg overflow-hidden">
                            {suggestions.some(item => 'title' in item) && (
                              <div className="p-2 text-[#3D2E22] font-bold">Games</div>
                            )}
                            {suggestions.filter(item => 'title' in item).map((item, index) => (
                              <div
                                key={`suggestion-game-${index}`}
                                className={`p-2 hover:bg-[#C8A97E] cursor-pointer text-[#3D2E22] flex items-center ${highlightedIndex === index ? 'bg-[#C8A97E]' : ''}`}
                                onClick={() => handleSuggestionClick(item)}
                              >
                                <div className="w-8 h-8 mr-2 flex-shrink-0 bg-[#3D2E22] rounded-full overflow-hidden flex items-center justify-center">
                                  {renderSuggestionIcon(item)}
                                </div>
                                <span>{item.title}</span>
                              </div>
                            ))}
                            {suggestions.some(item => 'username' in item) && (
                              <div className="p-2 text-[#3D2E22] font-bold">Players</div>
                            )}
                            {suggestions.filter(item => 'username' in item).map((item, index) => (
                              <div
                                key={`suggestion-player-${index}`}
                                className={`p-2 hover:bg-[#C8A97E] cursor-pointer text-[#3D2E22] flex items-center ${highlightedIndex === index ? 'bg-[#C8A97E]' : ''}`}
                                onClick={() => handleSuggestionClick(item)}
                              >
                                <div className="w-8 h-8 mr-2 flex-shrink-0 bg-[#3D2E22] rounded-full overflow-hidden flex items-center justify-center">
                                  {renderSuggestionIcon(item)}
                                </div>
                                <span>{item.display_name || item.username}</span>
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
                  <div className="relative w-60 sm:w-72 md:w-96 lg:w-[45rem]">
                    <input
                      type="text"
                      placeholder={getPlaceholderText()}
                      onChange={(e) => debouncedSetSearchQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="w-full p-2 pl-10 rounded-full bg-[#E5D4B3] text-[#3D2E22] placeholder-[#8B4513] border-2 border-[#C8A97E] focus:outline-none focus:border-[#8B4513]"
                    />
                    <Search
                      className="absolute left-3 top-2.5 text-[#8B4513]"
                      size={20}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded-lg mt-1 shadow-lg overflow-hidden">
                        {suggestions.some(item => 'title' in item) && (
                          <div className="p-2 text-[#3D2E22] font-bold">Games</div>
                        )}
                        {suggestions.filter(item => 'title' in item).map((item, index) => (
                          <div
                            key={`suggestion-game-${index}`}
                            className={`p-2 hover:bg-[#C8A97E] cursor-pointer text-[#3D2E22] flex items-center ${highlightedIndex === index ? 'bg-[#C8A97E]' : ''}`}
                            onClick={() => handleSuggestionClick(item)}
                          >
                            <div className="w-8 h-8 mr-2 flex-shrink-0 bg-[#3D2E22] rounded-full overflow-hidden flex items-center justify-center">
                              {renderSuggestionIcon(item)}
                            </div>
                            <span>{item.title}</span>
                          </div>
                        ))}
                        {suggestions.some(item => 'username' in item) && (
                          <div className="p-2 text-[#3D2E22] font-bold">Players</div>
                        )}
                        {suggestions.filter(item => 'username' in item).map((item, index) => (
                          <div
                            key={`suggestion-player-${index}`}
                            className={`p-2 hover:bg-[#C8A97E] cursor-pointer text-[#3D2E22] flex items-center ${highlightedIndex === index ? 'bg-[#C8A97E]' : ''}`}
                            onClick={() => handleSuggestionClick(item)}
                          >
                            <div className="w-8 h-8 mr-2 flex-shrink-0 bg-[#3D2E22] rounded-full overflow-hidden flex items-center justify-center">
                              {renderSuggestionIcon(item)}
                            </div>
                            <span>{item.display_name || item.username}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Filters Toggle for Desktop */}
                {/* {!isMobile && (
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-[#C8A97E] hover:text-[#E5D4B3]"
                  >
                    Filter
                    <ChevronDown
                      className={`ml-1 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
                      size={20}
                    />
                  </button>
                )} */}
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

                      <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Profile Picture"
                          src={profilePicture ? profilePicture : `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`}
                        />
                      </div>
                    </div>
                    <ul
                      tabIndex={0}
                      className="menu dropdown-content bg-[#3d2e22] z-[1] mt-3 p-6 shadow w-96 max-w-[20rem] h-auto rounded-t-none rounded-b-lg"
                    >
                      <li className="py-2">
                        <Link to="/home" className="flex items-center text-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                          <span>Home</span>
                        </Link>
                      </li>
                      
                      <li className="py-2">
                        <Link to={`/${username}`} className="flex items-center text-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>Profile</span>
                        </Link>
                      </li>
                      
                      <li className="py-2">
                        <Link to="/subscription" className="flex items-center text-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                          </svg>
                          <span>Subscription</span>
                        </Link>
                      </li>
                      
                      <li className="py-2">
                        <Link to="/shop" className="flex items-center text-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          <span>Buy Weavels</span>
                        </Link>
                      </li>
                      
                      <li className="py-2">
                        <button onClick={openLogoutModal} className="flex items-center text-lg w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                          </svg>
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                    )}
                  </div>
                ) : (
                  <>
                    {!isMobile && (
                      <span className="font-playfair text-[#E5D4B3]">
                        Not logged in!
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
          <LogoutModal
            isOpen={showLogoutModal}
            onClose={closeLogoutModal}
            onLogout={handleLogout}
          />
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
    </>
  );
};

export default Navbar;