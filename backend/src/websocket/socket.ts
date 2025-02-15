import { Server, Socket } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import { Express } from 'express';
import includedRoutes from '../config/websocketConfig';
import corsOptions from '../config/cors';
import { verifyToken } from '../controllers/auth/authController'; // Import verifyToken function
import User from '../model/user/user'; // Import User model
import { activeUserEmails } from '../shared/activeUser'; // Import activeUserEmails

interface JoinPayload {
  route: string;
  email: string;
  token: string;
}

interface PlayerCount {
  activePlayers: number;
}

interface SessionData {
  startTime: Date;
  endTime?: Date;
  interactions: string[];
}

export const playerSessions: Map<string, SessionData> = new Map(); // Export playerSessions

export function createServer(app: Express) {
  const server = createHttpServer(app);
  const io = new Server(server, {
    cors: corsOptions
  });

  let activePlayers = 0;

  const logPlayerStats = async () => {
    const totalPlayers = await User.count();
  };

  io.on('connection', (socket: Socket) => {
    socket.on('join', async ({ route, email, token }: JoinPayload) => {
      if (!route) {
        console.error('Route is missing');
        return;
      }
      const normalizedRoute = route; 
      console.log(`New connection from route: ${normalizedRoute}`);
      console.log(`Token received: ${token}`);

      try {
        const user = await verifyToken(token);
        if (user) {
          const userEmail = user.email; 
          if (normalizedRoute && includedRoutes.some(includedRoute => 
            normalizedRoute.includes(includedRoute))) {
            if (!activeUserEmails.has(userEmail)) {
              activeUserEmails.add(userEmail);
              activePlayers++;
              console.log(`Player connected. Active players: ${activePlayers}`);
              io.emit('playerCount', { activePlayers } as PlayerCount);
              await logPlayerStats(); // Log player statistics

              // Track session start time
              playerSessions.set(userEmail, { startTime: new Date(), interactions: [] });
            } else {
              console.log(`User email ${userEmail} is already connected.`);
            }
          } else {
            console.log(`Route does not match included routes.`);
          }
        } else {
          console.log(`User email ${email} is not authenticated.`);
        }
      } catch (error: any) {
        console.error(`Error during join event: ${error.message}`);
      }
    });

    socket.on('interaction', ({ email, interaction }: { email: string, interaction: string }) => {
      const session = playerSessions.get(email); 
      if (session) {
        session.interactions.push(interaction);
        console.log(`Interaction logged for ${email}: ${interaction}`);
      }
    });

    socket.on('leave', async ({ route, email, token }: JoinPayload) => {
      if (!route) {
        console.error('Route is missing');
        return;
      }
      const normalizedRoute = route;
      console.log(`Disconnection from route: ${normalizedRoute}`);

      try {
        const user = await verifyToken(token);
        if (user) {
          const userEmail = user.email; 
          if (normalizedRoute && includedRoutes.some(includedRoute => 
            normalizedRoute.includes(includedRoute))) {
            if (activeUserEmails.has(userEmail)) {
              activeUserEmails.delete(userEmail);
              activePlayers--;
              console.log(`Player disconnected. Active players: ${activePlayers}`);
              io.emit('playerCount', { activePlayers } as PlayerCount);
              await logPlayerStats(); // Log player statistics

              // Track session end time
              const session = playerSessions.get(userEmail);
              if (session) {
                session.endTime = new Date();
                console.log(`Session ended for ${userEmail}:`, session);
              }
            } else {
              console.log(`User email ${userEmail} is not connected.`);
            }
          } else {
            console.log(`Route does not match included routes.`);
          }
        } else {
          console.log(`User email ${email} is not authenticated.`);
        }
      } catch (error: any) {
        console.error(`Error during leave event: ${error.message}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected`);
    });
  });

  return server;
}