const express = require("express");
const fs = require("fs");
const router = express.Router();
const { addPlaceToRoute, calculateProgressData } = require("../utils/routeUtils");
const { broadcastRouteUpdate } = require("../utils/socket");
const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const ROUTE_FILE_PATH = "./data/route.json";

// Fetch progress data
router.get("/", (req, res) => {
  try {
    const route = JSON.parse(fs.readFileSync(ROUTE_FILE_PATH));
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    const activities = JSON.parse(fs.readFileSync("./data/activities.json"));

    // Calculate total points from all activities
    const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0);

    // Calculate each user's contributions and points
    const userContributions = users.map((user) => {
      const userActivities = activities.filter(
        (activity) => parseInt(activity.userId, 10) === parseInt(user.id, 10)
      );

      const points = userActivities.reduce((sum, activity) => sum + activity.points, 0);

      return {
        id: user.id,
        name: user.name,
        points,
        activities: userActivities,
      };
    }).sort((a, b) => b.points - a.points); // Sort by points in descending order

    // Calculate progress on the route
    let cumulativeDistance = 0;
    const routeWithProgress = route.map((point, index) => {
      cumulativeDistance += point.distance || 0;

      return {
        ...point,
        reached: totalPoints >= cumulativeDistance,
      };
    });

    // Find the current route point and remaining distance
    const currentRoutePoint = routeWithProgress.find(
      (point, index) => totalPoints < routeWithProgress.slice(0, index + 1).reduce((sum, p) => sum + p.distance, 0)
    ) || routeWithProgress[routeWithProgress.length - 1];

    const totalDistance = route.reduce((sum, point) => sum + (point.distance || 0), 0);
    const remainingDistance = Math.max(0, totalDistance - totalPoints);

    res.json({
      totalPoints: Math.round(totalPoints),
      route: routeWithProgress,
      totalDistance,
      remainingDistance,
      userContributions,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: "Error fetching progress" });
  }
});

// Fetch the route
router.get("/route", (req, res) => {
  try {
    const route = JSON.parse(fs.readFileSync(ROUTE_FILE_PATH));
    res.json(route);
  } catch (error) {
    console.error("Error fetching route:", error.message);
    res.status(500).json({ message: "Error fetching route" });
  }
});

// Broadcast route updates
router.post("/update", (req, res) => {
  try {
    broadcastRouteUpdate();
    res.json({ message: "Route updated and broadcasted" });
  } catch (error) {
    console.error("Error updating route:", error.message);
    res.status(500).json({ message: "Error updating route" });
  }
});

// Add a new place to the route
router.post("/addPlace", (req, res) => {
  try {
    const route = JSON.parse(fs.readFileSync(ROUTE_FILE_PATH));
    const { newPlace, insertAfterId } = req.body;

    if (!newPlace || !newPlace.location || !newPlace.coordinates) {
      return res.status(400).json({ message: "Invalid place data" });
    }

    const updatedRoute = addPlaceToRoute(route, newPlace, insertAfterId);
    fs.writeFileSync(ROUTE_FILE_PATH, JSON.stringify(updatedRoute, null, 2));

    res.json({ message: "Place added successfully", route: updatedRoute });
  } catch (error) {
    console.error("Error adding place:", error.message);
    res.status(500).json({ message: "Error adding place" });
  }
});

// Recalculate distances using Directions API
router.post("/recalculate", async (req, res) => {
  try {
    const route = JSON.parse(fs.readFileSync(ROUTE_FILE_PATH));

    for (let i = 0; i < route.length - 1; i++) {
      const start = route[i].coordinates;
      const end = route[i + 1].coordinates;

      const result = await client.directions({
        params: {
          origin: `${start[0]},${start[1]}`,
          destination: `${end[0]},${end[1]}`,
          mode: "driving",
          key: "AIzaSyCWN3NhfmX5svzs3lknU5Y2FyoiEPNyWYM",
        },
      });

      if (result.data.status === "OK") {
        const leg = result.data.routes[0].legs[0];
        route[i].distance = leg.distance.value / 1000; // Kilometreinä
      } else {
        throw new Error(`Directions API failed for segment ${i}: ${result.data.status}`);
      }
    }

    // Viimeiselle pisteelle ei lasketa etäisyyttä
    route[route.length - 1].distance = 0;

    fs.writeFileSync(ROUTE_FILE_PATH, JSON.stringify(route, null, 2));
    res.json({ message: "Distances recalculated successfully", route });
  } catch (error) {
    console.error("Error recalculating distances:", error.message);
    res.status(500).json({ message: "Error recalculating distances" });
  }
});

module.exports = router;
