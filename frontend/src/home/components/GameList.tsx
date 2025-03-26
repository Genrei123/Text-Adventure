import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import axios from '../../../config/axiosConfig';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: string;
  title: string;
  slug: string;
  description?: string;
  tagline?: string;
  genre?: string;
  subgenre?: string;
  image_data?: string;
  primary_color?: string;
  prompt_name?: string;
  private?: boolean;
  prompt_model?: string;
  UserId?: number;
}

const GameList: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'title' | 'genre'>('title');

  // import backend url
  

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get<Game[]>('/game');
        if (response.data.length > 0) {
          const formattedGames = response.data.map((game) => ({
            ...game,
            description: game.description || 'No description available',
            genre: game.genre || 'Unspecified',
            image_data: import.meta.env.VITE_BACKEND_URL + game.image_data || 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          }));
          setGames(formattedGames);
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  const allGenres = Array.from(new Set(games.map(game => game.genre || 'Unspecified')));

  const filteredGames = games
    .filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGenres = selectedGenres.length === 0 || 
                           selectedGenres.includes(game.genre || 'Unspecified');
      return matchesSearch && matchesGenres;
    })
    .sort((a, b) => {
      if (sortBy === 'genre') return (a.genre || '').localeCompare(b.genre || '');
      return a.title.localeCompare(b.title);
    });

  const handleGenreClick = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <div className="w-[80%] mx-auto mt-12">
      {/* Section Header with Line */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center w-full">
          <h2 className="text-3xl font-cinzel text-[#C8A97E] whitespace-nowrap mr-6">
            Available Games
          </h2>
          <div className="h-1 bg-[#C8A97E] flex-grow"></div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-[#1e1e1e] w-full p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
          {/* Search Input */}
          <div className="relative w-full md:w-auto">
            {/* gagamit paba ng ganto? may scrollbar namaan */}
            <input
              type="text"
              placeholder="Search your destiny..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-3 bg-[#2A2A2A] border border-[#C8A97E] rounded-lg text-[#E5D4B3] placeholder-[#8B7355] focus:outline-none focus:ring-2 focus:ring-[#C8A97E] font-playfair"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C8A97E]" size={20} />
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'title' | 'genre')}
            className="px-4 py-3 bg-[#2A2A2A] border border-[#C8A97E] rounded-lg text-[#E5D4B3] focus:outline-none focus:ring-2 focus:ring-[#C8A97E] font-cinzel cursor-pointer"
          >
            <option value="title">Sort by Title</option>
            <option value="genre">Sort by Genre</option>
          </select>
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-3">
          {allGenres.map(genre => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`px-6 py-2 rounded-lg font-cinzel text-sm transition-all duration-300 ${
                selectedGenres.includes(genre)
                  ? 'bg-[#C8A97E] text-[#1E1E1E] hover:bg-[#D8B98E]'
                  : 'bg-[#2A2A2A] text-[#C8A97E] border border-[#C8A97E] hover:bg-[#C8A97E] hover:text-[#1E1E1E]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="bg-[#1e1e1e] w-full p-4 max-h-[1240px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#C8A97E] scrollbar-track-[#2A2A2A]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {filteredGames.map(game => (
            <div 
              onClick={() => navigate(`/game-details/${game.id}`)} 
              key={game.id} 
              className="relative group cursor-pointer"
            >
              <div 
                className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl"
                style={{ backgroundColor: game.primary_color || '#1E1E1E' }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300"></div>
                
                {/* Image */}
                <img 
                  src={game.image_data} 
                  alt={game.title} 
                  className="w-full h-full object-cover"
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-cinzel font-extrabold text-[#F1E3C6] mb-2">
                    {game.title}
                  </h3>
                  <p className="text-lg font-playfair text-[#FFFBEA] mb-4 line-clamp-2">
                    {game.tagline || game.description}
                  </p>

                  {/* Additional Info */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#F1E3C6] font-cinzel">
                      📋 {game.genre || 'Unspecified'}
                    </span>
                    {game.subgenre && (
                      <span className="text-[#F1E3C6] font-cinzel">
                        🏷️ {game.subgenre}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameList;