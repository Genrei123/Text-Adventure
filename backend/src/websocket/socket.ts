import { Server, Socket } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import { Express } from 'express';
import includedRoutes from '../config/websocketConfig';
import corsOptions from '../config/cors';
import { activeUserEmails } from '../shared/websocket/activeUser'; // Import activeUserEmails
import { JoinPayload, PlayerCount, LastPlayedPayload } from '../interfaces/websocket/websocketInterfaces'; // Import interfaces
import axios from 'axios'; // Import axios

// Map to store user sockets
const userSockets: Map<string, Set<string>> = new Map(); 

// Map to store last played game information
const lastPlayedGames: Map<string, { route: string; timestamp: number; gameName?: string }> = new Map();

export function createServer(app: Express) {
  const server = createHttpServer(app);
  const io = new Server(server, { cors: corsOptions });

  const logPlayerStats = async () => {
    try {
      const response = await axios.get(`${process.env.SITE_URL}/statistics/statsRoutes/player-stats`);
      const activePlayers = response.data.activePlayers;
      console.info(`Active players: ${activePlayers}`);
    } catch (error) {
      console.error('Error fetching active player count:', error);
    }
  };

  io.on('connection', (socket: Socket) => {
    console.info(`New socket connected: ${socket.id}`);

    // Send last played game to user if exists
    socket.on('getLastPlayed', ({ email }: { email: string }) => {
      if (email && lastPlayedGames.has(email)) {
        socket.emit('lastPlayedGame', lastPlayedGames.get(email));
      }
    });

    // Update last played game
    socket.on('updateLastPlayed', ({ route, email, timestamp, gameName }: LastPlayedPayload) => {
      console.debug(`Update last played received: route=${route}, email=${email}, game=${gameName}`);
      
      if (email && route) {
        lastPlayedGames.set(email, {
          route,
          timestamp,
          gameName
        });
        
        // Confirm the update
        socket.emit('lastPlayedUpdated', { success: true });
        console.info(`Updated last played game for ${email}: ${gameName || route}`);
        
        // Consider persisting this information to a database here
        // This implementation keeps it in memory only
      }
    });

    socket.on('join', async ({ route, email }: JoinPayload) => {
      console.debug(`Join event received: route=${route}, email=${email}`);
      if (!route) {
        console.error('Route is missing');
        return;
      }

      console.info(`New connection from route: ${route}`);
      console.info(`Email received: ${email}`);

      const userEmail = email;

      if (includedRoutes.some(includedRoute => route.includes(includedRoute))) {
        if (!userSockets.has(userEmail)) {
          userSockets.set(userEmail, new Set());
        }
        userSockets.get(userEmail)?.add(socket.id);

        if (userSockets.get(userEmail)?.size === 1) {
          activeUserEmails.add(userEmail); // Add to activeUserEmails
          io.emit('playerCount', { activePlayers: activeUserEmails.size } as PlayerCount);
          await logPlayerStats();
        }

        // Check if this is a game route (you may need to define game routes more specifically)
        const isGameRoute = route.includes('/game-details/') || route.includes('/game/');
        if (isGameRoute && email) {
          // Automatically update last played for game routes
          const gameName = route.split('/').filter(Boolean).pop() || route;
          lastPlayedGames.set(email, {
            route,
            timestamp: Date.now(),
            gameName: gameName.charAt(0).toUpperCase() + gameName.slice(1).replace(/-/g, ' ')
          });
        }

        console.info(`User ${userEmail} joined. Active players: ${activeUserEmails.size} as of ${new Date().toLocaleString()}`);
      } else {
        console.warn(`Route does not match included routes.`);
      }
    });

    socket.on('leave', async ({ route, email }: JoinPayload) => {
      console.debug(`Leave event received: route=${route}, email=${email}`);
      if (!route) {
        console.error('Route is missing');
        return;
      }

      console.info(`Disconnection from route: ${route}`);
      console.info(`Email received: ${email}`);

      const userEmail = email;

      if (includedRoutes.some(includedRoute => route.includes(includedRoute))) {
        if (userSockets.has(userEmail) && userSockets.get(userEmail)?.has(socket.id)) {
          userSockets.get(userEmail)?.delete(socket.id);
          
          if (userSockets.get(userEmail)?.size === 0) {
            activeUserEmails.delete(userEmail); // Remove from activeUserEmails
            io.emit('playerCount', { activePlayers: activeUserEmails.size } as PlayerCount);
            await logPlayerStats();
            userSockets.delete(userEmail);
          }
        }

        console.info(`User ${userEmail} left. Active players: ${activeUserEmails.size} as of ${new Date().toLocaleString()}`);
      } else {
        console.warn(`Route does not match included routes.`);
      }
    });

    socket.on('disconnect', async () => {
      console.info(`Socket disconnected: ${socket.id}`);

      for (const [userEmail, sockets] of userSockets.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          
          if (sockets.size === 0) {
            activeUserEmails.delete(userEmail); // Remove from activeUserEmails
            io.emit('playerCount', { activePlayers: activeUserEmails.size } as PlayerCount);
            await logPlayerStats();
            userSockets.delete(userEmail);
          }
          break;
        }
      }
    });
  });

  return server;
}