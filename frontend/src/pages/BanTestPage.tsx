import React, { useState } from 'react';
import { BanForm } from '../components/BanForm';
import { BannedPlayersList } from '../components/BannedPlayersList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../components/BanManagement.css';

/**
 * BanTestPage component to manage banning and unbanning of players.
 * This component integrates the BanForm and BannedPlayersList components
 * to provide a complete ban management interface.
 */
const BanTestPage = () => {
  const [bans, setBans] = useState([]);

  /**
   * Handles the ban action.
   * This function is called when a new ban is created using the BanForm component.
   * It updates the state with the new ban and displays a success message.
   * @param newBan - The new ban object.
   */
  const handleBan = (newBan) => {
    console.log(`Banning player: ${newBan.username}`);
    setBans(newBan); // Update the state with the new list of bans
    console.log(`Player ${newBan.username} banned successfully`);
    toast.success(`Player ${newBan.username} banned successfully`);
  };

  /**
   * Handles the unban action.
   * This function is called when a ban is removed using the BannedPlayersList component.
   * It updates the state by removing the specified ban and displays a success message.
   * @param banId - The ID of the ban to unban.
   */
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
          {/* BanForm component to create a new ban */}
          <BanForm onBan={handleBan} />
        </div>
        <div className="bg-[#2e2e2e] p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Banned Players</h2>
          {/* BannedPlayersList component to display and manage banned players */}
          <BannedPlayersList bans={bans} onUnban={handleUnban} />
        </div>
      </div>
    </div>
  );
};

export default BanTestPage;