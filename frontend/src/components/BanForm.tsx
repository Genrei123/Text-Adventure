import React, { useState } from 'react';

type BanReason = 'spamming' | 'hacked' | 'server_rules' | 'cheating' | 'other' | 'abusive language';

interface BanFormProps {
  onBan: (newBan: any) => void;
}

export const BanForm: React.FC<BanFormProps> = ({ onBan }) => {
  const [formData, setFormData] = useState({
    username: '',
    reason: 'spamming' as BanReason,
    banType: 'temporary' as 'temporary' | 'permanent',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.username) {
      console.error('[BAN ERROR] Username required');
      return;
    }
    
    if (formData.banType === 'temporary' && !formData.endDate) {
      console.error('[BAN ERROR] End date required for temporary bans');
      return;
    }

    // Mock API call
    const newBan = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      timestamp: new Date().toISOString()
    };
    onBan(newBan);

    // Reset form
    setFormData({
      username: '',
      reason: 'spamming',
      banType: 'temporary',
      endDate: ''
    });
  };

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
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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