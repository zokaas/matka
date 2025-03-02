"use client";

import React, { useState, useEffect } from "react";
import { Activity, User } from "@/app/types/types";
import ActivityItem from "./ActivityItem";

interface ActivityWithUser extends Activity {
  username: string;
  profilePicture?: string;
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<ActivityWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backendUrl = "https://matka-zogy.onrender.com";

  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        setLoading(true);

        // First fetch all users
        const usersResponse = await fetch(`${backendUrl}/users`);
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const users: User[] = await usersResponse.json();

        // Process activities from all users
        const allActivities: ActivityWithUser[] = [];

        // For each user, get activities and add username
        for (const user of users) {
          try {
            const response = await fetch(
              `${backendUrl}/users/${user.username}/activities/all`
            );
            if (response.ok) {
              const userActivities: Activity[] = await response.json();
              // Add username to each activity
              const activitiesWithUser = userActivities.map((activity) => ({
                ...activity,
                username: user.username,
                profilePicture: user.profilePicture,
              }));
              allActivities.push(...activitiesWithUser);
            }
          } catch (userError) {
            console.error(
              `Error fetching activities for ${user.username}:`,
              userError
            );
            // Continue with other users even if one fails
          }
        }

        // Sort by date (newest first) and limit to 20
        const recentActivities = allActivities
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 20);

        setActivities(recentActivities);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, [backendUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  // Feature flag for showing the full activity feed or the "coming soon" banner
  const FEATURE_ENABLED = false; // Set to true when ready to launch

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
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-purple-600">
          Viimeisimmät Suoritukset
        </h1>
        <p className="text-gray-600 mt-2">
          Katso mitä Petolliset ovat tehneet viime aikoina!
        </p>
      </header>

      <div className="space-y-6">
        {activities.length === 0 ? (
          <div className="text-center p-6 bg-white rounded-lg shadow">
            <p className="text-gray-500">Ei aktiivisuuksia saatavilla.</p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}
