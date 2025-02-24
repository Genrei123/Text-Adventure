import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { searchUsers } from '../api/banApi';

type BanReason = 'spamming' | 'hacked' | 'server_rules' | 'cheating' | 'other' | 'abusive language';

interface BanFormProps {
  onBan: (newBan: any) => void;
}

export const BanForm: React.FC<BanFormProps> = ({ onBan }) => {
  const [formData, setFormData] = useState({
    username: '',
    reason: 'spamming' as BanReason,
    banType: 'temporary' as 'temporary' | 'permanent',
    endDate: '',
    otherReason: ''
  });
  const [userSuggestions, setUserSuggestions] = useState<{ id: number, username: string }[]>([]);

  useEffect(() => {
    if (formData.username) {
      const fetchUsers = async () => {
        try {
          const users = await searchUsers(formData.username);
          setUserSuggestions(users);
        } catch (error) {
          console.error('Error fetching user suggestions:', error);
        }
      };
      fetchUsers();
    } else {
      setUserSuggestions([]);
    }
  }, [formData.username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username) {
      console.error('[BAN ERROR] Username required');
      toast.error('Username is required');
      return;
    }

    const selectedUser = userSuggestions.find(user => user.username === formData.username);
    if (!selectedUser) {
      console.error('[BAN ERROR] Invalid username');
      toast.error('Invalid username');
      return;
    }
    
    if (formData.banType === 'temporary') {
      if (!formData.endDate) {
        console.error('[BAN ERROR] End date required for temporary bans');
        toast.error('End date is required for temporary bans');
        return;
      }

      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to the start of the day
      if (endDate < today) {
        console.error('[BAN ERROR] End date cannot be in the past');
        toast.error('End date cannot be in the past');
        return;
      }
    }

    const reason = formData.reason === 'other' ? formData.otherReason : formData.reason;

    // Mock API call
    const newBan = {
      id: Math.random().toString(36).substr(2, 9),
      userId: selectedUser.id,
      ...formData,
      reason,
      timestamp: new Date().toISOString()
    };
    onBan(newBan);

    // Reset form
    setFormData({
      username: '',
      reason: 'spamming',
      banType: 'temporary',
      endDate: '',
      otherReason: ''
    });
  };

  const todayDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[#B39C7D] mb-2">Username:</label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full p-2 rounded bg-[#1e1e1e] text-[#ffffff]"
        />
        {userSuggestions.length > 0 && (
          <ul className="bg-[#2e2e2e] rounded-lg shadow-lg p-2 mt-2">
            {userSuggestions.map((user) => (
              <li
                key={user.id}
                onClick={() => setFormData({ ...formData, username: user.username })}
                className="cursor-pointer p-2 hover:bg-[#1e1e1e] text-[#ffffff]"
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <label className="block text-[#B39C7D] mb-2">Reason:</label>
        <select
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value as BanReason })}
          className="w-full p-2 rounded bg-[#1e1e1e] text-[#ffffff]"
        >
          <option value="spamming">Spamming</option>
          <option value="hacked">Hacked</option>
          <option value="server_rules">Server Rules</option>
          <option value="cheating">Cheating</option>
          <option value="abusive language">Abusive Language</option>
          <option value="other">Other</option>
        </select>
      </div>
      {formData.reason === 'other' && (
        <div>
          <label className="block text-[#B39C7D] mb-2">Other Reason:</label>
          <input
            type="text"
            value={formData.otherReason}
            onChange={(e) => setFormData({ ...formData, otherReason: e.target.value })}
            className="w-full p-2 rounded bg-[#1e1e1e] text-[#ffffff]"
          />
        </div>
      )}
      <div>
        <label className="block text-[#B39C7D] mb-2">Ban Type:</label>
        <select
          value={formData.banType}
          onChange={(e) => setFormData({ ...formData, banType: e.target.value as 'temporary' | 'permanent' })}
          className="w-full p-2 rounded bg-[#1e1e1e] text-[#ffffff]"
        >
          <option value="temporary">Temporary</option>
          <option value="permanent">Permanent</option>
        </select>
      </div>
      {formData.banType === 'temporary' && (
        <div>
          <label className="block text-[#B39C7D] mb-2">End Date:</label>
          <input
            type="date"
            value={formData.endDate}
            min={todayDate} // Set the minimum date to today
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full p-2 rounded bg-[#1e1e1e] text-[#ffffff]"
          />
        </div>
      )}
      <button type="submit" className="w-full py-2 bg-[#B39C7D] text-[#1e1e1e] rounded hover:bg-[#ffffff] transition-colors duration-300">
        Ban
      </button>
    </form>
  );
};

export default BanForm;