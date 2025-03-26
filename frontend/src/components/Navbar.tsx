import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, ChevronDown, X, LogOut, User } from "lucide-react";
import socketIOClient from 'socket.io-client';
import axiosInstance from "../../config/axiosConfig";
import { Link } from 'react-router-dom';

const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL);

interface Game {
  id: number;
  title: string;
  slug: string;
  genre: string;
  subgenre: string;
  image_data?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  image_url?: string;
}

interface NavbarProps {
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<(Game | User)[]>([]); 
  const [searchType, setSearchType] = useState<'games' | 'users'>('games');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPopularity, setSelectedPopularity] = useState("all");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>();
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = windowWidth < 768;

  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/home";

  // Extract unique genres and subgenres from actual data
  const genres = [...new Set(games.map(game => game.genre))].filter(Boolean);
  const tags = [...new Set(games.map(game => game.subgenre))].filter(Boolean);

  const popularityOptions = [
    { label: "Past Day", value: "1day" },
    { label: "Past Moon", value: "30days" },
    { label: "Past Year", value: "1year" },
    { label: "All Time", value: "all" },
  ];

  // Function to search users
  const searchUsers = async (query: string) => {
    try {
      const response = await axiosInstance.get(`/admin/users/`);
      if (response.data) {
        let filteredUsers = response.data;
        if (query) {
          filteredUsers = filteredUsers.filter((user: User) =>
            Object.values(user).some((value) =>
              value.toLowerCase().includes(query.toLowerCase())
            )
          );
        }
        setUserSearchResults(filteredUsers);
        return filteredUsers;
      } else {
        console.error('Failed to search users');
        return [];
      }
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  // Fetch games and users data from API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axiosInstance.get('/game/');
        if (response.data) {
          setGames(response.data);
        } else {
          console.error('Failed to fetch games');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/users/');
        if (response.data) {
          setUsers(response.data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
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
          } else {
            setProfilePicture('/default-profile.png'); // Set default profile picture
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchUserData();
    fetchGames();
    fetchUsers();
  }, []);

  // Resize and search suggestion effects
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

  // Update suggestions based on search query and type
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 0) {
        let filteredResults: (Game | User)[] = [];

        if (searchType === 'games') {
          filteredResults = games.filter(game =>
            game.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          // Use server-side search for users
          const searchedUsers = await searchUsers(searchQuery);
          filteredResults = searchedUsers;
        }

        setSuggestions(filteredResults);
        setNoResultsMessage(filteredResults.length === 0 ? 'No results found' : null);
      } else {
        setSuggestions([]);
        setNoResultsMessage(null);
      }
    };

    fetchSuggestions();
  }, [searchQuery, games, users, searchType]);

  // Handle Enter key press in search input
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (suggestions.length === 0) {
        setNoResultsMessage('No results found');
      } else {
        setNoResultsMessage(null);
      }
    }
  };

  // Logout handler
  const handleLogout = async () => {
    if (onLogout) {
      await axiosInstance.post('/auth/logout', {
        email: localStorage.getItem('email'),
      });

      localStorage.removeItem('userData');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      setUsername(null);
      await onLogout();
    }
  };

  // Modal and search toggle handlers
  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);
  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setShowFilters(false);
    }
  };

  // Profile color and initial generation
  const getInitials = () => {
    if (!username) return "?";
    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getProfileColor = () => {
    if (!username) return "#8B4513";

    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 60 + 30;
    const saturation = 70 + (Math.abs(hash) % 30);
    const lightness = 40 + (Math.abs(hash) % 20);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Render search suggestions
  const renderSearchSuggestions = () => {
    return suggestions.map((item, index) => (
      <div
        key={index}
        className="p-2 hover:bg-[#C8A97E] cursor-pointer text-[#3D2E22] flex items-center"
        onClick={() => {
          if ('title' in item) {
            navigate(`/game-details/${item.id}`);
          } else {
            navigate(`/${item.username}`);
          }
        }}
      >
        <div className="w-8 h-8 mr-2 flex-shrink-0 bg-[#3D2E22] rounded-full overflow-hidden flex items-center justify-center">
          {'title' in item ? (
            item.image_data ? (
              <img
                src={item.image_data}
                alt={`${item.title} icon`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#E5D4B3] text-xs">
                {item.title.substring(0, 2).toUpperCase()}
              </div>
            )
          ) : (
            item.image_url ? (
              <img
                src={import.meta.env.VITE_SITE_URL + item.image_url}
                alt={`${item.username} avatar`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#E5D4B3] text-xs">
                {item.username.substring(0, 2).toUpperCase()}
              </div>
            )
          )}
        </div>
        <span>
          {'title' in item ? item.title : item.username}
        </span>
      </div>
    ));
  };

  return (
    <>
      <nav className="sticky top-0 left-0 w-full z-50 bg-[#3D2E22] py-2 px-4 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)]">
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
                          onKeyPress={handleSearchKeyPress}
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
                        {suggestions.length > 0 ? (
                          <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded-lg mt-1 top-10 shadow-lg overflow-hidden">
                            {renderSearchSuggestions()}
                          </div>
                        ) : (
                          noResultsMessage && (
                            <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded-lg mt-1 top-10 shadow-lg overflow-hidden text-[#3D2E22] p-2 text-center">
                              {noResultsMessage}
                            </div>
                          )
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
                    <div className="absolute left-0 top-0 mt-1 ml-10 flex items-center space-x-2">
                      <button
                        onClick={() => setSearchType('games')}
                        className={`text-xs ${searchType === 'games' ? 'text-[#E5D4B3] underline' : 'text-[#8B4513]'}`}
                      >
                        Games
                      </button>
                      <button
                        onClick={() => setSearchType('users')}
                        className={`text-xs ${searchType === 'users' ? 'text-[#E5D4B3] underline' : 'text-[#8B4513]'}`}
                      >
                        Users
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder={searchType === 'games' ? "Search the ancient scrolls..." : "Seek a fellow adventurer..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      className="w-full p-2 pl-10 rounded-full bg-[#E5D4B3] text-[#3D2E22] placeholder-[#8B4513] border-2 border-[#C8A97E] focus:outline-none focus:border-[#8B4513] pt-6"
                    />
                    <Search
                      className="absolute left-3 top-6 text-[#8B4513]"
                      size={20}
                    />
                    {suggestions.length > 0 ? (
                      <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded-lg mt-1 shadow-lg overflow-hidden">
                        {renderSearchSuggestions()}
                      </div>
                    ) : (
                      noResultsMessage && (
                        <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded-lg mt-1 top-10 shadow-lg overflow-hidden text-[#3D2E22] p-2 text-center">
                          {noResultsMessage}
                        </div>
                      )
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
                      className={`ml-1 transform transition-transform ${showFilters ? "rotate-180" : ""}`}
                      size={20}
                    />
                  </button>
                )}
              </div>
            )}

            {/* Theme toggle and User section - Hidden when search is expanded on mobile */}
            {!(isMobile && isSearchExpanded) && (
              <div className="flex items-center space-x-2">
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
                              src={profilePicture ? profilePicture : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            />
                          </div>
                        </div>
                        <ul
                          tabIndex={0}
                          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                        >
                          <li>
                            <Link to={`/${username}`}>
                              <a>Profile</a>
                            </Link>
                          </li>
                          <li>
                            <Link to="/subscription">
                              <a>Subscription</a>
                            </Link>
                          </li>
                          <li>
                            <a onClick={openLogoutModal}>Logout</a>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
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