import { Server, Socket } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import { Express } from 'express';
import includedRoutes from '../config/websocketConfig';
import corsOptions from '../config/cors';
import { activeUserEmails } from '../shared/websocket/activeUser'; // Import activeUserEmails
import { JoinPayload, PlayerCount } from '../interfaces/websocket/websocketInterfaces'; // Import interfaces
import winston from 'winston';
import axios from 'axios'; // Import axios

// Initialize Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'server.log' })],
});

const userSockets: Map<string, Set<string>> = new Map(); // Track multiple sockets per user

export function createServer(app: Express) {
  const server = createHttpServer(app);
  const io = new Server(server, { cors: corsOptions });

  const logPlayerStats = async () => {
    try {
      //const response = await axios.get(`${process.env.SITE_URL}/statistics/statsRoutes/player-stats`);
      const response = await axios.get(`${process.env.SITE_URL}/statistics/statsRoutes/player-stats`);
      const activePlayers = response.data.activePlayers;
      logger.info(`Active players: ${activePlayers}`);
    } catch (error) {
      logger.error('Error fetching active player count:', error);
    }
  };

  io.on('connection', (socket: Socket) => {
    logger.info(`New socket connected: ${socket.id}`);

    socket.on('join', async ({ route, email }: JoinPayload) => {
      logger.debug(`Join event received: route=${route}, email=${email}`);
      if (!route) {
        logger.error('Route is missing');
        return;
      }

      logger.info(`New connection from route: ${route}`);
      logger.info(`Email received: ${email}`);

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

        logger.info(`User ${userEmail} joined. Active players: ${activeUserEmails.size} as of ${new Date().toLocaleString()}`);
      } else {
        logger.warn(`Route does not match included routes.`);
      }
    });

    socket.on('leave', async ({ route, email }: JoinPayload) => {
      logger.debug(`Leave event received: route=${route}, email=${email}`);
      if (!route) {
        logger.error('Route is missing');
        return;
      }

      logger.info(`Disconnection from route: ${route}`);
      logger.info(`Email received: ${email}`);

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

        logger.info(`User ${userEmail} left. Active players: ${activeUserEmails.size} as of ${new Date().toLocaleString()}`);
      } else {
        logger.warn(`Route does not match included routes.`);
      }
    });

    socket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${socket.id}`);

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