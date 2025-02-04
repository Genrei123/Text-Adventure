import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

const socket = io('http://localhost:3000'); // Establish the connection only once

interface WebSocketContextProps {
  playerCount: number;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketContext = createContext<WebSocketContextProps>({ playerCount: 0 });

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [playerCount, setPlayerCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    console.log(`Emitting join event for route: ${location.pathname}`);
    socket.emit('join', { route: location.pathname });

    socket.on('playerCount', (data) => {
      console.log(`Received playerCount event: ${data.activePlayers}`);
      setPlayerCount(data.activePlayers);
    });

    const handleBeforeUnload = () => {
      console.log(`Emitting leave event for route: ${location.pathname}`);
      socket.emit('leave', { route: location.pathname });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      console.log(`Emitting leave event for route: ${location.pathname}`);
      socket.emit('leave', { route: location.pathname });
      socket.off('playerCount');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  return (
    <WebSocketContext.Provider value={{ playerCount }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);