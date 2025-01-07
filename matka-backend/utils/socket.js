// utils/socket.js
const fs = require('fs');

let ioInstance;

function setSocketIO(io) {
  ioInstance = io;
}

function broadcastRouteUpdate() {
  if (!ioInstance) {
    console.error('Socket.IO instance not initialized');
    return;
  }

  try {
    const route = JSON.parse(fs.readFileSync('./data/route.json'));
    const users = JSON.parse(fs.readFileSync('./data/users.json'));
    
    // Calculate total points
    const totalPoints = users.reduce((sum, user) => sum + user.total_points, 0);

    ioInstance.emit('ROUTE_UPDATE', {
      type: 'ROUTE_UPDATE',
      data: {
        route,
        totalPoints
      }
    });
  } catch (error) {
    console.error('Error broadcasting route update:', error);
  }
}

module.exports = {
  setSocketIO,
  broadcastRouteUpdate,
};