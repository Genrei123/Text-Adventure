// filepath: /c:/Users/Ervhyne/Documents/VS PROJECTS/Text-Adventure/backend/src/websocket/socket.ts
import { Server } from 'socket.io';
import http from 'http';
import app from '../index'; // Adjust the path as needed
import includedRoutes from '../config/websocketConfig'; // Import the configuration file

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // Adjust the URL to match your frontend
      "https://text-adventure-six.vercel.app" // URL of Vercel frontend
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

let activePlayers = 0;

io.on('connection', (socket) => {
  const url = socket.handshake.headers.referer;
  if (url && includedRoutes.some(route => url.includes(route))) {
    activePlayers++;
    console.log(`Player connected. Active players: ${activePlayers}`);
    io.emit('playerCount', { activePlayers });
  }

  socket.on('disconnect', () => {
    if (url && includedRoutes.some(route => url.includes(route))) {
      activePlayers--;
      console.log(`Player disconnected. Active players: ${activePlayers}`);
      io.emit('playerCount', { activePlayers });
    }
  });
});

export { server, io };