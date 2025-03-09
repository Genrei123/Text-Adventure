import { Server, Socket } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import { Express } from 'express';
import includedRoutes from '../config/websocketConfig';
import corsOptions from '../config/cors';
import { verifyToken } from '../controllers/auth/authController';
import User from '../model/user/user';
import { activeUserEmails } from '../shared/websocket/activeUser';
import { JoinPayload, PlayerCount, SessionData, LastPlayedPayload } from '../interfaces/websocket/websocketInterfaces';
import winston from 'winston';
import Session from '../model/session';
import axios from 'axios';

// Initialize Winston Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'server.log' })],
});

// Map to store user sockets
const userSockets: Map<string, Set<string>> = new Map();

// Map to store last played game information
const lastPlayedGames: Map<string, { route: string; timestamp: number; gameName?: string }> = new Map();

// Map to store player sessions with corrected structure
export const playerSessions: Map<string, {
  startTime: Date;
  endTime?: Date;
  sessionData: {
    interactions: string[]; // Changed to array
    gamesCreated: string[]; // Changed to array
    gamesPlayed: string[];  // Changed to array
    visitedPages: { [key: string]: number }; // Kept as object with number values
  }
}> = new Map();

export function createServer(app: Express) {
  const server = createHttpServer(app);
  const io = new Server(server, { cors: corsOptions });

  const logPlayerStats = async () => {
    try {
      const response = await axios.get(`${process.env.SITE_URL}/statistics/statsRoutes/player-stats`);
      const activePlayers = response.data.activePlayers;
      logger.info(`Active players: ${activePlayers}`);
    } catch (error) {
      logger.error('Error fetching active player count:', error);
    }
  };

  io.on('connection', (socket: Socket) => {
    logger.info(`New socket connected: ${socket.id}`);

    // Send last played game to user if exists
    socket.on('getLastPlayed', ({ email }: { email: string }) => {
      if (email && lastPlayedGames.has(email)) {
        socket.emit('lastPlayedGame', lastPlayedGames.get(email));
      }
    });

    // Update last played game
    socket.on('updateLastPlayed', ({ route, email, timestamp, gameName }: LastPlayedPayload) => {
      logger.debug(`Update last played received: route=${route}, email=${email}, game=${gameName}`);
      
      if (email && route) {
        lastPlayedGames.set(email, {
          route,
          timestamp,
          gameName
        });
        
        socket.emit('lastPlayedUpdated', { success: true });
        logger.info(`Updated last played game for ${email}: ${gameName || route}`);
      }
    });

    socket.on('join', async ({ route, email, token }: JoinPayload) => {
      logger.debug(`Join event received: route=${route}, email=${email}, token=${token}`);
      if (!route) {
        logger.error('Route is missing');
        return;
      }

      logger.info(`New connection from route: ${route}`);
      logger.info(`Token received: ${token || 'none'}`);
      logger.info(`Email received: ${email}`);

      let userEmail = email;
      if (token) {
        try {
          const user = await verifyToken(token);
          if (!user || !user.email) {
            logger.warn(`Invalid token or user email missing`);
            return;
          }
          userEmail = user.email;
        } catch (error: any) {
          logger.error(`Error verifying token: ${error.message}`);
          return;
        }
      }

      if (includedRoutes.some(includedRoute => route.includes(includedRoute))) {
        if (!userSockets.has(userEmail)) {
          userSockets.set(userEmail, new Set());
        }
        userSockets.get(userEmail)?.add(socket.id);

        if (userSockets.get(userEmail)?.size === 1) {
          activeUserEmails.add(userEmail);
          io.emit('playerCount', { activePlayers: activeUserEmails.size } as PlayerCount);
          await logPlayerStats();

          if (!playerSessions.has(userEmail)) {
            playerSessions.set(userEmail, {
              startTime: new Date(),
              sessionData: {
                interactions: [],
                gamesCreated: [],
                gamesPlayed: [],
                visitedPages: {}
              }
            });
            logger.info(`Session created for ${userEmail}`);
          }
        }

        // Handle last played game for game routes
        const isGameRoute = route.includes('/game-details/') || route.includes('/game/');
        if (isGameRoute && userEmail) {
          const gameName = route.split('/').filter(Boolean).pop() || route;
          lastPlayedGames.set(userEmail, {
            route,
            timestamp: Date.now(),
            gameName: gameName.charAt(0).toUpperCase() + gameName.slice(1).replace(/-/g, ' ')
          });
        }

        logger.info(`User ${userEmail} joined. Active players: ${activeUserEmails.size} as of ${new Date().toLocaleString()}`);
      } else {
        logger.warn(`Route does not match included routes`);
      }
    });

    socket.on('interaction', ({ email, interaction, page }: { email: string; interaction: string; page: string }) => {
      logger.debug(`Interaction event received: email=${email}, interaction=${interaction}, page=${page}`);
      const session = playerSessions.get(email);
      if (session) {
        // Push interactions to array instead of using as object
        session.sessionData.interactions.push(interaction);
        
        if (interaction.startsWith('created:')) {
          const game = interaction.replace('created:', '');
          session.sessionData.gamesCreated.push(game);
        } else if (interaction.startsWith('played:')) {
          const game = interaction.replace('played:', '');
          session.sessionData.gamesPlayed.push(game);
        }
        
        if (page) {
          session.sessionData.visitedPages[page] = (session.sessionData.visitedPages[page] || 0) + 1;
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

      let userEmail = email;
      if (token) {
        try {
          const user = await verifyToken(token);
          if (!user || !user.email) {
            logger.warn(`Invalid token or user email missing`);
            return;
          }
          userEmail = user.email;
        } catch (error: any) {
          logger.error(`Error verifying token: ${error.message}`);
          return;
        }
      }

      if (includedRoutes.some(includedRoute => route.includes(includedRoute))) {
        if (userSockets.has(userEmail) && userSockets.get(userEmail)?.has(socket.id)) {
          userSockets.get(userEmail)?.delete(socket.id);
          
          if (userSockets.get(userEmail)?.size === 0) {
            activeUserEmails.delete(userEmail);
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
              logger.info(`Session ended for ${userEmail}: ${JSON.stringify(session)}`);
              playerSessions.delete(userEmail);
            }
          }
          logger.info(`User ${userEmail} left. Active players: ${activeUserEmails.size} as of ${new Date().toLocaleString()}`);
        }
      } else {
        logger.warn(`Route does not match included routes`);
      }
    });

    socket.on('disconnect', async () => {
      logger.info(`Socket disconnected: ${socket.id}`);

      for (const [userEmail, sockets] of userSockets.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          
          if (sockets.size === 0) {
            activeUserEmails.delete(userEmail);
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
            }
          }
          break;
        }
      }
    });
  });

  return server;
}