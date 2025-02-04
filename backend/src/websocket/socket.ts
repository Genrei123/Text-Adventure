import { Server } from 'socket.io';
import http from 'http';
import app from '../index'; // Adjust the path as needed

const server = http.createServer(app);
const io = new Server(server);

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