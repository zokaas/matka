import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Activity, TrendingUp, Users, Target,
} from "lucide-react";

import { useTheme } from "@/app/hooks/useTheme";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal";
import { useCurrentStage } from "@/app/hooks/useCurrentStage";

import Leaderboard from "./Leaderboard";
import WeeklyProgress from "./WeeklyProgress";
import ActivityFeedPage from "./ActivityFeedPage";
import SubmitQuote from "./SubmitQuote";
import Quotes from "./Quotes";
import WeeklyProgressBar from "./WeeklyProgressBar";

import { fetchUsersAndTotalKm } from "../utils/utils";
import { User } from "@/app/types/types";
import StageCard from "./StageCard";

export default function Dashboard() {
  const { t, colors, theme } = useTheme();
  const { stages } = theme;

  const [users, setUsers] = useState<User[]>([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'leaderboard' | 'weekly' | 'feed'>('leaderboard');

  const { currentStage, current, next, progressToNext } = useCurrentStage(stages, totalKm);
  const weeklyGoalData = useWeeklyGoal(users);

  useEffect(() => {
    fetchUsersAndTotalKm(setUsers, setTotalKm, setLoading, setError);
  }, []);

  const totalActivities = users.reduce((sum, user) => sum + user.activities.length, 0);
  const avgKmPerUser = users.length > 0 ? totalKm / users.length : 0;

  const viewOptions = [
    { key: 'leaderboard', label: t.tabs.leaderboard, icon: Trophy },
    { key: 'weekly', label: 'Viikko', icon: TrendingUp },
    { key: 'feed', label: 'Feed', icon: Activity },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-4 border-yellow-500 rounded-full border-t-transparent"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 p-4 bg-white rounded-lg shadow">
          {t.error}: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-4 py-6"
      style={{
        background: `linear-gradient(to br, ${colors.background}, #fffbeb)`,
        color: colors.text,
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HERO */}
        {/* <motion.header
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl mb-3">{current.emoji}</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            {t.dashboardTitle}
          </h1>
          <p className="text-gray-600 mb-4">{t.subtitle}</p>

          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Quotes />
          </motion.div>
        </motion.header> */}
<StageCard
 totalKm={totalKm}
/>


        {/* WEEKLY PROGRESS BAR */}
        <WeeklyProgressBar />

        {/* VIEW SELECTOR */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-yellow-200 inline-flex">
            {viewOptions.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeView === key
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN VIEW */}
        <motion.section
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === "leaderboard" && <Leaderboard users={users} />}
          {activeView === "weekly" && <WeeklyProgress users={users} />}
          {activeView === "feed" && <ActivityFeedPage />}
        </motion.section>

        {/* SUBMIT QUOTE */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-200"
        >
          <SubmitQuote />
        </motion.section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color = "text-gray-600",
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
      <div className={color}>{icon}</div>
      <div>
        <div className="text-lg font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}
