import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Activity, MapPin, TrendingUp, Users, Target
} from "lucide-react";

import { useTheme } from "@/app/hooks/useTheme";

import Leaderboard from "./Leaderboard";
import WeeklyProgress from "./WeeklyProgress";
import ActivityFeedPage from "./ActivityFeedPage";
import SubmitQuote from "./SubmitQuote";
import Quotes from "./Quotes";
import WeeklyProgressBar from "./WeeklyProgressBar";
import { fetchUsersAndTotalKm } from "../utils/utils";
import { User } from "@/app/types/types";

export default function Dashboard() {
  const [currentStage, setCurrentStage] = useState(0);
  const { t, colors, theme } = useTheme();
  const {
    stages,
    totalPoints,
    weatherIcons,
  } = theme;

  const [users, setUsers] = useState<User[]>([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'leaderboard' | 'weekly' | 'feed'>('leaderboard');

  useEffect(() => {
    fetchUsersAndTotalKm(setUsers, setTotalKm, setLoading, setError);
  }, []);

  useEffect(() => {
    for (let i = stages.length - 1; i >= 0; i--) {
      if (totalKm >= stages[i].pointsRequired) {
        setCurrentStage(i);
        break;
      }
    }
  }, [totalKm, stages]);

  const currentProgress = stages[currentStage];
  const nextStage = stages[currentStage + 1];
  const progressToNext = nextStage
    ? ((totalKm - currentProgress.pointsRequired) / (nextStage.pointsRequired - currentProgress.pointsRequired)) * 100
    : 100;

  // Calculate key stats
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

        {/* HERO SECTION */}
        <motion.header
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl mb-3">{currentProgress.emoji}</div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            {t.dashboardTitle}
          </h1>
          <p className="text-gray-600 mb-4">{t.subtitle}</p>
          
          {/* INSPIRATIONAL QUOTE */}
          <motion.div
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-w-2xl mx-auto"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Quotes />
          </motion.div>
        </motion.header>

        {/* CURRENT STAGE CARD */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-200"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Stage Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{currentProgress.emoji}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {t.stageLabel} {currentStage + 1}: {currentProgress.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{currentProgress.description}</p>
                </div>
              </div>
              
              {/* Progress to Next Stage */}
              {nextStage && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {t.nextStage}: {nextStage.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(progressToNext)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-yellow-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {(nextStage.pointsRequired - totalKm).toLocaleString()} {t.pointsToNext}
                  </p>
                </div>
              )}
            </div>

            {/* Key Stats */}
            <div className="space-y-3">
              <StatCard
                icon={<Trophy className="w-5 h-5" />}
                value={`${totalKm.toLocaleString('fi-FI')} km`}
                label={t.points}
                color="text-yellow-600"
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                value={users.length.toString()}
                label="Pyöräilijöitä"
                color="text-blue-600"
              />
              <StatCard
                icon={<Activity className="w-5 h-5" />}
                value={totalActivities.toString()}
                label="Suorituksia"
                color="text-green-600"
              />
              <StatCard
                icon={<Target className="w-5 h-5" />}
                value={`${Math.round(avgKmPerUser)} km`}
                label="Keskiarvo/hlö"
                color="text-purple-600"
              />
            </div>
          </div>
        </motion.section>

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
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <motion.section
          key={activeView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'leaderboard' && <Leaderboard users={users} />}
          {activeView === 'weekly' && <WeeklyProgress users={users} />}
          {activeView === 'feed' && <ActivityFeedPage />}
        </motion.section>

        {/* QUOTE SUBMISSION */}
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
  color = "text-gray-600"
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
      <div className={`${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-lg font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}