import React from 'react';
import { useWebSocket } from './context/WebSocketContext';
import { Link } from 'react-router-dom';

interface LastPlayedGameProps {
  className?: string;
}

const LastPlayedGame: React.FC<LastPlayedGameProps> = ({ className = '' }) => {
  const { lastPlayedGame, refreshLastPlayed } = useWebSocket();

  React.useEffect(() => {
    // Refresh last played game data when component mounts
    refreshLastPlayed();
  }, [refreshLastPlayed]);

  if (!lastPlayedGame) {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg ${className}`}>
        <h3 className="text-lg font-bold mb-2">Last Played Game</h3>
        <p className="text-gray-500">No recent games played</p>
      </div>
    );
  }

  // Format the timestamp
  const formattedDate = new Date(lastPlayedGame.timestamp).toLocaleString();
  
  // If the last played date is more than a day old, format as date only
  const isRecent = Date.now() - lastPlayedGame.timestamp < 24 * 60 * 60 * 1000;
  const timeDisplay = isRecent
    ? new Date(lastPlayedGame.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date(lastPlayedGame.timestamp).toLocaleDateString();

  return (
    <div className={`p-4 bg-gray-100 rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-bold mb-2">Last Played Game</h3>
      <div className="mb-1">
        <span className="font-medium">{lastPlayedGame.gameName || 'Unknown Game'}</span>
      </div>
      <div className="text-sm text-gray-600 mb-3">
        {isRecent ? `Today at ${timeDisplay}` : timeDisplay}
      </div>
      <Link
        to={lastPlayedGame.route}
        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm inline-block"
      >
        Continue Playing
      </Link>
    </div>
  );
};

export default LastPlayedGame;