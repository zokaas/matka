// components/WeeklyProgressBar.tsx - UPDATED: Only show completed + current weeks
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Info, Calendar, Target, BarChart2 } from "lucide-react";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal";
import { useTheme } from "@/app/hooks/useTheme";
import { challengeParams } from "@/app/constants/challengeParams";

const r1 = (n: number) => Number(n.toFixed(1));

const WeeklyProgressBar = () => {
  const { t } = useTheme();
  const { users, loading, error } = useFetchUsers();
  const [showDetails, setShowDetails] = useState(false);
  const [showAllWeeks, setShowAllWeeks] = useState(false);
  const weeklyGoalData = useWeeklyGoal(users);

  const {
    weeklyGoal,
    weeklyProgress,
    weeklyGoalPerUser,
    remainingDistance,
    progressPercentage,
    goalAdjustment,
    allWeeksData,
    hasHistory,
    performanceTrend
  } = weeklyGoalData;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-16" aria-busy>
        <motion.div
          className="w-5 h-5 border-4 border-yellow-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          aria-label="Loading weekly progress"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 rounded text-yellow-600 bg-yellow-50 text-center text-sm border border-yellow-200">
        {t.weeklyProgressBar?.errorLoadingData ?? "Virhe ladattaessa tietoja"}
      </div>
    );
  }

  const currentWeek = allWeeksData.find((week) => week.isCurrent);
  const completedWeeks = allWeeksData.filter((week) => week.isCompleted);
  const previousWeek = completedWeeks[completedWeeks.length - 1];

  // Only count completed weeks for success rate
  const successfulWeeksCount = completedWeeks.filter((w) => w.achievementRate >= 1).length;
  const averageAchievementRate = completedWeeks.length
    ? completedWeeks.reduce((acc, w) => acc + w.achievementRate, 0) / completedWeeks.length
    : 0;

  const bestWeek = completedWeeks.length
    ? completedWeeks.reduce((best, w) => (w.achievementRate > best.achievementRate ? w : best), completedWeeks[0])
    : null;

  const cumulativeProgress =
    (previousWeek?.cumulativeProgress ?? currentWeek?.cumulativeProgress ?? 0);

  const totalDistance = challengeParams.totalDistance;

  // Filter to only show completed + current weeks
  const visibleWeeks = allWeeksData.filter(week => week.isCompleted || week.isCurrent);

  const TrendIcon =
    performanceTrend === "improving" ? TrendingUp : performanceTrend === "declining" ? TrendingDown : Info;

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-yellow-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-medium text-slate-800">
              {t.weeklyProgressBar?.weeklyGoal ?? "Viikkotavoite"}
            </h2>
            <motion.button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 hover:bg-yellow-50 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={showDetails}
              aria-label="Näytä lisätiedot"
            >
              <Info className="w-4 h-4 text-slate-500" />
            </motion.button>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">
            <span className="text-slate-800">{r1(weeklyProgress)}</span>
            <span className="text-slate-600"> / {r1(weeklyGoal)} km</span>
            <span className="text-xs text-slate-500 ml-1">
              ({r1(progressPercentage)}%)
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {Number(weeklyGoalPerUser).toFixed(1)} km/hlö
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mb-3">
        <div
          className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner"
          aria-label="Viikkopalkki"
          role="progressbar"
          aria-valuenow={Math.min(progressPercentage, 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className={`h-3 rounded-full transition-all duration-500 relative ${
              progressPercentage >= 100
                ? "bg-gradient-to-r from-green-400 to-green-500"
                : progressPercentage >= 80
                ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
                : "bg-gradient-to-r from-yellow-200 to-yellow-400"
            }`}
            style={{
              width: `${Math.min(progressPercentage, 100)}%`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {progressPercentage >= 90 && (
              <motion.div
                className="absolute inset-0 rounded-full opacity-30"
                style={{ backgroundColor: "#facc15", filter: "blur(4px)" }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>
        {/* Bicycle emoji positioned outside progress bar */}
        <motion.div
          className="absolute top-0 text-sm"
          style={{ transform: "translateY(-4px) translateX(-8px) scaleX(-1)", opacity: progressPercentage > 5 ? 1 : 0 }}
          initial={{ left: "0%" }}
          animate={{ left: `${Math.min(progressPercentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          aria-hidden
        >
          🚴‍♂️
        </motion.div>
      </div>

      {/* Bottom info */}
      <div className="flex justify-between items-center text-sm">
        <div>
          {remainingDistance > 0 ? (
            <span className="text-slate-600">
              <span className="font-medium text-slate-800">
                {r1(remainingDistance)} km
              </span>{" "}
              jäljellä
            </span>
          ) : (
            <span className="font-medium text-green-600">Viikkotavoite saavutettu! 🎉</span>
          )}
        </div>
      </div>

      {/* Details panel */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-slate-200"
          >
            <div className="space-y-4 text-sm">
              {/* Current week detailed info */}
              {currentWeek && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 text-xs flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Viikko {currentWeek.weekNumber} (
                      {currentWeek.weekStart.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" })} -{" "}
                      {currentWeek.weekEnd.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" })})
                    </span>
                    <span className="text-xs font-medium text-yellow-700">
                      {progressPercentage >= 100 ? "🎯 Tavoite saavutettu!" : `🚴‍♂️ Päivä ${currentWeek.daysInWeek}/7`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-slate-800">
                        Edistyminen: {r1(currentWeek.achieved)} km
                      </div>
                      <div className="text-xs text-slate-600">
                        Tavoite: {r1(currentWeek.goalSet)} km
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600">
                        {r1(currentWeek.achievementRate * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Previous week comparison */}
              {previousWeek && (
                <div
                  className="p-3 rounded-lg border"
                  style={{
                    backgroundColor: previousWeek.achievementRate >= 1 ? "#f0fdf4" : "#fef2f2",
                    borderColor: previousWeek.achievementRate >= 1 ? "#22c55e" : "#ef4444",
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-600 flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" />
                      Viime viikko (Viikko {previousWeek.weekNumber})
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        previousWeek.achievementRate >= 1 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {previousWeek.achievementRate >= 1 ? "✅ Onnistui" : "❌ Ei täyttynyt"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium text-slate-800">
                        {r1(previousWeek.achieved)} km
                      </span>
                      <span className="text-slate-600"> / {r1(previousWeek.goalSet)} km</span>
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        previousWeek.achievementRate >= 1 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {r1(previousWeek.achievementRate * 100)}%
                    </div>
                  </div>
                  {/* Progress bar for previous week */}
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          previousWeek.achievementRate >= 1
                            ? "bg-gradient-to-r from-green-400 to-green-500"
                            : "bg-gradient-to-r from-red-400 to-red-500"
                        }`}
                        style={{ width: `${Math.min(previousWeek.achievementRate * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Weekly history toggle - only show if there are completed weeks */}
              {completedWeeks.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllWeeks(!showAllWeeks)}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors underline"
                  >
                    {showAllWeeks ? "Piilota viikkohistoria" : `Näytä viikkohistoria (${visibleWeeks.length} viikkoa)`}
                  </button>
                </div>
              )}

              {/* Weeks history - only completed + current weeks */}
              <AnimatePresence>
                {showAllWeeks && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 max-h-64 overflow-y-auto"
                  >
                    <h4 className="font-medium text-slate-800 text-sm flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Suoritetut viikot + nykyinen viikko
                    </h4>
                    {visibleWeeks.map((week) => (
                      <div
                        key={week.weekKey}
                        className={`p-2 rounded border text-xs ${
                          week.isCurrent
                            ? "bg-yellow-50 border-yellow-300"
                            : week.achievementRate >= 1
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Viikko {week.weekNumber}</span>
                            {week.isCurrent && <span className="text-yellow-600">• NYK</span>}
                          </div>
                          <div className="text-right">
                            <span
                              className={`font-medium ${
                                week.isCurrent
                                  ? "text-yellow-600"
                                  : week.achievementRate >= 1
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {r1(week.achieved)}/{r1(week.goalSet)} km
                            </span>
                            {week.isCompleted && (
                              <span className="text-gray-500 ml-1">
                                ({r1(week.achievementRate * 100)}%)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mini progress bar for each week */}
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${
                                week.isCurrent
                                  ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
                                  : week.achievementRate >= 1
                                  ? "bg-gradient-to-r from-green-400 to-green-500"
                                  : "bg-gradient-to-r from-red-400 to-red-500"
                              }`}
                              style={{ width: `${Math.min(week.achievementRate * 100, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-gray-500 mt-1 text-[10px]">
                          {week.weekStart.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" })} -{" "}
                          {week.weekEnd.toLocaleDateString("fi-FI", { day: "numeric", month: "numeric" })}
                          {week.isCurrent && <span className="ml-2">(Päivä {week.daysInWeek}/7)</span>}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary stats */}
              {visibleWeeks.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-medium text-slate-800 text-sm mb-2">Yhteenveto</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div style={{ color: "rgb(100, 116, 139)" }}>Viikkoja yhteensä</div>
                      <div className="font-bold text-slate-800">{allWeeksData.length}</div>
                    </div>
                    <div>
                      <div style={{ color: "rgb(100, 116, 139)" }}>Onnistuneita viikkoja</div>
                      <div className="font-bold text-slate-800">
                        {successfulWeeksCount} / {completedWeeks.length}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "rgb(100, 116, 139)" }}>Keskiarvo saavutus</div>
                      <div className="font-bold text-slate-800">{r1(averageAchievementRate * 100)}%</div>
                    </div>
                    <div>
                      <div style={{ color: "rgb(100, 116, 139)" }}>Kertyneet kilometrit</div>
                      <div className="font-bold text-slate-800">
                        {r1(cumulativeProgress)} / {r1(totalDistance)} km
                      </div>
                    </div>
                    {bestWeek && (
                      <div className="col-span-2">
                        <div style={{ color: "rgb(100, 116, 139)" }}>Paras viikko</div>
                        <div className="font-bold text-slate-800">
                          Viikko {bestWeek.weekNumber}: {r1(bestWeek.achieved)} / {r1(bestWeek.goalSet)} km (
                          {r1(bestWeek.achievementRate * 100)}%)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WeeklyProgressBar;