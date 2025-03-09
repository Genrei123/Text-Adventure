import React, { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import socketIOClient from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import includedRoutes from '../../../../backend/src/config/websocketConfig';
import { trackPageVisit, createSession } from '../../sessions/api-calls/visitedPagesSession'; // Import your session tracking functions

const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');

interface LastPlayedGame {
  route: string;
  timestamp: number;
  gameName?: string;
}

interface WebSocketContextProps {
  playerCount: number;
  lastPlayedGame: LastPlayedGame | null;
  refreshLastPlayed: () => void;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketContext = createContext<WebSocketContextProps>({
  playerCount: 0,
  lastPlayedGame: null,
  refreshLastPlayed: () => {},
});

const matchesIncludedRoute = (path: string) => {
  let pathname = path;
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    try {
      const url = new URL(pathname);
      pathname = url.pathname;
    } catch (e) {
      console.error('Failed to parse URL:', e);
      return false;
    }
  }
  return includedRoutes.some((pattern) => {
    if (!pattern.includes(':')) return pathname === pattern;
    const patternParts = pattern.split('/').filter((part) => part);
    const pathParts = pathname.split('/').filter((part) => part);
    if (patternParts[0] !== pathParts[0]) return false;
    if (pattern === '/game-details/:id') {
      return pathname.startsWith('/game-details/') && pathParts.length >= 2;
    }
    return patternParts.length === pathParts.length && patternParts.every((part, i) => part.startsWith(':') || part === pathParts[i]);
  });
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [playerCount, setPlayerCount] = useState(0);
  const [lastPlayedGame, setLastPlayedGame] = useState<LastPlayedGame | null>(null);
  const location = useLocation();

  const refreshLastPlayed = () => {
    const email = localStorage.getItem('email');
    if (email) socket.emit('getLastPlayed', { email });
  };

  useEffect(() => {
    socket.on('playerCount', (data: { activePlayers: number }) => setPlayerCount(data.activePlayers));
    socket.on('lastPlayedGame', (data: LastPlayedGame | null) => {
      setLastPlayedGame(data);
      if (data) localStorage.setItem('lastPlayedGame', JSON.stringify(data));
    });
    socket.on('lastPlayedUpdated', (response: { success: boolean }) => {
      if (response.success) console.log('Last played updated successfully');
    });

    const savedLastGame = localStorage.getItem('lastPlayedGame');
    if (savedLastGame) {
      try {
        setLastPlayedGame(JSON.parse(savedLastGame));
      } catch (error) {
        console.error('Failed to parse last played game:', error);
      }
    }

    refreshLastPlayed();

    return () => {
      socket.off('playerCount');
      socket.off('lastPlayedGame');
      socket.off('lastPlayedUpdated');
    };
  }, []);

  // Track page visits and sessions
  useEffect(() => {
    const email = localStorage.getItem('email');
    let sessionId = localStorage.getItem('sessionId');

    const initSession = async () => {
      if (!sessionId && email) {
        try {
          const session = await createSession(email);
          sessionId = session.id;
        } catch (error) {
          console.error('Failed to create session:', error);
        }
      }

      // Track the current page visit if we have a valid session
      if (sessionId) {
        trackPageVisit(sessionId, location.pathname);
      }
    };

    initSession();
  }, [location.pathname]); // Re-run when the path changes

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email') || 'guest@example.com'; // Fallback
    const currentURL = window.location.href;
    const sessionId = localStorage.getItem('sessionId');

    if (matchesIncludedRoute(currentURL)) {
      socket.emit('join', { route: currentURL, token, email });

      const isGameRoute = location.pathname.includes('/game-details/') || location.pathname.includes('/game/');
      if (isGameRoute) {
        let gameName = '';
        if (location.pathname.includes('/game-details/')) {
          const gameId = location.pathname.split('/').pop() || '';
          gameName = isNaN(Number(gameId)) 
            ? gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            : `Game ${gameId}`;
        }
        const newLastPlayed = { route: location.pathname, timestamp: Date.now(), gameName };
        setLastPlayedGame(newLastPlayed);
        localStorage.setItem('lastPlayedGame', JSON.stringify(newLastPlayed));
        
        // Update last played game via socket
        socket.emit('updateLastPlayed', { route: location.pathname, email, timestamp: newLastPlayed.timestamp, gameName });
        
        // Also log the game route visit to your session database
        if (sessionId) {
          trackPageVisit(sessionId, location.pathname);
          
          // You could also add game-specific data to local storage
          const gameData = {
            lastGame: gameName,
            lastGameRoute: location.pathname,
            lastGameTimestamp: newLastPlayed.timestamp
          };
          localStorage.setItem('gameData', JSON.stringify(gameData));
        }
      }

      const handleBeforeUnload = () => {
        socket.emit('leave', { route: location.pathname, token, email });
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        socket.emit('leave', { route: location.pathname, token, email });
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [location.pathname]);

  return (
    <WebSocketContext.Provider value={{ playerCount, lastPlayedGame, refreshLastPlayed }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);