import { Server } from 'socket.io';
import http from 'http';
import app from '../index'; // Adjust the path as needed

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // Adjust the URL to match your frontend(lagay url ng frontend)
      "https://text-adventure-six.vercel.app" // URL ng vercel frontend
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

let activePlayers = 0;

io.on('connection', (socket) => {
  activePlayers++;
  io.emit('playerCount', { activePlayers });

  socket.on('disconnect', () => {
    activePlayers--;
    io.emit('playerCount', { activePlayers });
  });
});

export { server, io };