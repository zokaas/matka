const fs = require('fs');
const path = require('path');
const { saveRecalculatedRoute } = require('./utils/routeUtils');

// File paths
const usersFilePath = path.resolve('./data/users.json');
const routeFilePath = path.resolve('./data/route.json');
const activitiesFilePath = path.resolve('./data/activities.json');

// Reset Users
async function resetUsers() {
  try {
    if (!fs.existsSync(usersFilePath)) {
      throw new Error('Users file does not exist.');
    }

    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    users.forEach((user) => {
      user.total_points = 0; // Reset points to 0
    });
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    console.log('✅ User points have been reset.');
  } catch (error) {
    console.error('❌ Error resetting users:', error.message);
  }
}

// Reset Route
async function resetRoute() {
  try {
    if (!fs.existsSync(routeFilePath)) {
      throw new Error('Route file does not exist.');
    }

    const route = JSON.parse(fs.readFileSync(routeFilePath, 'utf8'));
    route.forEach((point) => {
      point.reached = false; // Reset reached to false
    });

    // Recalculate distances
    saveRecalculatedRoute(routeFilePath);

    console.log('✅ Route progress has been reset and distances recalculated.');
  } catch (error) {
    console.error('❌ Error resetting route:', error.message);
  }
}

// Reset Activities
async function resetActivities() {
  try {
    fs.writeFileSync(activitiesFilePath, JSON.stringify([], null, 2)); // Reset activities to an empty array
    console.log('✅ Activities have been reset.');
  } catch (error) {
    console.error('❌ Error resetting activities:', error.message);
  }
}

// Execute all resets
async function resetAll() {
  console.log('🔄 Starting the reset process...');
  await resetUsers();
  await resetRoute();
  await resetActivities();
  console.log('✅ All resets complete!');
}

// Execute the reset
resetAll();
