const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const users = JSON.parse(fs.readFileSync('./data/users.json'));
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10); // Parse user ID as an integer
    const users = JSON.parse(fs.readFileSync('./data/users.json')); // Load users
    const activities = JSON.parse(fs.readFileSync('./data/activities.json')); // Load activities

    // Find the user by ID
const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter activities for the user
    const userActivities = activities.filter((activity) => parseInt(activity.userId, 10) === userId);

    // Send response
    res.json({ ...user, activities: userActivities });
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Error fetching user' });
  }
});



module.exports = router;
