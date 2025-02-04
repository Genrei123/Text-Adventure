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
  socket.on('join', ({ route }) => {
    const normalizedRoute = route.toLowerCase();
    console.log(`New connection from route: ${normalizedRoute}`);
    console.log(`Included routes: ${includedRoutes}`);
    if (normalizedRoute && includedRoutes.some(includedRoute => normalizedRoute.includes(includedRoute.toLowerCase()))) {
      activePlayers++;
      console.log(`Player connected. Active players: ${activePlayers}`);
      io.emit('playerCount', { activePlayers });
    } else {
      console.log(`Route does not match included routes.`);
    }
  });

  socket.on('leave', ({ route }) => {
    const normalizedRoute = route.toLowerCase();
    console.log(`Disconnection from route: ${normalizedRoute}`);
    if (normalizedRoute && includedRoutes.some(includedRoute => normalizedRoute.includes(includedRoute.toLowerCase()))) {
      activePlayers--;
      console.log(`Player disconnected. Active players: ${activePlayers}`);
      io.emit('playerCount', { activePlayers });
    } else {
      console.log(`Route does not match included routes.`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected`);
  });
});

export { server, io };