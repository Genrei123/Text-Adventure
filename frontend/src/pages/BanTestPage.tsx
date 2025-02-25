import React, { useState } from 'react';
import { BanForm } from '../components/BanForm';
import { BannedPlayersList } from '../components/BannedPlayersList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/BanManagement.css';

const BanTestPage = () => {
  const [bans, setBans] = useState([]);

  const handleBan = (newBan) => {
    console.log(`Banning player: ${newBan.username}`);
    setBans([...bans, newBan]);
    console.log(`Player ${newBan.username} banned successfully`);
    toast.success(`Player ${newBan.username} banned successfully`);
  };

  const handleUnban = (banId) => {
    setBans(bans.filter(ban => ban.id !== banId));
    toast.success(`Player with ID ${banId} unbanned successfully`);
  };

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
          <BannedPlayersList bans={bans} onUnban={handleUnban} />
        </div>
      </div>
    </div>
  );
};

export default BanTestPage;