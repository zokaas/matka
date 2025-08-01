"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "@/app/types/types";
import ActivityItem from "./ActivityItem";

interface ActivityWithUser extends Activity {
  username: string;
  profilePicture?: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRecentActivities() {
      try {
        setLoading(true);
        setError("");

        // Use the new backend endpoint that returns pre-sorted activities
        const response = await fetch(
          `${backendUrl}/activities/recent?limit=20`
        );

        if (!response.ok) {
          throw new Error("Aktiivisuuksien lataaminen epäonnistui.");
        }

        const recentActivities = await response.json();
        setActivities(recentActivities);
      } catch (err) {
        // If the new endpoint fails (since it might not be deployed yet), fall back to the old method
        try {
          await fetchActivitiesLegacy();
        } catch (legacyErr) {
          setError(err instanceof Error ? err.message : "Tapahtui virhe.");
          console.error("Error fetching recent activities:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    // Legacy method for backwards compatibility
    async function fetchActivitiesLegacy() {
      // Fetch all users in one request
      const usersResponse = await fetch(`${backendUrl}/users`);
      if (!usersResponse.ok)
        throw new Error("Käyttäjien lataaminen epäonnistui.");
      const users = await usersResponse.json();

      // Fetch all activities in parallel for better performance
      const activityPromises = users.map(async (user: { username: string; profilePicture?: string }) => {
        try {
          const response = await fetch(
            `${backendUrl}/users/${user.username}/activities/all`
          );
          if (!response.ok)
            throw new Error(
              `Aktiivisuuden haku epäonnistui käyttäjälle ${user.username}.`
            );
          const userActivities = await response.json();

          // Return activities with user information attached
          return userActivities.map((activity: Activity) => ({
            ...activity,
            username: user.username,
            profilePicture: user.profilePicture,
          }));
        } catch (error) {
          console.error(
            `Error fetching activities for ${user.username}:`,
            error
          );
          return []; // Ensure errors for one user don't block others
        }
      });

      // Wait for all activity requests to finish
      const allActivities = (await Promise.all(activityPromises)).flat();

      // Sort with a fallback strategy for activities on the same day
      const recentActivities = allActivities
        .sort((a, b) => {
          // Parse date strings to full ISO format
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          // If dates are different, sort by date
          if (dateB !== dateA) {
            return dateB - dateA; // Sort in descending order (newest first)
          }

          // If dates are the same, try to sort by ID
          return b.id - a.id;
        })
        .slice(0, 20); // Limit to 20 most recent activities

      setActivities(recentActivities);
    }

    fetchRecentActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  // Feature flag for "coming soon" message
  const FEATURE_ENABLED = true; // Change to false to display "coming soon" banner

  if (!FEATURE_ENABLED) {
    return (
      <div className="text-center bg-yellow-100 text-yellow-700 p-4 rounded-lg">
        <h2 className="text-xl font-semibold">TULOSSA PIAN 🚀</h2>
        <p className="text-sm">
          Tämä ominaisuus julkaistaan kun olette saaneet kasaan 30 000km.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-xl font-bold text-gray-800 flex items-center mb-2">
          Viimeisimmät suoritukset
        </h1>
      </header>

      {/* Activity Feed */}
      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <p className="text-gray-500">Ei aktiivisuuksia saatavilla.</p>
          </div>
        ) : (
          <AnimatePresence>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <ActivityItem activity={activity} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
