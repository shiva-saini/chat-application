// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

const HOST = '192.168.62.56';
// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));

// Socket.io connection handling
const users = {};

io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle new user registration
  socket.on('register', (username) => {
    users[socket.id] = username;
    console.log(`${username} joined the chat.`);
  });

  // Handle events from the connected clients
  socket.on('message', (data) => {
    const username = users[socket.id];
    console.log(`${username}: ${data.message}`);
    // Broadcast the message to all connected clients (including the sender)
    io.emit('message', { username, message: data.message });
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    console.log(`${username} left the chat.`);
    delete users[socket.id];
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
