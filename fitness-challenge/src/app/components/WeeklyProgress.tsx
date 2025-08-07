import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { User } from "@/app/types/types";
import { useTheme } from "@/app/hooks/useTheme";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal"; // 🆕 NEW IMPORT
import { challengeParams } from "../constants/challengeParams";

interface WeeklyProgressProps {
  users: User[];
}

interface WeeklyInsight {
  username: string;
  weeklyGoal: number;
  weeklyProgress: number;
  weeklyPercentage: number;
  dailyTarget: number;
  rank: number;
}

const WeeklyProgress = ({ users }: WeeklyProgressProps) => {
  const { t } = useTheme();
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);

  // 🆕 GET WEEKLY DATA FROM HOOK
  const weeklyGoalData = useWeeklyGoal(users);

  useEffect(() => {
    if (!users || users.length === 0) return;

    // 🔧 DESTRUCTURE STABLE PROPERTIES
    const { weeklyGoalPerUser, weekStart, weekEnd, daysRemaining } =
      weeklyGoalData;

    const insights = users
      .map((user) => {
        const weekActivities = user.activities.filter((activity) => {
          const activityDate = new Date(activity.date);
          return activityDate >= weekStart && activityDate <= weekEnd;
        });

        const weeklyProgress = weekActivities.reduce(
          (sum, activity) => sum + activity.kilometers,
          0
        );
        const weeklyPercentage =
          weeklyGoalPerUser > 0
            ? (weeklyProgress / weeklyGoalPerUser) * 100
            : 0;
        const remainingKm = Math.max(0, weeklyGoalPerUser - weeklyProgress);
        const dailyTarget = daysRemaining > 0 ? remainingKm / daysRemaining : 0;

        return {
          username: user.username,
          weeklyGoal: weeklyGoalPerUser,
          weeklyProgress: Number(weeklyProgress.toFixed(1)),
          weeklyPercentage: Math.min(200, weeklyPercentage),
          dailyTarget,
          rank: 0,
        };
      })
      .sort((a, b) => b.weeklyProgress - a.weeklyProgress)
      .map((insight, index) => ({ ...insight, rank: index + 1 }));

    setWeeklyInsights(insights);
  }, [
    users,
    weeklyGoalData.weeklyGoalPerUser,
    weeklyGoalData.currentWeekKey, // 🔧 ONLY DEPEND ON STABLE VALUES
  ]);

  const getUserActivityStatus = (username: string) => {
    const user = users.find((u) => u.username === username);
    if (!user?.activities?.length)
      return { emoji: "💩", days: "", level: "super-inactive" };

    const today = new Date();
    const latestActivityDate = new Date(
      Math.max(...user.activities.map((a) => new Date(a.date).getTime()))
    );
    const daysDifference = Math.floor(
      (today.getTime() - latestActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference >= 7)
      return { emoji: "💩", days: daysDifference, level: "super-inactive" };
    if (daysDifference >= 3)
      return { emoji: "😴", days: daysDifference, level: "inactive" };
    return null;
  };

  // Group by achievement level
  const champions = weeklyInsights.filter(
    (insight) => insight.weeklyPercentage >= 100
  );
  const inProgress = weeklyInsights.filter(
    (insight) => insight.weeklyPercentage > 0 && insight.weeklyPercentage < 100
  );
  const needsMotivation = weeklyInsights.filter(
    (insight) => insight.weeklyPercentage === 0
  );

  return (
    <section className="px-4">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        📊 Viikon tilanne
      </h2>

      {/* Champions */}
      {champions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            🏆 Tavoitteen saavuttaneet
          </h3>
          <div className="space-y-3">
            {champions.map((insight) => {
              const user = users.find((u) => u.username === insight.username);
              const activityStatus = getUserActivityStatus(insight.username);

              return (
                <Link
                  key={insight.username}
                  href={`/user/${insight.username}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white mr-3 ring-2 ring-green-300">
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
                          <h4 className="text-lg font-bold text-green-800">
                            {insight.username}
                          </h4>
                          <div className="text-sm text-green-600">
                            🥇 {insight.weeklyPercentage}% saavutettu!
                            {activityStatus && (
                              <span className="ml-2">
                                {activityStatus.emoji}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-800">
                          {Number(insight.weeklyProgress.toFixed(1))}km
                        </div>
                        {activityStatus && (
                          <div className="text-xs text-orange-600 mt-1">
                            Ei aktiivista {activityStatus.days} päivään
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* In Progress */}
      {/* In Progress */}
      {inProgress.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">
            🚴‍♂️ Matkalla tavoitteeseen
          </h3>
          <div className="space-y-3">
            {inProgress.map((insight) => {
              const user = users.find((u) => u.username === insight.username);
              const activityStatus = getUserActivityStatus(insight.username);
              const globalRank =
                weeklyInsights.findIndex(
                  (w) => w.username === insight.username
                ) + 1;

              return (
                <Link
                  key={insight.username}
                  href={`/user/${insight.username}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`p-4 rounded-xl shadow-sm border ${
                      activityStatus
                        ? "border-orange-200 bg-orange-50"
                        : "border-yellow-200 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 mr-3">
                          {user && (
                            <Image
                              src={
                                user.profilePicture
                                  ? `https://matka-xi.vercel.app/${user.username}.png`
                                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                              }
                              alt={`${insight.username}'s avatar`}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-gray-900">
                            {insight.username}
                          </h4>
                          <div className="text-sm text-gray-500">
                            Sija {globalRank}
                            {globalRank <= 3 && (
                              <span className="ml-1">
                                {globalRank === 1
                                  ? "🥇"
                                  : globalRank === 2
                                  ? "🥈"
                                  : "🥉"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold text-yellow-500">
                            {insight.weeklyProgress} km
                          </div>
                          {activityStatus && (
                            <span className="text-base">
                              {activityStatus.emoji}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Number(insight.weeklyPercentage.toFixed(1))}%
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full relative ${
                            activityStatus
                              ? "bg-gradient-to-r from-orange-400 to-red-500"
                              : "bg-gradient-to-r from-yellow-300 to-yellow-500"
                          }`}
                          style={{ width: `${insight.weeklyPercentage}%` }}
                        >
                          {insight.weeklyPercentage > 5 && (
                            <div
                              className="absolute top-0 -right-2 text-sm"
                              style={{
                                transform: "translateY(-4px) scaleX(-1)",
                              }}
                            >
                              🚴‍♂️
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-2 text-xs">
                      {activityStatus ? (
                        <span className="text-orange-700 font-medium">
                          ⚠️ Ei aktiivinen {activityStatus.days} päivään -
                          tarvitaan kannustusta!
                        </span>
                      ) : (
                        <span className="text-yellow-800">
                          Tarvitaan vielä{" "}
                          {Number(
                            (
                              insight.weeklyGoal - insight.weeklyProgress
                            ).toFixed(1)
                          )}{" "}
                          km
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Needs Motivation */}
      {needsMotivation.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-3">
            🆘 Tarvitsee motivaatiota
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {needsMotivation.map((insight) => {
              const user = users.find((u) => u.username === insight.username);
              const activityStatus = getUserActivityStatus(insight.username);

              return (
                <Link
                  key={insight.username}
                  href={`/user/${insight.username}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-red-50 p-3 rounded-lg border-2 border-red-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                          {user && (
                            <Image
                              src={
                                user.profilePicture
                                  ? `https://matka-xi.vercel.app/${user.username}.png`
                                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`
                              }
                              alt={`${insight.username}'s avatar`}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                              unoptimized
                            />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-red-800">
                            {insight.username}
                          </h4>
                          <div className="text-xs text-red-600">
                            0 km tällä viikolla
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {activityStatus && (
                          <div className="bg-red-100 px-2 py-1 rounded-full flex flex-col items-center">
                            <div className="text-base">
                              {activityStatus.emoji}
                            </div>
                            <div className="text-xs text-red-700">
                              {activityStatus.days}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default WeeklyProgress;
