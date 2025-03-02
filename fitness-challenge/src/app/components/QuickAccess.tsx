import { useState, useEffect, useCallback } from "react";
import { User, Activity } from "@/app/types/types";
import { fetchRecentActivities, fetchUsersAndTotalKm } from "../utils/utils";
import ActivityFeedPage from "./ActivityFeedPage";
import Header from "./Insights/Header";
import Leaderboard from "./Leaderboard";
import SubmitQuote from "./SubmitQuote";
import ToggleButtons from "./ToggleButtons";
import Map from "./Map"; // Ensure you have a Map component in the specified path
import WeeklyProgress from "./WeeklyProgress";
import { motion } from "framer-motion";
import Quotes from "./Quotes";


const backendUrl = "https://matka-zogy.onrender.com";

export default function QuickAccess() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    fetchUsersAndTotalKm(setUsers, setTotalKm, setLoading, setError);
  }, []);

  useEffect(() => {
    if (showActivityFeed) {
      fetchRecentActivities(
        users,
        setRecentActivities,
        setLoadingActivities,
        setError
      );
    }
  }, [showActivityFeed, users]);

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
      <Map totalKm={totalKm} />
      <ToggleButtons
        showWeeklyProgress={showWeeklyProgress}
        showActivityFeed={showActivityFeed}
        setShowWeeklyProgress={setShowWeeklyProgress}
        setShowActivityFeed={setShowActivityFeed}
      />

      {loading && (
        <div className="text-center text-gray-500 animate-pulse">
          Ladataan käyttäjiä...
        </div>
      )}
      {error && <div className="text-center text-red-500">Virhe: {error}</div>}

      {!loading && !error && showActivityFeed && <ActivityFeedPage />}
      {!loading && !error && !showWeeklyProgress && !showActivityFeed && (
        <Leaderboard users={users} />
      )}
      {!loading && !error && showWeeklyProgress && !showActivityFeed && (
        <WeeklyProgress users={users} />
      )}

      {/* Submit quote with proper spacing */}
      <div className="w-full pt-2 sm:pt-4">
        <SubmitQuote />
      </div>
    </div>
  );
}
