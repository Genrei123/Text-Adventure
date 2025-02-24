import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import includedRoutes from '../../../../backend/src/config/websocketConfig'; // Adjust the import path as needed

const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL); // Ensure this points to the backend server

interface WebSocketContextProps {
  playerCount: number;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

interface PlayerCountData {
  activePlayers: number;
}

const WebSocketContext = createContext<WebSocketContextProps>({ playerCount: 0 });

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [playerCount, setPlayerCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    const email = localStorage.getItem('email'); // Retrieve the email from local storage

    console.log(`Retrieved token: ${token}`);
    console.log(`Retrieved email: ${email}`);

    if (includedRoutes.includes(location.pathname)) {
      console.log(`Emitting join event for route: ${location.pathname}`);
      console.log(`Sending token: ${token}`);
      console.log(`Sending email: ${email}`);
      socket.emit('join', { route: location.pathname, token, email });

      const handlePlayerCount = (data: PlayerCountData) => {
        console.log(`Received playerCount event: ${data.activePlayers}`);
        setPlayerCount(data.activePlayers);
      };

      socket.on('playerCount', handlePlayerCount);

      const handleBeforeUnload = () => {
        console.log(`Emitting leave event for route: ${location.pathname}`);
        socket.emit('leave', { route: location.pathname, token, email });
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        console.log(`Component unmounted, emitting leave event for route: ${location.pathname}`);
        socket.emit('leave', { route: location.pathname, token, email });
        socket.off('playerCount', handlePlayerCount);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [location.pathname]);

  return (
    <WebSocketContext.Provider value={{ playerCount }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);