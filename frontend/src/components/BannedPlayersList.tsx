import React, { useEffect, useState } from 'react';
import { fetchBans } from '../api/banApi';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

type BanRecord = {
  id: string;
  userId: number;
  username: string;
  reason: string;
  banType: 'temporary' | 'permanent';
  endDate?: string;
};

interface BannedPlayersListProps {
  onUnban: (banId: string) => void;
}

const reasonColors = {
  spamming: '#FF6347',
  hacked: '#FF4500',
  server_rules: '#FFD700',
  cheating: '#ADFF2F',
  abusive_language: '#FF69B4',
  other: '#87CEEB'
};

/**
 * BannedPlayersList component to display the list of banned players.
 * @param onUnban - Callback function to handle the unban action.
 */
export const BannedPlayersList: React.FC<BannedPlayersListProps> = ({ onUnban }) => {
  const [bans, setBans] = useState<BanRecord[]>([]);

  /**
   * Fetches the list of banned players from the server.
   * This function is called when the component is mounted.
   */
  useEffect(() => {
    const getBans = async () => {
      try {
        const data = await fetchBans();
        setBans(data);
      } catch (error) {
        console.error('Error fetching bans:', error);
        toast.error('Error fetching bans');
      }
    };
    getBans();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Banned Players ({bans.length})</h2>
      <div className="bans-list max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-[#B39C7D] scrollbar-track-[#1e1e1e]">
        {bans.map((ban) => (
          <div key={ban.id} className="ban-item bg-[#1e1e1e] p-4 rounded-lg mb-2 flex justify-between items-center">
            <div className="text-left"> {/* Ensure text is aligned to the left */}
              <span className="block text-[#B39C7D] font-semibold text-lg">{ban.username}</span> {/* Display username */}
              <span className="block text-[#ffffff] text-sm" style={{ color: reasonColors[ban.reason] }}>{ban.reason}</span>
              <span className="block text-[#ffffff] text-sm">{ban.banType}</span>
              {ban.endDate && (
                <span className="block text-[#ffffff] text-sm">
                  {new Date(ban.endDate).toLocaleDateString()} ({formatDistanceToNow(new Date(ban.endDate))} remaining)
                </span>
              )}
            </div>
            <button onClick={() => onUnban(ban.id)} className="px-4 py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300">
              Unban
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannedPlayersList;