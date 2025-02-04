import React from 'react';
import { useWebSocket } from '../context/WebSocketContext';

const ActivePlayerCount: React.FC = () => {
  const { playerCount } = useWebSocket();

  return (
    <div style={{ color: 'white' }}>
      <h1>Active Player Count</h1>
      <p>Active players: {playerCount}</p>
    </div>
  );
};

export default ActivePlayerCount;