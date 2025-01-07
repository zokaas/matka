const fs = require('fs');
const { Client } = require('@googlemaps/google-maps-services-js');

// Initialize Google Maps client
const client = new Client({});

/**
 * Calculate direct distance between two points using Haversine formula
 */
function calculateHaversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}

/**
 * Calculate real-world route distance using Google Maps API
 */
async function calculateRealRouteDistance(origin, destination, mode = 'DRIVING') {
  try {
    const response = await client.directions({
      params: {
        origin: `${origin[0]},${origin[1]}`,
        destination: `${destination[0]},${destination[1]}`,
        mode: mode.toLowerCase(),
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const route = response.data.routes[0];
      return {
        distance: route.legs[0].distance.value / 1000, // Convert to kilometers
        path: route.overview_path,
        duration: route.legs[0].duration.value
      };
    }
    throw new Error('Route calculation failed');
  } catch (error) {
    console.error('Error calculating route:', error);
    // Fallback to Haversine distance
    const distance = calculateHaversineDistance(
      origin[0], origin[1],
      destination[0], destination[1]
    );
    return { distance, path: null, duration: null };
  }
}

/**
 * Recalculate distances for the entire route
 * @param {Array} route Array of route points
 * @param {Object} options Configuration options
 * @returns {Promise<Array>} Updated route with recalculated distances
 */
async function recalculateDistances(route) {
  let cumulativeDistance = 0;

  for (let i = 0; i < route.length; i++) {
    if (i === 0) {
      // First point has no distance
      route[i].distance = 0;
      route[i].cumulativeDistance = 0;
    } else {
      const prev = route[i - 1];
      const current = route[i];

      // Calculate distance using the Haversine formula
      const distance = calculateHaversineDistance(
        prev.coordinates[0],
        prev.coordinates[1],
        current.coordinates[0],
        current.coordinates[1]
      );

      current.distance = Math.round(distance);
      cumulativeDistance += current.distance;
      current.cumulativeDistance = Math.round(cumulativeDistance);
    }
  }

  return route;
}

/**
 * Add a new place to the route
 */
async function addPlaceToRoute(route, newPlace, insertAfterId, options = {}) {
  const insertIndex = route.findIndex(point => point.id === insertAfterId) + 1;
  const updatedRoute = [...route];
  
  updatedRoute.splice(insertIndex, 0, {
    ...newPlace,
    id: Math.max(...route.map(p => p.id)) + 1,
    distance: 0,
    cumulativeDistance: 0
  });

  return await recalculateDistances(updatedRoute, options);
}

/**
 * Save route data to file
 */
async function saveRoute(route, filePath, options = {}) {
  try {
    const updatedRoute = await recalculateDistances(route, options);
    fs.writeFileSync(filePath, JSON.stringify(updatedRoute, null, 2));
    return updatedRoute;
  } catch (error) {
    console.error('Error saving route:', error);
    throw error;
  }
}

/**
 * Load and recalculate route from file
 */
async function loadAndRecalculateRoute(filePath, options = {}) {
  try {
    const route = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return await recalculateDistances(route, options);
  } catch (error) {
    console.error('Error loading and recalculating route:', error);
    throw error;
  }
}

module.exports = {
  calculateHaversineDistance,
  calculateRealRouteDistance,
  recalculateDistances,
  addPlaceToRoute,
  saveRoute,
  loadAndRecalculateRoute
};