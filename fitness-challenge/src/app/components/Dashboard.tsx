import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bike, Trophy, Activity, MapPin,
} from "lucide-react";

import { useTheme } from "@/app/hooks/useTheme";

import Leaderboard from "./Leaderboard";
import WeeklyProgress from "./WeeklyProgress";
import ActivityFeedPage from "./ActivityFeedPage";
import SubmitQuote from "./SubmitQuote";
import Quotes from "./Quotes";
import WeeklyProgressBar from "./WeeklyProgressBar";
import ToggleButtons from "./ToggleButtons";
import { fetchUsersAndTotalKm, fetchRecentActivities } from "../utils/utils";
import { User, Activity as UserActivity } from "@/app/types/types";

export default function Dashboard() {
  const [currentStage, setCurrentStage] = useState(0);
  const { t, colors, theme } = useTheme();
  const {
    stages,
    totalPoints,
    weatherIcons,
    stageColors
  } = theme;

  const [users, setUsers] = useState<User[]>([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
  const [showActivityFeed, setShowActivityFeed] = useState(false);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    fetchUsersAndTotalKm(setUsers, setTotalKm, setLoading, setError);
  }, []);

  useEffect(() => {
    if (showActivityFeed) {
      fetchRecentActivities(users, setRecentActivities, setLoadingActivities, setError);
    }
  }, [showActivityFeed, users]);

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
return (
  <div
    className="min-h-screen px-4 pb-12"
    style={{
      background: colors.background,
      color: colors.text,
    }}
  >
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <motion.header
        className="text-center pt-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl">{currentProgress.emoji}</div>
        <h1 className="text-3xl md:text-4xl font-bold my-2">
          {t.dashboardTitle}
        </h1>
        <p style={{ color: colors.mutedText }}>{t.subtitle}</p>
        <motion.div
          className="mt-2 font-semibold"
          style={{ color: colors.mutedText }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <Quotes />
        </motion.div>
      </motion.header>

      {/* CURRENT STAGE */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-xl p-6 shadow-lg border"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold">
            {t.stageLabel} {currentStage + 1}: {currentProgress.name}
          </h2>
          <p style={{ color: colors.mutedText }} className="text-sm">
            {currentProgress.description}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard icon={<Trophy />} value={`${totalKm.toLocaleString()} km`} label={t.points} />
          <StatCard icon={<Activity />} value={`${weatherIcons[currentProgress.weather] || "🌤️"} ${currentProgress.weather}`} label={t.weather} />
          <StatCard icon={<Bike />} value={currentProgress.stageType} label={t.type} />
        </div>
      </motion.section>

      {/* NEXT STAGE */}
      {nextStage && (
        <motion.section
          className="rounded-xl p-6 border backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
          }}
        >
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <MapPin className="inline w-5 h-5 mr-2" />
            {t.nextStage}: {nextStage.name} {nextStage.emoji}
          </h3>
          <div className="relative mb-3">
            <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
              <motion.div
                className="h-full rounded-full"
                style={{ width: `${Math.min(progressToNext, 100)}%`, backgroundColor: colors.accent }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1" style={{ color: colors.mutedText }}>
              <span>{t.stageLabel} {currentStage + 1}</span>
              <span>{t.stageLabel} {currentStage + 2}</span>
            </div>
          </div>
          <div className="text-center font-semibold" style={{ color: colors.text }}>
            {(nextStage.pointsRequired - totalKm).toLocaleString()} {t.pointsToNext}
          </div>
        </motion.section>
      )}

      {/* TOGGLES */}
      <ToggleButtons
        showWeeklyProgress={showWeeklyProgress}
        showActivityFeed={showActivityFeed}
        setShowWeeklyProgress={setShowWeeklyProgress}
        setShowActivityFeed={setShowActivityFeed}
      />

      <WeeklyProgressBar />

      {/* LOADING / ERROR */}
      {loading && (
        <p className="text-center" style={{ color: colors.mutedText }}>
          {t.loading}
        </p>
      )}
      {error && (
        <p className="text-center" style={{ color: 'red' }}>
          {t.error}
        </p>
      )}

      {/* DYNAMIC SECTIONS */}
      {!loading && !error && showActivityFeed && <ActivityFeedPage />}
      {!loading && !error && showWeeklyProgress && <WeeklyProgress users={users} />}
      {!loading && !error && !showWeeklyProgress && !showActivityFeed && <Leaderboard users={users} />}

      {/* QUOTE SUBMIT */}
      <div className="pt-6">
        <SubmitQuote />
      </div>
    </div>
  </div>
);
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  const { colors } = useTheme();

  return (
    <div
      className="backdrop-blur-sm rounded-xl p-4 text-center shadow"
      style={{ backgroundColor: colors.card }}
    >
      <div className="mb-2" style={{ color: colors.accent }}>
        {icon}
      </div>
      <div className="text-xl font-bold" style={{ color: colors.text }}>
        {value}
      </div>
      <div className="text-sm" style={{ color: colors.mutedText }}>
        {label}
      </div>
    </div>
  );
}
