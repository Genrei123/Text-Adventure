import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust the URL to match your backend(Lagay localhost url ng backend)

const ActivePlayerCount: React.FC = () => {
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    socket.on('playerCount', (data) => {
      setPlayerCount(data.activePlayers);
    });

    return () => {
      socket.off('playerCount');
    };
  }, []);

  return (
    <div style={{ color: 'white' }}>
      <h1>Active Player Count</h1>
      <p>Active players: {playerCount}</p>
    </div>
  );
};

export default ActivePlayerCount;