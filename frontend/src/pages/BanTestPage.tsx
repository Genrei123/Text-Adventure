import React, { useState } from 'react';
import { BanForm } from '../components/BanForm';
import { BannedPlayersList } from '../components/BannedPlayersList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/BanManagement.css';

const BanTestPage = () => {
  const [bans, setBans] = useState([
    {
      id: '1',
      username: 'PP_Namias',
      reason: 'spamming',
      banType: 'temporary',
      endDate: '2025-12-31T00:00'
    },
    {
      id: '2',
      username: 'Garvy_rens',
      reason: 'hacked',
      banType: 'permanent'
    },
    {
      id: '3',
      username: 'test_user3',
      reason: 'server_rules',
      banType: 'temporary',
      endDate: '2024-11-30T00:00'
    },
    {
      id: '4',
      username: 'test_user4',
      reason: 'cheating',
      banType: 'permanent'
    },
    {
      id: '5',
      username: 'test_user5',
      reason: 'other',
      banType: 'temporary',
      endDate: '2024-10-31T00:00'
    },
    {
      id: '6',
      username: 'test_user6',
      reason: 'abusive language',
      banType: 'temporary',
      endDate: '2024-09-30T00:00'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showModal, setShowModal] = useState(false);
  const [selectedBanId, setSelectedBanId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  const handleBan = (newBan) => {
    console.log(`Banning player: ${newBan.username}`);
    setBans([...bans, newBan]);
    console.log(`Player ${newBan.username} banned successfully`);
    toast.success(`Player ${newBan.username} banned successfully`);
  };

  const handleUnban = (banId) => {
    setSelectedBanId(banId);
    setShowModal(true);
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown === 1) {
          clearInterval(interval);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const confirmUnban = () => {
    if (selectedBanId) {
      performUnban(selectedBanId);
      setShowModal(false);
    }
  };

  const performUnban = async (banId) => {
    console.log(`Unbanning player with ID: ${banId}`);
    setBans(bans.filter(ban => ban.id !== banId));
    console.log(`Player with ID ${banId} unbanned successfully`);
    toast.success(`Player with ID ${banId} unbanned successfully`);
  };

  const filteredBans = bans
    .filter(ban =>
      ban.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!a.endDate || !b.endDate) return 0;
      const dateA = new Date(a.endDate).getTime();
      const dateB = new Date(b.endDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="ban-test-page">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Ban Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2e2e2e] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Ban a Player</h2>
          <BanForm onBan={handleBan} />
        </div>
        <div className="bg-[#2e2e2e] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Banned Players</h2>
          <input
            type="text"
            placeholder="Search by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mb-4 rounded bg-[#1e1e1e] text-[#ffffff]"
          />
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#B39C7D]">Sort by remaining days:</span>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300"
            >
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </button>
          </div>
          <BannedPlayersList bans={filteredBans} onUnban={handleUnban} />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#2e2e2e] p-6 rounded-lg shadow-lg">
            <p className="text-white mb-4">Are you sure you want to unban this player?</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-[#B39C7D]">You can confirm in {countdown} seconds</span>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300"
                disabled={countdown > 0}
                onClick={confirmUnban}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300 ml-2"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanTestPage;