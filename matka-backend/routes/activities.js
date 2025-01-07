const express = require('express');
const fs = require('fs');
const router = express.Router();
const { broadcastRouteUpdate } = require('../utils/socket'); // Import broadcast function


const activityPoints = {
  Juoksu: 100, // 100 km/h
  Sali: 100, // 100 km/h
  Tennis: 100, // 100 km/h
  Pyöräily: (hours) => (hours > 1 ? 100 + (hours - 1) * 50 : hours * 100), // 100 km for 1st hour, 50 km for subsequent hours
  Hiihto: (hours) => (hours > 1 ? 100 + (hours - 1) * 50 : hours * 100), // 100 km for 1st hour, 50 km for subsequent hours
  Uinti: 200, // 200 km/h
  Crossfit: 100, // 100 km/h
  Tribe: 100, // 100 km/h
  "Ryhmä, pump": 100, // 100 km/h
  "Ryhmä, dance": 100, // 100 km/h
  "Ryhmä, combat": 100, // 100 km/h
  Spinning: 100, // 100 km/h
  Squash: 100, // 100 km/h
  Sulkapallo: 100, // 100 km/h
  Padel: 100, // 100 km/h
  Jooga: 50, // 50 km/h
  Liikkuvuus: 50, // 50 km/h
  Golf: 25, // 25 km/h
  Muu: 100, // 100 km/h
  "Ryhmä, HIIT": 100, // 100 km/h
  Kehonpainotreeni: 100, // 100 km/h
  Jalkapallo: 100, // 100 km/h
  Jääkiekko: 100, // 100 km/h
  Kamppailulaji: 100, // 100 km/h
};


router.post('/', (req, res) => {
  try {
    const { userId, activityType, duration } = req.body;

    // Calculate points
    let points = 0;
    const calculatePoints = activityPoints[activityType];
    if (typeof calculatePoints === 'function') {
      points = calculatePoints(duration);
    } else if (typeof calculatePoints === 'number') {
      points = duration * calculatePoints;
    } else {
      return res.status(400).json({ message: 'Invalid activity type' });
    }

    // Update user data
    const users = JSON.parse(fs.readFileSync('./data/users.json'));
const user = users.find((user) => user.id === parseInt(userId, 10));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.total_points += points;
    fs.writeFileSync('./data/users.json', JSON.stringify(users));

    // Add activity log
    const activities = JSON.parse(fs.readFileSync('./data/activities.json'));
activities.push({ userId, activityType, points, date: new Date() });
fs.writeFileSync('./data/activities.json', JSON.stringify(activities));


    console.log(`User ${user.id} total points updated to ${user.total_points}`);


broadcastRouteUpdate();
console.log('Route update broadcasted with new progress.');

    res.json({ message: 'Activity added successfully' });
  } catch (error) {
    console.error('Error adding activity:', error.message);
    res.status(500).json({ message: 'Error adding activity' });
  }
});

module.exports = router;
