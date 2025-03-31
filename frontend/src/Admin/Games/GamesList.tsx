import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, ChevronUp, ChevronDown, Eye, Power, Sliders } from 'lucide-react';
import axiosInstance from '../../../config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import StatusBadge from './StatusBadge';
import Loader from './Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';

// Set app element for React-Modal
Modal.setAppElement('#root');

interface Game {
  id: number;
  title: string;
  genre: string;
  createdAt: string;
  status: string;
  UserId: number;
  creator?: string; // Add creator field
  description?: string;
  tagline?: string;
  prompt_name?: string;
  prompt_text?: string;
  image_data?: string;
  primary_color?: string;
  music_prompt_text?: string;
  music_prompt_seed_image?: string;
  image_prompt_text?: string;
  image_prompt_model?: string;
  private?: boolean;
}

interface User {
  id: number;
  username: string;
}

const GamesList: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Game; direction: 'asc' | 'desc' }>({
    key: 'title',
    direction: 'asc'
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedGames, setSelectedGames] = useState<number[]>([]);
  const [newGame, setNewGame] = useState({
    title: '',
    genre: 'RPG',
    description: '',
    status: 'active',
    prompt: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);

  const allSelected = selectedGames.length === games.length;

  const toggleSelectAll = () => {
    setSelectedGames(allSelected ? [] : games.map(game => game.id));
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const [gamesResponse, usersResponse] = await Promise.all([
        axiosInstance.get('/api/games/all'),
        axiosInstance.get('/admin/users'),
      ]);

      const userMap = new Map<number, string>();
      (usersResponse.data || []).forEach((user: User) => {
        userMap.set(user.id, user.username);
      });

      const enrichedGames = gamesResponse.data.map((game: Game) => ({
        ...game,
        creator: userMap.get(game.UserId) || 'Unknown',
      }));

      setGames(enrichedGames);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load game data');
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

  const handleSort = (key: keyof Game) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedGames = [...games].sort((a, b) => {
    if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === 'asc' ? -1 : 1;
    if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === 'asc' ? 1 : -1;
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
    return sortConfig.direction === 'asc' ? <ChevronUp className="inline w-4 h-4" /> : <ChevronDown className="inline w-4 h-4" />;
  };

  const handleSelectGame = (id: number) => {
    setSelectedGames(prev => prev.includes(id) ? prev.filter(gameId => gameId !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    try {
      await axiosInstance.delete('/api/games/bulk-delete', { data: { ids: selectedGames } });
      setSelectedGames([]);
      fetchGames();
    } catch (error) {
      console.error('Error deleting games:', error);
    }
  };

  const handleToggleStatus = async (game: any) => {
    try {
      const updatedStatus = game.status === 'active' ? 'inactive' : 'active';
      await axiosInstance.put(`/api/games/${game.id}`, { ...game, status: updatedStatus });
      fetchGames();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/games/${id}`);
      fetchGames();
    } catch (error) {
      console.error('Error deleting game:', error);
    }
  };

  const handleViewGame = (game: Game) => {
    console.log('Opening View Modal for:', game);
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const closeGameModal = () => {
    setShowGameModal(false);
    setSelectedGame(null); // Reset selected game
  };

  // Enhanced Table Header Component
  const TableHeader = ({ label, sortKey }: { label: string; sortKey: keyof Game }) => (
    <th
      className="sticky top-0 p-4 bg-[#3D2E22] font-cinzel text-center cursor-pointer hover:bg-[#534231] transition-colors group"
      onClick={() => handleSort(sortKey)}
      aria-sort={sortConfig.key === sortKey ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <div className="flex items-center justify-center gap-2">
        <span className="text-[#F0E6DB]">{label}</span>
        <span className={`text-[#C0A080] transition-opacity ${
          sortConfig.key === sortKey ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
        }`}>
          {sortConfig.key === sortKey ? (
            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4 opacity-0" />
          )}
        </span>
      </div>
    </th>
  );

  const AdvancedFilters = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#2F2118] rounded-lg border border-[#6A4E32]/50 mb-6">
      <div>
        <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Status</label>
        <select
          className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Start Date</label>
        <input
          type="date"
          className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-cinzel text-[#C0A080] mb-2">End Date</label>
        <input
          type="date"
          className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        />
      </div>
    </div>
  );

  const NewGameModal = () => (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      className="modal-content bg-[#2F2118] p-8 rounded-xl max-w-2xl mx-4"
      overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#6A4E32]/50 pb-4">
          <h2 className="text-2xl font-cinzel text-[#F0E6DB]">Create New Game</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-[#8B7355] hover:text-[#C0A080] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleNewGameSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Title *</label>
              <input
                type="text"
                name="title"
                required
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                value={newGame.title}
                onChange={handleNewGameChange}
              />
            </div>

            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Genre *</label>
              <select
                name="genre"
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                value={newGame.genre}
                onChange={handleNewGameChange}
              >
                <option value="RPG">RPG</option>
                <option value="Adventure">Adventure</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Status *</label>
              <select
                name="status"
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                value={newGame.status}
                onChange={handleNewGameChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-cinzel text-[#C0A080] mb-2">Primary Prompt</label>
              <textarea
                name="prompt"
                className="w-full bg-[#1E1512] text-[#F0E6DB] px-3 py-2 rounded border border-[#6A4E32]/50 focus:ring-2 focus:ring-[#C0A080] focus:outline-none h-32"
                value={newGame.prompt}
                onChange={handleNewGameChange}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end space-x-4 border-t border-[#6A4E32]/50 pt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Game
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );

  const GameDetailModal: React.FC<{ game: Game; onClose: () => void }> = ({ game, onClose }) => (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      className="modal-content bg-[#2F2118] p-8 rounded-xl max-w-4xl mx-4"
      overlayClassName="modal-overlay fixed inset-0 bg-black/75 flex items-center justify-center"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#6A4E32]/50 pb-4">
          <h2 className="text-2xl font-cinzel text-[#F0E6DB]">{game.title}</h2>
          <button
            onClick={onClose}
            className="text-[#8B7355] hover:text-[#C0A080] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[#C0A080]">Genre:</p>
            <p className="text-[#F0E6DB]">{game.genre}</p>
          </div>
          <div>
            <p className="text-sm text-[#C0A080]">Created At:</p>
            <p className="text-[#F0E6DB]">{new Date(game.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-[#C0A080]">Description:</p>
            <p className="text-[#F0E6DB]">{game.description || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-[#C0A080]">Tagline:</p>
            <p className="text-[#F0E6DB]">{game.tagline || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-[#C0A080]">Prompt Name:</p>
            <p className="text-[#F0E6DB]">{game.prompt_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-[#C0A080]">Prompt Text:</p>
            <p className="text-[#F0E6DB]">{game.prompt_text || 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-[#C0A080]">Music Prompt:</p>
            <p className="text-[#F0E6DB]">{game.music_prompt_text || 'N/A'}</p>
          </div>
        </div>

        {game.image_data && (
          <div>
            <p className="text-sm text-[#C0A080]">Image:</p>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${game.image_data}`}
              alt={game.title}
              className="w-full rounded-lg"
            />
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-black rounded font-cinzel"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="p-6 bg-[#2F2118] text-[#F0E6DB] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold mb-2">Game Management</h1>
          <p className="text-[#8B7355]">Manage all game content and configurations</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#C0A080] hover:bg-[#D5B591] text-[#2F2118] rounded-lg font-cinzel flex items-center gap-2 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Game
          </button>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 bg-[#3D2E22] hover:bg-[#4D3E32] text-[#F0E6DB] rounded-lg flex items-center gap-2"
          >
            <Sliders className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      {showAdvancedFilters && <AdvancedFilters />}

      {isLoading ? (
        <Loader message="Loading games..." />
      ) : (
        <div className="rounded-xl overflow-hidden border border-[#6A4E32]/50 shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#3D2E22]">
                <tr>
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      className="w-5 h-5 cursor-pointer accent-[#C0A080]"
                      onChange={toggleSelectAll}
                      checked={allSelected}
                    />
                  </th>
                  <TableHeader label="Title" sortKey="title" />
                  <TableHeader label="Genre" sortKey="genre" />
                  <TableHeader label="Players" sortKey="creator" />
                  <TableHeader label="Created" sortKey="createdAt" />
                  <TableHeader label="Status" sortKey="status" />
                  <th className="sticky top-0 p-4 bg-[#3D2E22] font-cinzel text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredGames.map(game => (
                    <motion.tr
                      key={game.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="group even:bg-[#2F2118] odd:bg-[#3D2E22]/80 hover:bg-[#534231] transition-colors"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedGames.includes(game.id)}
                          onChange={() => handleSelectGame(game.id)}
                          className="w-5 h-5 cursor-pointer accent-[#C0A080]"
                        />
                      </td>
                      <td className="p-4 font-playfair max-w-xs truncate group-hover:text-[#C0A080] transition-colors">
                        {game.title}
                      </td>
                      <td className="p-4 font-playfair">{game.genre}</td>
                      <td className="p-4 font-playfair text-center">{game.creator}</td>
                      <td className="p-4 font-playfair">
                        {new Date(game.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={game.status} />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleViewGame(game)}
                            className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-[#C0A080] focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                            title="View"
                            aria-label={`View ${game.title}`}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/games/${game.id}/edit`)}
                            className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-[#C0A080] focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                            title="Edit"
                            aria-label={`Edit ${game.title}`}
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(game)}
                            className="p-2 hover:bg-[#6A4E32]/50 rounded-lg text-[#C0A080] focus:ring-2 focus:ring-[#C0A080] focus:outline-none"
                            title="Toggle Status"
                            aria-label={`Toggle status of ${game.title}`}
                          >
                            <Power className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(game.id)}
                            className="p-2 hover:bg-red-900/20 rounded-lg text-red-400 focus:ring-2 focus:ring-red-400 focus:outline-none"
                            title="Delete"
                            aria-label={`Delete ${game.title}`}
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredGames.length === 0 && (
            <div className="p-8 text-center text-[#8B7355]">
              No games found matching your criteria
            </div>
          )}
        </div>
      )}

      <NewGameModal />

      {showGameModal && selectedGame && (
        <GameDetailModal game={selectedGame} onClose={closeGameModal} />
      )}

      {/* Add sticky bulk action bar */}
      {selectedGames.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-4 right-4 bg-[#3D2E22] p-4 rounded-lg shadow-xl flex gap-2 items-center"
        >
          <span className="text-sm text-[#C0A080]">
            {selectedGames.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="px-3 py-1 bg-red-700/20 hover:bg-red-800/30 text-red-400 rounded flex items-center gap-1"
          >
            <Trash className="w-4 h-4" />
            Delete
          </button>
        </motion.div>
      )}
      <ToastContainer />
    </div>
  );
};

export default GamesList;