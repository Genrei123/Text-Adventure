import { Server, Socket } from 'socket.io';
import { createServer as createHttpServer } from 'http';
import { Express } from 'express';
import includedRoutes from '../config/websocketConfig';

interface JoinPayload {
  route: string;
}

interface PlayerCount {
  activePlayers: number;
}

export function createServer(app: Express) {
  const server = createHttpServer(app);
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://text-adventure-six.vercel.app"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  let activePlayers = 0;

  io.on('connection', (socket: Socket) => {
    socket.on('join', ({ route }: JoinPayload) => {
      const normalizedRoute = route.toLowerCase();
      console.log(`New connection from route: ${normalizedRoute}`);
      console.log(`Included routes: ${includedRoutes}`);
      
      if (normalizedRoute && includedRoutes.some(includedRoute => 
        normalizedRoute.includes(includedRoute.toLowerCase()))) {
        activePlayers++;
        console.log(`Player connected. Active players: ${activePlayers}`);
        io.emit('playerCount', { activePlayers } as PlayerCount);
      } else {
        console.log(`Route does not match included routes.`);
      }
    });

    socket.on('leave', ({ route }: JoinPayload) => {
      const normalizedRoute = route.toLowerCase();
      console.log(`Disconnection from route: ${normalizedRoute}`);
      
      if (normalizedRoute && includedRoutes.some(includedRoute => 
        normalizedRoute.includes(includedRoute.toLowerCase()))) {
        if (activePlayers > 0) {
          activePlayers--;
          console.log(`Player disconnected. Active players: ${activePlayers}`);
          io.emit('playerCount', { activePlayers } as PlayerCount);
        } else {
          console.log(`Active players count is already zero, cannot decrement.`);
        }
      } else {
        console.log(`Route does not match included routes.`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected`);
    });
  });

  return server;
}