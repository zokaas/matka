// components/Dashboard.tsx - UPDATED WITH DYNAMIC WEEKLY GOALS
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Activity, TrendingUp, Calendar, Target, Users, Info
} from "lucide-react";

import { useTheme } from "@/app/hooks/useTheme";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal"; // Now uses dynamic system
import { useCurrentStage } from "@/app/hooks/useCurrentStage";

import Leaderboard from "./Leaderboard";
import WeeklyProgress from "./WeeklyProgress";
import ActivityFeedPage from "./ActivityFeedPage";
import SubmitQuote from "./SubmitQuote";
import WeeklyProgressBar from "./WeeklyProgressBar"; // Enhanced version

import { fetchUsersAndTotalKm } from "../utils/utils";
import { User } from "@/app/types/types";
// import StageCard from "./StageCard";
import Quotes from "./Quotes";
import PartyBanner from "./PartyBanner";
import ImprovedWeeklyDisplay from "./ImprovedWeeklyDisplay";

export default function Dashboard() {
  const { t, colors, theme } = useTheme();
  const { stages } = theme;

  const [users, setUsers] = useState<User[]>([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'leaderboard' | 'weekly' | 'feed'>('leaderboard');
  const [showGoalDetails, setShowGoalDetails] = useState(false);

  const { currentStage } = useCurrentStage(stages, totalKm);
  const weeklyGoalData = useWeeklyGoal(users); // Dynamic weekly goal data
  const currentWeek = weeklyGoalData.allWeeksData.find(w => w.isCurrent);
  
  useEffect(() => {
    fetchUsersAndTotalKm(setUsers, setTotalKm, setLoading, setError);
  }, []);

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
          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Quotes />
          </motion.div>
        </motion.header> */}
        {/* STAGE PROGRESS */}
        {/* <StageCard totalKm={totalKm} /> */}
        {/* <PartyBanner users={users} /> */}

        {/* ENHANCED WEEKLY PROGRESS BAR */}
        <WeeklyProgressBar />

        {/* VIEW SELECTOR */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-yellow-200 inline-flex">
            {viewOptions.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeView === key
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:"
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

// Helper component for goal metrics
function GoalMetricCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`p-3 rounded-lg ${bgColor} transition-transform hover:scale-105`}>
      <div className={`${color} mb-2 flex justify-center`}>
        {icon}
      </div>
      <div className="text-center">
        <div className={`text-lg font-bold ${color}`}>
          {value}
        </div>
        <div className="text-xs text-gray-600">
          {label}
        </div>
      </div>
    </div>
  );
}