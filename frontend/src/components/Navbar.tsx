import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import socketIOClient from 'socket.io-client';
import { addPageVisits } from '../sessions/api-calls/visitedPagesSession'; // Import addPageVisits and trackPageVisit

const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL);

const Navbar = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPopularity, setSelectedPopularity] = useState("all");

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
      const sessionId = localStorage.getItem('sessionId'); // Retrieve session ID from local storage
      const pages = JSON.parse(localStorage.getItem('visitedPages') || '[]'); // Retrieve visited pages from local storage
      const localStorageData = localStorage.getItem('sessionData') || '{}'; // Retrieve session data from local storage

      if (token && email) {
        socket.emit('leave', { route: window.location.pathname, email, token });
      }

      if (sessionId && pages.length > 0) {
        // Add page visits before logging out
        await addPageVisits(sessionId, pages, localStorageData);
      }

      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("visitedPages");
      localStorage.removeItem("sessionData");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-[#3D2E22] py-2 px-4 shadow-[0_7px_3px_0_rgba(0,0,0,0.75)] z-50">
      <div className="flex flex-col space-y-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div className="hidden md:block text-xl font-cinzel text-[#C8A97E]">
            Sage.AI
          </div>

          {/* Search Bar and Filter Button - Visible only on the Home Page */}
          {isHomePage && (
            <div className="flex items-center space-x-2">
              <div className="relative w-[120%]">
                <input
                  type="text"
                  placeholder="Search the ancient scrolls..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[100%] p-2 pl-10 rounded bg-[#E5D4B3] text-[#3D2E22] placeholder-[#8B4513] border-2 border-[#C8A97E] focus:outline-none focus:border-[#8B4513]"
                />
                <Search
                  className="absolute left-3 top-2.5 text-[#8B4513]"
                  size={20}
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-50 w-full bg-[#E5D4B3] border-2 border-[#C8A97E] rounded mt-1 shadow-lg">
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

              {/* Filters Toggle */}
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
            </div>
          )}
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
  );
};

export default Navbar;