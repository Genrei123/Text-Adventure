import { Server, Socket } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import { Express } from 'express';
import includedRoutes from '../config/websocketConfig';
import corsOptions from '../config/cors';
import { verifyToken } from '../controllers/auth/authController'; // Import verifyToken function
import User from '../model/user/user'; // Import User model
import { activeUserEmails } from '../shared/websocket/activeUser'; // Import activeUserEmails
import { JoinPayload, PlayerCount, SessionData } from '../interfaces/websocket/websocketInterfaces'; // Import interfaces
import winston from 'winston';
import Session from '../model/session'; // Import Session model
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

export const playerSessions: Map<string, SessionData> = new Map(); // Export playerSessions
const userSockets: Map<string, Set<string>> = new Map(); // Track multiple sockets per user

export function createServer(app: Express) {
  const server = createHttpServer(app);
  const io = new Server(server, { cors: corsOptions });

  const logPlayerStats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/statistics/statsRoutes/player-stats');
      const activePlayers = response.data.activePlayers;
      logger.info(`Active players: ${activePlayers}`);
    } catch (error) {
      logger.error('Error fetching active player count:', error);
    }
  };

  io.on('connection', (socket: Socket) => {
    logger.info(`New socket connected: ${socket.id}`);

    socket.on('join', async ({ route, email, token }: JoinPayload) => {
      logger.debug(`Join event received: route=${route}, email=${email}, token=${token}`);
      if (!route) {
        logger.error('Route is missing');
        return;
      }

      logger.info(`New connection from route: ${route}`);
      logger.info(`Token received: ${token}`);
      logger.info(`Email received: ${email}`);

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
            activeUserEmails.add(userEmail); // Add to activeUserEmails
            io.emit('playerCount', { activePlayers: activeUserEmails.size } as PlayerCount);
            await logPlayerStats();

            if (!playerSessions.has(userEmail)) {
              playerSessions.set(userEmail, { startTime: new Date(), sessionData: { interactions: {}, gamesCreated: {}, gamesPlayed: {}, visitedPages: {} } });
              logger.info(`Session created for ${userEmail}`);
            }
          }

          logger.info(`User ${userEmail} joined. Active players: ${activeUserEmails.size} as of ${new Date().toLocaleString()}`);
        } else {
          logger.warn(`Route does not match included routes.`);
        }
      } catch (error: any) {
        logger.error(`Error during join event: ${error.message}`);
      }
    });

    socket.on('interaction', ({ email, interaction, page }: { email: string; interaction: string; page: string }) => {
      logger.debug(`Interaction event received: email=${email}, interaction=${interaction}, page=${page}`);
      const session = playerSessions.get(email);
      if (session) {
        session.sessionData.interactions[interaction] = (session.sessionData.interactions[interaction] || 0) + 1;
        if (interaction.startsWith('created:')) {
          const game = interaction.replace('created:', '');
          session.sessionData.gamesCreated[game] = (session.sessionData.gamesCreated[game] || 0) + 1;
        } else if (interaction.startsWith('played:')) {
          const game = interaction.replace('played:', '');
          session.sessionData.gamesPlayed[game] = (session.sessionData.gamesPlayed[game] || 0) + 1;
        }
        if (page) {
          session.sessionData.visitedPages[page] = (session.sessionData.visitedPages[page] || 0) + 1; // Log the visited page
          logger.info(`Visited page added for ${email}: ${page}`);
        }
        logger.info(`Interaction logged for ${email}: ${interaction}, page: ${page}`);
        logger.debug(`Current session data for ${email}: ${JSON.stringify(session)}`);
      } else {
        logger.warn(`No session found for ${email}`);
      }
    });

    socket.on('leave', async ({ route, email, token }: JoinPayload) => {
      logger.debug(`Leave event received: route=${route}, email=${email}, token=${token}`);
      if (!route) {
        logger.error('Route is missing');
        return;
      }

      logger.info(`Disconnection from route: ${route}`);
      logger.info(`Email received: ${email}`);

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
              activeUserEmails.delete(userEmail); // Remove from activeUserEmails
              io.emit('playerCount', { activePlayers: activeUserEmails.size } as PlayerCount);
              userSockets.delete(userEmail);

              const session = playerSessions.get(userEmail);
              if (session) {
                session.endTime = new Date();
                logger.debug(`Final session data for ${userEmail}: ${JSON.stringify(session)}`);
                await Session.create({
                  email: userEmail,
                  startTime: session.startTime,
                  endTime: session.endTime,
                  sessionData: session.sessionData,
                });
                logger.info(`Session ended for ${userEmail}:`, session);
                playerSessions.delete(userEmail);
              } else {
                logger.warn(`No session found for ${userEmail} during leave event`);
              }
            }
          }

          logger.info(`User ${userEmail} left. Active players: ${activeUserEmails.size} as of ${new Date().toLocaleString()}`);
        } else {
          logger.warn(`Route does not match included routes.`);
        }
      } catch (error: any) {
        logger.error(`Error during leave event: ${error.message}`);
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
            userSockets.delete(userEmail);

            const session = playerSessions.get(userEmail);
            if (session) {
              session.endTime = new Date();
              logger.debug(`Final session data for ${userEmail}: ${JSON.stringify(session)}`);
              await Session.create({
                email: userEmail,
                startTime: session.startTime,
                endTime: session.endTime,
                sessionData: session.sessionData,
              });
              playerSessions.delete(userEmail);
              logger.info(`Cleaned up session for ${userEmail}`);
            } else {
              logger.warn(`No session found for ${userEmail} during disconnect event`);
            }
          }
          break;
        }
      }
    });
  });

  return server;
}