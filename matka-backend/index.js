const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { setSocketIO } = require('./utils/socket');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Import routes
const usersRoutes = require('./routes/users');
const activitiesRoutes = require('./routes/activities');
const progressRoutes = require('./routes/progress');

// Use routes
app.use('/users', usersRoutes);
app.use('/activities', activitiesRoutes);
app.use('/progress', progressRoutes);

// Create HTTP and Socket.IO servers
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

// Set the Socket.IO instance in the utility
setSocketIO(io);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('Socket.IO connected');
  socket.on('disconnect', () => console.log('Socket.IO disconnected'));
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
