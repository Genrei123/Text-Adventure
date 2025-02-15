import { Server, Socket } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import { Express } from 'express';
import includedRoutes from '../config/websocketConfig';
import corsOptions from '../config/cors';
import { verifyToken } from '../controllers/auth/authController'; // Import verifyToken function
import User from '../model/user/user'; // Import User model
import { activeUserEmails } from '../shared/activeUser'; // Import activeUserEmails
import winston from 'winston';

// Initialize Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'server.log' })],
});

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
const userSockets: Map<string, Set<string>> = new Map(); // Track multiple sockets per user

export function createServer(app: Express) {
  const server = createHttpServer(app);
  const io = new Server(server, { cors: corsOptions });

  let activePlayers = 0;

  const logPlayerStats = async () => {
    const totalPlayers = await User.count();
    logger.info(`Total players in database: ${totalPlayers}`);
  };

  io.on('connection', (socket: Socket) => {
    logger.info(`New socket connected: ${socket.id}`);

    socket.on('join', async ({ route, email, token }: JoinPayload) => {
      if (!route) {
        logger.error('Route is missing');
        return;
      }

      logger.info(`New connection from route: ${route}`);
      logger.info(`Token received: ${token}`);

      try {
        const user = await verifyToken(token);
        if (!user || !user.email) {
          logger.warn(`Invalid token or user email missing.`);
          return;
        }

        const userEmail = user.email;

        if (includedRoutes.some(includedRoute => route.includes(includedRoute))) {
          if (!userSockets.has(userEmail)) {
            userSockets.set(userEmail, new Set());
          }
          userSockets.get(userEmail)?.add(socket.id);

          if (userSockets.get(userEmail)?.size === 1) {
            activePlayers++;
            io.emit('playerCount', { activePlayers } as PlayerCount);
            await logPlayerStats();

            playerSessions.set(userEmail, { startTime: new Date(), interactions: [] });
          }

          logger.info(`User ${userEmail} joined. Active players: ${activePlayers}`);
        } else {
          logger.warn(`Route does not match included routes.`);
        }
      } catch (error: any) {
        logger.error(`Error during join event: ${error.message}`);
      }
    });

    socket.on('interaction', ({ email, interaction }: { email: string; interaction: string }) => {
      const session = playerSessions.get(email);
      if (session) {
        session.interactions.push(interaction);
        logger.info(`Interaction logged for ${email}: ${interaction}`);
      }
    });

    socket.on('leave', async ({ route, email, token }: JoinPayload) => {
      if (!route) {
        logger.error('Route is missing');
        return;
      }

      logger.info(`Disconnection from route: ${route}`);

      try {
        const user = await verifyToken(token);
        if (!user || !user.email) {
          logger.warn(`Invalid token or user email missing.`);
          return;
        }

        const userEmail = user.email;

        if (includedRoutes.some(includedRoute => route.includes(includedRoute))) {
          if (userSockets.has(userEmail) && userSockets.get(userEmail)?.has(socket.id)) {
            userSockets.get(userEmail)?.delete(socket.id);
            
            if (userSockets.get(userEmail)?.size === 0) {
              activePlayers--;
              io.emit('playerCount', { activePlayers } as PlayerCount);
              userSockets.delete(userEmail);

              const session = playerSessions.get(userEmail);
              if (session) {
                session.endTime = new Date();
                logger.info(`Session ended for ${userEmail}:`, session);
                playerSessions.delete(userEmail);
              }
            }
          }

          logger.info(`User ${userEmail} left. Active players: ${activePlayers}`);
        } else {
          logger.warn(`Route does not match included routes.`);
        }
      } catch (error: any) {
        logger.error(`Error during leave event: ${error.message}`);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);

      for (const [userEmail, sockets] of userSockets.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          
          if (sockets.size === 0) {
            activePlayers--;
            io.emit('playerCount', { activePlayers } as PlayerCount);
            userSockets.delete(userEmail);
            playerSessions.delete(userEmail);
            logger.info(`Cleaned up session for ${userEmail}`);
          }
          break;
        }
      }
    });
  });

  return server;
}
