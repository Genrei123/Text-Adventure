import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, ChevronUp, ChevronDown } from 'lucide-react';
import axiosInstance from '../../../config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const GamesList: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });
  const [showModal, setShowModal] = useState(false);
  const [newGame, setNewGame] = useState({
    title: '',
    genre: 'RPG',
    description: '',
    status: 'active',
    prompt: ''
  });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/api/games');
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreFilter(e.target.value);
  };

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedGames = [...games].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredGames = sortedGames.filter(game => {
    return (
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (genreFilter === 'all' || game.genre === genreFilter)
    );
  });

  const handleNewGameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewGame({ ...newGame, [name]: value });
  };

  const handleNewGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/games', newGame);
      setShowModal(false);
      fetchGames();
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />;
  };

  return (
    <div className="p-6 bg-[#2F2118] text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Games Overview</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-black rounded font-cinzel"
        >
          <Plus className="inline w-5 h-5 mr-2" /> Add New Game
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-[#1E1512] text-white pl-10 pr-4 py-2 rounded border border-[#6A4E32] focus:ring-2 focus:ring-[#6A4E32] focus:outline-none"
            placeholder="Search games..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <select
          className="bg-[#1E1512] text-white px-4 py-2 rounded border border-[#6A4E32] focus:ring-2 focus:ring-[#6A4E32] focus:outline-none"
          value={genreFilter}
          onChange={handleGenreFilterChange}
        >
          <option value="all">All Genres</option>
          <option value="RPG">RPG</option>
          <option value="Adventure">Adventure</option>
          <option value="Puzzle">Puzzle</option>
          <option value="Action">Action</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <table className="w-full text-white table-fixed">
          <thead>
            <tr className="bg-[#3D2E22] border-b border-[#2F2118]">
              <th className="py-4 px-6 font-cinzel cursor-pointer text-left" onClick={() => handleSort('title')}>
                Title {getSortIndicator('title')}
              </th>
              <th className="py-4 px-6 font-cinzel cursor-pointer text-left" onClick={() => handleSort('genre')}>
                Genre {getSortIndicator('genre')}
              </th>
              <th className="py-4 px-6 font-cinzel cursor-pointer text-left" onClick={() => handleSort('players')}>
                Players {getSortIndicator('players')}
              </th>
              <th className="py-4 px-6 font-cinzel cursor-pointer text-left" onClick={() => handleSort('createdAt')}>
                Created At {getSortIndicator('createdAt')}
              </th>
              <th className="py-4 px-6 font-cinzel cursor-pointer text-left" onClick={() => handleSort('status')}>
                Status {getSortIndicator('status')}
              </th>
              <th className="py-4 px-6 font-cinzel text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.map(game => (
              <tr key={game.id} className="bg-[#6A4E32] border-b border-[#2F2118] hover:bg-[#412e19] transition-colors">
                <td className="py-4 px-6 font-playfair text-left truncate">{game.title}</td>
                <td className="py-4 px-6 font-playfair text-left truncate">{game.genre}</td>
                <td className="py-4 px-6 font-playfair text-left">{game.players}</td>
                <td className="py-4 px-6 font-playfair text-left">{new Date(game.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-6 font-playfair text-left">{game.status}</td>
                <td className="py-4 px-6 font-playfair text-left">
                  <button onClick={() => navigate(`/admin/games/${game.id}`)} className="text-blue-500 hover:text-blue-700">
                    <Edit className="inline w-5 h-5 mr-2" /> Edit
                  </button>
                  <button onClick={() => console.log('Delete game')} className="text-red-500 hover:text-red-700 ml-4">
                    <Trash className="inline w-5 h-5 mr-2" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)} className="modal" overlayClassName="modal-overlay">
        <div className="p-6 bg-[#2F2118] text-white">
          <h2 className="text-2xl font-bold mb-6">Add New Game</h2>
          <form onSubmit={handleNewGameSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={newGame.title}
                onChange={handleNewGameChange}
                className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
              />
            </div>

            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Genre</label>
              <select
                name="genre"
                value={newGame.genre}
                onChange={handleNewGameChange}
                className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white"
              >
                <option value="RPG">RPG</option>
                <option value="Adventure">Adventure</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Description</label>
              <textarea
                name="description"
                value={newGame.description}
                onChange={handleNewGameChange}
                className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
              />
            </div>

            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Status</label>
              <select
                name="status"
                value={newGame.status}
                onChange={handleNewGameChange}
                className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-cinzel text-white mb-2">Prompt</label>
              <textarea
                name="prompt"
                value={newGame.prompt}
                onChange={handleNewGameChange}
                className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-black rounded"
              >
                Add Game
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default GamesList;