import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axiosConfig';

const GameForm: React.FC = () => {
  const navigate = useNavigate();
  const [game, setGame] = useState({
    title: '',
    genre: 'RPG',
    description: '',
    status: 'active',
    prompt: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGame({ ...game, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/games', game);
      navigate('/admin/games');
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  return (
    <div className="p-6 bg-[#2F2118] text-white">
      <h1 className="text-3xl font-bold mb-6">Add New Game</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-cinzel text-white mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={game.title}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
          />
        </div>

        <div>
          <label className="block text-sm font-cinzel text-white mb-2">Genre</label>
          <select
            name="genre"
            value={game.genre}
            onChange={handleChange}
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
            value={game.description}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
          />
        </div>

        <div>
          <label className="block text-sm font-cinzel text-white mb-2">Status</label>
          <select
            name="status"
            value={game.status}
            onChange={handleChange}
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
            value={game.prompt}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#3D2E22] border rounded text-sm text-white placeholder-[#8B7355]"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/admin/games')}
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
  );
};

export default GameForm;