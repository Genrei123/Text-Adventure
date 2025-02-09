import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useFetch from '../hooks/useFetch';
import FilterPanel from './FilterPanel';

const AdminPanel: React.FC = () => {
  const { data, error } = useFetch('/api/admin/players');
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (data) setPlayers(data);
    if (error) toast.error(error.message);
  }, [data, error]);

  return (
    <div>
      <FilterPanel />
      <div>
        {players.map((player) => (
          <div key={player.id}>{player.username}</div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;