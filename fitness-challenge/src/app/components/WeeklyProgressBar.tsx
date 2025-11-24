// components/WeeklyProgressBar.tsx - Fixed weekly history with personal goals
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Info, Calendar, Target, BarChart2, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useFetchUsers } from "@/app/hooks/useFetchUsers";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal";
import { useTheme } from "@/app/hooks/useTheme";
import { challengeParams } from "@/app/constants/challengeParams";

const r1 = (n: number) => Number(n.toFixed(1));

const WeeklyProgressBar = () => {
  const { t } = useTheme();
  const { users, loading, error } = useFetchUsers();
  const [showAllWeeks, setShowAllWeeks] = useState(false);
  const [showPersonalGoals, setShowPersonalGoals] = useState(false);
  const weeklyGoalData = useWeeklyGoal(users);

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

  // Calculate personal goals
  const personalTargetPerUser = challengeParams.totalDistance / Math.max(1, users.length);
  const personalGoals = users.map(user => {
    // Check if user has completed their personal goal
    const isCompleted = user.totalKm >= personalTargetPerUser;

    if (isCompleted) {
      return {
        username: user.username,
        isCompleted: true,
        weeklyGoal: 0,
        weeklyProgress: 0,
        progressPercentage: 100,
        totalProgress: user.totalKm,
        overallPercentage: 100
      };
    }

    // Calculate remaining distance
    const remainingPersonal = Math.max(0, personalTargetPerUser - user.totalKm);

    // Calculate remaining weeks
    const today = new Date();
    const challengeEnd = new Date(challengeParams.endDate);
    const weeksRemaining = Math.max(1, Math.ceil(
      (challengeEnd.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ));

    // Calculate weekly goal
    const weeklyGoal = r1(remainingPersonal / weeksRemaining);

    // Get activities for the current week
    const weekStart = weeklyGoalData.weekStart;
    const weeklyActivities = user.activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= weekStart;
    });

    // Calculate this week's progress
    const weeklyProgress = r1(
      weeklyActivities.reduce((sum, activity) => sum + activity.kilometers, 0)
    );

    // Calculate percentage
    const progressPercentage = weeklyGoal > 0
      ? r1((weeklyProgress / weeklyGoal) * 100)
      : 100;

    // Calculate overall percentage
    const overallPercentage = r1((user.totalKm / personalTargetPerUser) * 100);

    return {
      username: user.username,
      isCompleted,
      weeklyGoal,
      weeklyProgress,
      progressPercentage: Math.min(100, progressPercentage),
      totalProgress: user.totalKm,
      overallPercentage: Math.min(100, overallPercentage)
    };
  });

  // Sort users by completion status first, then by weekly progress percentage
  const sortedPersonalGoals = [...personalGoals].sort((a, b) => {
    // Completed users first
    if (a.isCompleted && !b.isCompleted) return -1;
    if (!a.isCompleted && b.isCompleted) return 1;

    // Then by progress percentage for active users
    return b.progressPercentage - a.progressPercentage;
  });

  // Get counts
  const completedUsersCount = personalGoals.filter(u => u.isCompleted).length;
  const activeUsersCount = users.length - completedUsersCount;

  // Calculate cumulative weekly data
  const totalWeeklyGoal = r1(personalGoals.reduce((sum, u) => sum + u.weeklyGoal, 0));
  const totalWeeklyProgress = r1(personalGoals.reduce((sum, u) => sum + u.weeklyProgress, 0));
  const overallProgressPercentage = totalWeeklyGoal > 0
    ? r1((totalWeeklyProgress / totalWeeklyGoal) * 100)
    : 100;

  // Calculate remaining distance
  const remainingDistance = Math.max(0, r1(totalWeeklyGoal - totalWeeklyProgress));

  // Get original weekly data for history
  const {
    allWeeksData,
    hasHistory,
    performanceTrend
  } = weeklyGoalData;

  const currentWeek = allWeeksData.find((week) => week.isCurrent);
  const completedWeeks = allWeeksData.filter((week) => week.isCompleted);
  const previousWeek = completedWeeks[completedWeeks.length - 1];

  // Recalculate each week's data based on personal goals
  const recalculatedWeeks = allWeeksData.map(week => {
    // For each week, calculate personal goals for each user
    const weekGoals = users.map(user => {
      // Check if user had completed their personal goal at this point
      const userActivitiesBeforeWeekEnd = user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate <= week.weekEnd;
      });

      const userKmBeforeWeekEnd = r1(
        userActivitiesBeforeWeekEnd.reduce((sum, activity) => sum + activity.kilometers, 0)
      );

      const isCompleted = userKmBeforeWeekEnd >= personalTargetPerUser;

      if (isCompleted) {
        return {
          username: user.username,
          isCompleted: true,
          weeklyGoal: 0,
          weeklyProgress: 0,
        };
      }

      // Calculate what was remaining at that point
      const remainingPersonal = Math.max(0, personalTargetPerUser - userKmBeforeWeekEnd);

      // Calculate remaining weeks from that point
      const weeksRemaining = Math.max(1, Math.ceil(
        (new Date(challengeParams.endDate).getTime() - week.weekStart.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
      ));

      // Weekly goal for that time period
      const weeklyGoal = r1(remainingPersonal / weeksRemaining);

      // Week's activities
      const weekActivities = user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= week.weekStart && activityDate <= week.weekEnd;
      });

      const weeklyProgress = r1(
        weekActivities.reduce((sum, activity) => sum + activity.kilometers, 0)
      );

      return {
        username: user.username,
        isCompleted,
        weeklyGoal,
        weeklyProgress,
      };
    });

    // Sum up the goals and progress
    const totalGoal = r1(weekGoals.reduce((sum, u) => sum + u.weeklyGoal, 0));
    const totalProgress = r1(weekGoals.reduce((sum, u) => sum + u.weeklyProgress, 0));

    // Calculate achievement rate with new personal goals logic
    const achievementRate = totalGoal > 0 ? (totalProgress / totalGoal) : 1;

    return {
      ...week,
      personalGoalSet: totalGoal, // New field to store personal goal total
      personalAchieved: totalProgress, // New field for progress with personal goals
      personalAchievementRate: achievementRate, // New field for achievement rate
    };
  });

  // Only count completed weeks for success rate using the new personal goals logic
  const successfulWeeksCount = completedWeeks.filter((w, i) => {
    const recalcWeek = recalculatedWeeks.find(rw => rw.weekKey === w.weekKey);
    return recalcWeek && recalcWeek.personalAchievementRate >= 1;
  }).length;

  const averageAchievementRate = completedWeeks.length
    ? completedWeeks.reduce((acc, w) => {
      const recalcWeek = recalculatedWeeks.find(rw => rw.weekKey === w.weekKey);
      return acc + (recalcWeek ? recalcWeek.personalAchievementRate : 0);
    }, 0) / completedWeeks.length
    : 0;

  // Get the best week based on the new personal goals
  const bestWeek = completedWeeks.length
    ? completedWeeks.reduce((best, w) => {
      const recalcCurrent = recalculatedWeeks.find(rw => rw.weekKey === w.weekKey);
      const recalcBest = recalculatedWeeks.find(rw => rw.weekKey === best.weekKey);

      if (!recalcCurrent || !recalcBest) return best;

      return (recalcCurrent.personalAchievementRate > recalcBest.personalAchievementRate)
        ? w : best;
    }, completedWeeks[0])
    : null;

  const cumulativeProgress =
    (previousWeek?.cumulativeProgress ?? currentWeek?.cumulativeProgress ?? 0);

  const totalDistance = challengeParams.totalDistance;

  // Filter to only show completed + current weeks
  const visibleWeeks = recalculatedWeeks.filter(week =>
    week.isCompleted || week.isCurrent
  );

  const TrendIcon =
    performanceTrend === "improving" ? TrendingUp : performanceTrend === "declining" ? TrendingDown : Info;

  // Calculate average goal per active user
  const avgGoalPerUser = activeUsersCount > 0
    ? r1(totalWeeklyGoal / activeUsersCount)
    : 0;

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-yellow-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-medium text-slate-800">
              Viikkotavoite
            </h2>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-medium">
            <span className="text-slate-800">{r1(totalWeeklyProgress)}</span>
            <span className="text-slate-600"> / {r1(totalWeeklyGoal)} km</span>
            <span className="text-xs text-slate-500 ml-1">
              ({r1(overallProgressPercentage)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative mb-3">
        <div
          className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner"
          aria-label="Viikkopalkki"
          role="progressbar"
          aria-valuenow={Math.min(overallProgressPercentage, 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className={`h-3 rounded-full transition-all duration-500 relative ${overallProgressPercentage >= 100
                ? "bg-gradient-to-r from-green-400 to-green-500"
                : overallProgressPercentage >= 80
                  ? "bg-gradient-to-r from-yellow-300 to-yellow-500"
                  : "bg-gradient-to-r from-yellow-200 to-yellow-400"
              }`}
            style={{
              width: `${Math.min(overallProgressPercentage, 100)}%`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(overallProgressPercentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {overallProgressPercentage >= 90 && (
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
          style={{ transform: "translateY(-4px) translateX(-8px) scaleX(-1)", opacity: overallProgressPercentage > 5 ? 1 : 0 }}
          initial={{ left: "0%" }}
          animate={{ left: `${Math.min(overallProgressPercentage, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          aria-hidden
        >
          🚴‍♂️
        </motion.div>
      </div>

      {/* Bottom info */}
      <div className="flex justify-between items-center text-sm mb-3">
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

      {/* Personal goals dropdown toggle */}
      <div className="border border-gray-200 rounded-lg mt-3">
        <button
          onClick={() => setShowPersonalGoals(!showPersonalGoals)}
          className="w-full px-4 py-2 flex justify-between items-center hover:bg-gray-50 transition-colors rounded-lg"
        >
          <span className="font-medium text-sm text-slate-800">Henkilökohtaiset tavoitteet</span>
          <span className="flex items-center gap-2 text-slate-500">
            {showPersonalGoals ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {/* Dropdown content */}
        <AnimatePresence>
          {showPersonalGoals && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {sortedPersonalGoals.map((user) => (
                  <div
                    key={user.username}
                    className={`p-3 rounded border ${user.isCompleted
                        ? "bg-green-50 border-green-200"
                        : user.progressPercentage >= 100
                          ? "bg-green-50 border-green-200"
                          : user.progressPercentage >= 50
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-orange-50 border-orange-200"
                      }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium text-sm">{user.username}</div>
                      <div className="text-sm">
                        {user.isCompleted ? (
                          <span className="text-green-600">✓ Tavoite saavutettu</span>
                        ) : (
                          <span>
                            <span className="font-medium">{user.weeklyProgress.toFixed(1)}</span>
                            <span className="text-slate-600">/{user.weeklyGoal.toFixed(1)} km</span>
                            <span className="ml-1 text-xs text-slate-500">
                              ({user.progressPercentage.toFixed(0)}%)
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${user.isCompleted
                            ? "bg-green-500"
                            : user.progressPercentage >= 100
                              ? "bg-green-500"
                              : user.progressPercentage >= 50
                                ? "bg-yellow-500"
                                : "bg-orange-500"
                          }`}
                        style={{ width: `${user.isCompleted ? 100 : user.progressPercentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
                      <span>
                        {user.isCompleted
                          ? "Kokonaistavoite saavutettu, ei viikkotavoitetta"
                          : ``
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Details panel - Rest of the details content */}
          <div className="flex items-center gap-2 mt-5">
            <div className="w-4 h-4 rounded-full bg-purple-500 flex-shrink-0"></div>
            <div>
              <div className="font-medium text-gray-800">Joukkueen viikkotavoite</div>
              <div className="text-xs text-gray-600">
                Lasketaan jokaiselle erikseen jäljellä olevan yhteisen kokonaismatkan mukaan. 
                Tavoite asetetaan viikon alussa ja pysyy samana koko viikon.
              </div>
            </div>
          </div>
    </div>
  );
};

export default WeeklyProgressBar;