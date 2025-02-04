import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://orange-space-engine-66r5v9667p5h46qr-3000.app.github.dev'); // Adjust the URL to match your backend

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
    <div>
      <h1>Active Player Count</h1>
      <p>Active players: {playerCount}</p>
    </div>
  );
};

export default ActivePlayerCount;