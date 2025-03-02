import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Map from "./Map";
import { useTargetPaces } from "@/app/hooks/useTargetPaces";
import { useWeeklyInsights } from "@/app/hooks/useWeeklyInsights";
import { User, Activity } from "@/app/types/types";
import SubmitQuote from "./SubmitQuote";
import Quotes from "./Quotes";
import CommentsSection from "./CommentsSection";
import ActivityReactions from "./ActivityReactions";
import ActivityFeedPage from "./ActivityFeedPage";

interface ActivityWithUser extends Activity {
  username: string;
  profilePicture?: string;
}

const backendUrl = "https://matka-zogy.onrender.com";

export default function QuickAccess() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [recentActivities, setRecentActivities] = useState<ActivityWithUser[]>(
    []
  );
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  // Use the hooks here instead of inline calculations
  const targetPaces = useTargetPaces(users);
  const weeklyInsights = useWeeklyInsights(users, targetPaces);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch total kilometers
        const totalResponse = await fetch(`${backendUrl}/total-kilometers`);
        if (!totalResponse.ok)
          throw new Error("Failed to fetch total kilometers");
        const totalData = await totalResponse.json();
        setTotalKm(totalData.totalKm);

        // Fetch users
        const usersResponse = await fetch(`${backendUrl}/users`);
        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData: User[] = await usersResponse.json();
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fix the declaration order issue in QuickAccess.tsx

  // Define fetchRecentActivities using useCallback before using it in useEffect
  const fetchRecentActivities = useCallback(async () => {
    try {
      setLoadingActivities(true);

      // Process activities from all users
      const allActivities: ActivityWithUser[] = [];

      // For each user, get activities and add username
      for (const user of users) {
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
      }

      // Sort by date (newest first) and limit to 10
      const activities = allActivities
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

      setRecentActivities(activities);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingActivities(false);
    }
  }, [users]); // Remove backendUrl from dependencies

  // Then use fetchRecentActivities in useEffect
  useEffect(() => {
    if (showActivityFeed) {
      fetchRecentActivities();
    }
  }, [showActivityFeed, fetchRecentActivities]);
  const toggleComments = (activityId: number) => {
    setExpandedActivity(expandedActivity === activityId ? null : activityId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <motion.header
        className="p-4 rounded-lg text-center"
        animate={{ opacity: [0, 1], y: [-20, 0] }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-2xl font-bold text-purple-600">PETOLLISET🔥</h1>
        <motion.div
          className="mt-4 text-lg font-bold text-purple-500"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Quotes />
        </motion.div>
      </motion.header>
      <div>
        <Map totalKm={totalKm} />
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-md shadow" role="group">
          <button
            type="button"
            className={`px-5 py-2 text-sm font-medium border border-purple-300 ${
              !showWeeklyProgress && !showActivityFeed
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } rounded-l-lg focus:z-10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`}
            onClick={() => {
              setShowWeeklyProgress(false);
              setShowActivityFeed(false);
            }}
          >
            Sijoitukset
          </button>
          <button
            type="button"
            className={`px-5 py-2 text-sm font-medium border border-purple-300 ${
              showWeeklyProgress && !showActivityFeed
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } focus:z-10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`}
            onClick={() => {
              setShowWeeklyProgress(true);
              setShowActivityFeed(false);
            }}
          >
            Viikon tilanne
          </button>
          <button
            type="button"
            className={`px-5 py-2 text-sm font-medium border border-purple-300 ${
              showActivityFeed
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } rounded-r-lg focus:z-10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`}
            onClick={() => {
              setShowWeeklyProgress(false);
              setShowActivityFeed(true);
            }}
          >
            Kannustus
          </button>
        </div>
      </div>

      {/* Loading & Error Handling */}
      {loading && (
        <div className="text-center text-gray-500 animate-pulse">
          Ladataan käyttäjiä...
        </div>
      )}
      {error && <div className="text-center text-red-500">Virhe: {error}</div>}

      {/* Activity Feed Section */}
      {!loading && !error && showActivityFeed && (
<ActivityFeedPage/>
      )}

      {/* Leaderboard */}
      {!loading && !error && !showWeeklyProgress && !showActivityFeed && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            <span>🏆</span> Sijoitukset
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {users
              .sort((a, b) => b.totalKm - a.totalKm) // Ensure users are sorted by totalKm
              .map((user, index) => (
                <motion.div
                  key={user.username}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={`/user/${user.username}`}
                    className={`block bg-white p-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                      index === 0
                        ? "border-yellow-500 border-2"
                        : index === 1
                        ? "border-gray-400 border-2"
                        : index === 2
                        ? "border-orange-400 border-2"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                          <Image
                            src={
                              user.profilePicture
                                ? `https://matka-xi.vercel.app/${user.username}.png`
                                : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                            }
                            alt="User Avatar"
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        </div>
                        {getMedal(index) && (
                          <div className="absolute -bottom-3 -right-3 text-3xl rounded-full p-1 shadow-md">
                            {getMedal(index)}
                          </div>
                        )}
                      </div>
                      <h3 className="mt-2 text-lg font-medium text-gray-800">
                        {user.username}
                      </h3>
                      <p className="font-bold text-xl text-purple-600 mt-1">
                        {user.totalKm.toLocaleString("fi-FI", {
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 1,
                        })}{" "}
                        km
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </section>
      )}

      {/* Weekly Progress Rings */}
      {!loading && !error && showWeeklyProgress && !showActivityFeed && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-2">
            <span>📊</span> Tämän viikon ranking
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            Goal: {targetPaces && Math.round(targetPaces.weeklyPerUser)} km per
            week
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {weeklyInsights.map((insight) => {
              // Find the matching user to get their profile picture
              const user = users.find((u) => u.username === insight.username);

              return (
                <Link
                  key={insight.username}
                  href={`/user/${insight.username}`}
                  className="block hover:shadow-lg transition-shadow duration-200"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-md"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 mr-4 flex-shrink-0">
                        {user && (
                          <Image
                            src={
                              user.profilePicture
                                ? `https://matka-xi.vercel.app/${user.username}.png`
                                : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                            }
                            alt={`${insight.username}'s avatar`}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-gray-800">
                          {insight.username}
                        </h4>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium">
                            Rank {insight.rank}
                          </span>
                          {insight.rank <= 3 && (
                            <span className="ml-2 text-yellow-500">
                              {insight.rank === 1
                                ? "🥇"
                                : insight.rank === 2
                                ? "🥈"
                                : "🥉"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="w-20 h-20">
                        <CircularProgressbar
                          value={insight.weeklyPercentage}
                          text={`${insight.weeklyPercentage}%`}
                          styles={buildStyles({
                            // Color based on progress
                            pathColor:
                              insight.weeklyPercentage >= 50
                                ? "#22c55e" // Green for ≥50%
                                : insight.weeklyPercentage >= 25
                                ? "#f97316" // Orange for 25-49%
                                : "#ef4444", // Red for <25%
                            textColor: "#374151",
                            trailColor: "#e5e7eb",
                            textSize: "22px",
                            // Animation
                            pathTransition: "stroke-dashoffset 0.5s ease 0s",
                          })}
                        />
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {insight.weeklyProgress.toLocaleString("fi-FI", {
                            minimumFractionDigits: 1,
                            maximumFractionDigits: 1,
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          km tällä viikolla
                        </div>

                        {insight.dailyTarget > 0 && (
                          <div className="mt-2 text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-1">
                            {insight.dailyTarget} km/pvä tarvitaan
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <SubmitQuote />
    </div>
  );
}
