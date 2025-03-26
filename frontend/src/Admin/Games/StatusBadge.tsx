import React from 'react';

const StatusBadge: React.FC<{ status?: string }> = ({ status = 'unknown' }) => (
  <span className={`px-3 py-1 rounded-full text-sm ${
    status === 'active' 
      ? 'bg-green-900/20 text-green-400 border border-green-400'
      : status === 'inactive'
      ? 'bg-gray-800/20 text-gray-400 border border-gray-500'
      : 'bg-yellow-800/20 text-yellow-400 border border-yellow-500'
  }`}>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default StatusBadge;