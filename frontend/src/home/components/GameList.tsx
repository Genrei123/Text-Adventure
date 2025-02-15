import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  genre: string[];
  imageUrl: string;
  rating?: number;
  playCount?: number;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      title: 'Dragon Quest',
      description: 'An epic adventure in a magical realm',
      genre: ['Fantasy', 'RPG', 'Adventure'],
      imageUrl: 'https://images.unsplash.com/photo-1601987077677-5346c0c57d3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      rating: 4.5,
      playCount: 1200
    },
    // Add more sample games
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'playCount' | 'title'>('rating');

  const allGenres = Array.from(new Set(games.flatMap(game => game.genre)));

  const filteredGames = games
    .filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenres = selectedGenres.length === 0 || 
                           selectedGenres.some(genre => game.genre.includes(genre));
      return matchesSearch && matchesGenres;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'playCount') return (b.playCount || 0) - (a.playCount || 0);
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
    <div className="w-[90%] mx-auto mt-12">
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
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'playCount' | 'title')}
            className="px-4 py-3 bg-[#2A2A2A] border border-[#C8A97E] rounded-lg text-[#E5D4B3] focus:outline-none focus:ring-2 focus:ring-[#C8A97E] font-cinzel cursor-pointer"
          >
            <option value="rating">Sort by Rating</option>
            <option value="playCount">Sort by Popularity</option>
            <option value="title">Sort by Title</option>
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
              key={game.id} 
              className="relative group cursor-pointer"
            >
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300"></div>
                
                {/* Image */}
                <img 
                  src={game.imageUrl} 
                  alt={game.title} 
                  className="w-full h-full object-cover"
                />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-cinzel font-extrabold text-[#F1E3C6] mb-2">
                    {game.title}
                  </h3>
                  <p className="text-lg font-playfair text-[#FFFBEA] mb-4">
                    {game.description}
                  </p>
                  
                  {/* Genre Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {game.genre.map(g => (
                      <span 
                        key={g} 
                        className="px-3 py-1 bg-[#C8A97E]/20 border border-[#C8A97E] text-[#F1E3C6] rounded-lg text-sm font-cinzel"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex justify-between items-center">
                    <span className="text-[#F1E3C6] font-cinzel">
                      ⭐ {game.rating?.toFixed(1)}
                    </span>
                    <span className="text-[#F1E3C6] font-cinzel">
                      👥 {game.playCount?.toLocaleString()}
                    </span>
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