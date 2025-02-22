import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const ActivePlayerCount: React.FC = () => {
  const [playerCount, setPlayerCount] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const response = await axios.get(`${import.meta.env.BASE_URL}/statistics/statsRoutes/player-stats`);
        setPlayerCount(response.data.activePlayers);
        console.log(`Active players: ${response.data.activePlayers}`);
      } catch (error) {
        console.error('Error fetching player count:', error);
      }
    };

    fetchPlayerCount();

    intervalRef.current = setInterval(fetchPlayerCount, 5000); // Poll every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div style={{ color: 'white', padding: '20px', borderRadius: '8px' }}>
      <h1>Active Player Count</h1>
      <p>Active players: {playerCount}</p>
    </div>
  );
};

export default ActivePlayerCount;