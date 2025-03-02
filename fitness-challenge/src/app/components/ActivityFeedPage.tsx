"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, User } from "@/app/types/types";
import ActivityItem from "./ActivityItem";

interface ActivityWithUser extends Activity {
  username: string;
  profilePicture?: string;
}

const backendUrl = "https://matka-zogy.onrender.com";

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch activities more efficiently
  const fetchRecentActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch all users in one request
      const usersResponse = await fetch(`${backendUrl}/users`);
      if (!usersResponse.ok)
        throw new Error("Käyttäjien lataaminen epäonnistui.");
      const users: User[] = await usersResponse.json();

      // Fetch all activities in parallel for better performance
      const activityPromises = users.map(async (user) => {
        try {
          const response = await fetch(
            `${backendUrl}/users/${user.username}/activities/all`
          );
          if (!response.ok)
            throw new Error(
              `Aktiivisuuden haku epäonnistui käyttäjälle ${user.username}.`
            );
          const userActivities: Activity[] = await response.json();

          return userActivities.map((activity) => ({
            ...activity,
            username: user.username,
            profilePicture: user.profilePicture,
          }));
        } catch (error) {
          console.error(
            `Error fetching activities for ${user.username}:`,
            error
          );
          return []; // Ensure errors for one user don’t block others
        }
      });

      // Wait for all activity requests to finish
      const allActivities = (await Promise.all(activityPromises)).flat();

      // Sort by date (newest first) and limit to 20
      const recentActivities = allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 20);

      setActivities(recentActivities);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tapahtui virhe.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecentActivities();
  }, [fetchRecentActivities]);

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
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-600">
          Viimeisimmät suoritukset
        </h1>
        <p className="text-gray-600 mt-2">
          Katso mitä Petolliset ovat tehneet viime aikoina!
        </p>
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
