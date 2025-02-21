"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Map from "./Map";

interface Activity {
  date: string;
  duration: number;
  kilometers: number;
  activity: string;
}

interface User {
  username: string;
  totalKm: number;
  profilePicture: string;
  activities: Activity[];
}

interface WeeklyInsight {
  username: string;
  weeklyGoal: number;
  weeklyProgress: number;
  weeklyPercentage: number;
  dailyTarget: number;
  rank: number;
}

interface TargetPaces {
  totalProgress: number;
  remainingDistance: number;
  daysRemaining: number;
  dailyPerUser: number;
  weeklyPerUser: number;
  projectedEndDate: Date | null;
}

const TOTAL_GOAL = 100000; // Total goal in kilometers
const MOTIVATIONAL_MESSAGES = [
  "🌟 Emme tiedä mitään ennen kuin on liian myöhäistä",
  "🔥 Saksa on paska maa",
  "🌍 Ystävyyden voimalla ympäri maailman",
  "🚀 ",
  "💪 Maailma ei lopu Joroisiin",
  "🌟 Huominen on aina tulevaisuutta.",
  "🔥 Sovitaanko, että sinä olet vahtimestari ja minä Maailmanmestari!",
  "🌍 Jokainen tsäänssi on mahdollisuus",
  "🚀 En tiedä miksi hypin, mutta hypin kyllä",
  "💪 Jos pallo on pyöreä, niin elämäkin on pyöreä",
];
const backendUrl = "https://matka-zogy.onrender.com";

export default function QuickAccess() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalKm, setTotalKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);
  const [showWeeklyProgress, setShowWeeklyProgress] = useState(false);
  const [targetPaces, setTargetPaces] = useState<TargetPaces | null>(null);

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

        // Calculate weekly insights based on target paces
        const calculatedTargetPaces = calculateTargetPaces(usersData);
        setTargetPaces(calculatedTargetPaces);
        calculateWeeklyInsights(usersData, calculatedTargetPaces.weeklyPerUser);

        // Select a random motivational message
        setMotivationalMessage(
          MOTIVATIONAL_MESSAGES[
            Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
          ]
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate target paces from Insights component
const calculateTargetPaces = (userData: User[]): TargetPaces => {
  const today = new Date();
  const startDate = new Date("2025-01-06"); // Project start date
  const endDate = new Date("2025-05-31"); // Project end date

  // Days remaining until the end
  const daysRemaining = Math.ceil(
    (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Total distance covered so far
  const currentTotal = userData.reduce((sum, user) => sum + user.totalKm, 0);
  const remainingDistance = 100000 - currentTotal;

  // Debugging logs:
  console.log("🚀 Current Total:", currentTotal);
  console.log("📅 Days Remaining:", daysRemaining);
  console.log("📉 Remaining Distance:", remainingDistance);

  // Team size
  const activeMemberCount = Math.max(1, userData.length);
  console.log("👥 Active Members:", activeMemberCount);

  // Required per person
  const requiredPerUser = remainingDistance / activeMemberCount;
  const weeksRemaining = Math.ceil(daysRemaining / 7);

  // Debugging logs:
  console.log("📆 Weeks Remaining:", weeksRemaining);
  console.log("💪 Required Per User:", requiredPerUser);

  // Calculate projected end date at current pace
  const daysFromStart = Math.ceil(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const currentDailyRate = currentTotal / Math.max(1, daysFromStart); // km/day so far

  console.log("📊 Current Daily Rate:", currentDailyRate);

  const daysNeededAtCurrentPace = remainingDistance / currentDailyRate;
  const projectedEndDate = new Date(
    today.getTime() + daysNeededAtCurrentPace * 24 * 60 * 60 * 1000
  );

  const weeklyPerUser =
    weeksRemaining > 0 ? Math.max(1, requiredPerUser / weeksRemaining) : 1;

  return {
    totalProgress: currentTotal,
    remainingDistance,
    daysRemaining,
    dailyPerUser: requiredPerUser / daysRemaining,
    weeklyPerUser: weeklyPerUser,
    projectedEndDate: currentTotal === 0 ? null : projectedEndDate,
  };
};


  // Calculate weekly insights from Insights component
  const calculateWeeklyInsights = (
    users: User[],
    weeklyGoalPerUser: number
  ) => {
    const today = new Date();

    const weeklyGoal = weeklyGoalPerUser;
    const daysRemaining = Math.max(1, 7 - (today.getDay() || 7));

    const insights: WeeklyInsight[] = users.map((user) => {
      const weekActivities = user.activities.filter(
        (activity) =>
          (today.getTime() - new Date(activity.date).getTime()) /
            (1000 * 60 * 60 * 24) <=
          7
      );

      const weeklyProgress = weekActivities.reduce(
        (sum, activity) => sum + activity.kilometers,
        0
      );

      const weeklyPercentage =
        weeklyGoal > 0 ? Math.round((weeklyProgress / weeklyGoal) * 100) : 0;

      const remainingWeeklyDistance = Math.max(0, weeklyGoal - weeklyProgress);
      const dailyTarget =
        remainingWeeklyDistance > 0
          ? Math.round(remainingWeeklyDistance / daysRemaining)
          : 0;

      return {
        username: user.username,
        weeklyGoal,
        weeklyProgress: Math.round(weeklyProgress),
        weeklyPercentage,
        dailyTarget,
        rank: 0,
      };
    });

    // Assign ranks
    const sortedInsights = insights
      .sort((a, b) => b.weeklyProgress - a.weeklyProgress)
      .map((insight, index) => ({
        ...insight,
        rank: index + 1,
      }));

    setWeeklyInsights(sortedInsights);
  };

  const progress = (totalKm / TOTAL_GOAL) * 100; // Calculate progress percentage

  const getMedal = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Progress Bar */}
      <section className="bg-white p-4 rounded-lg shadow text-center">
        {/* Header Section */}
        <motion.header
          className="p-4 rounded-lg text-center shadow"
          animate={{ opacity: [0, 1], y: [-20, 0] }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-2xl font-bold text-purple-600">PETOLLISET🔥</h1>
          <motion.div
            className="mt-4 text-lg font-bold text-purple-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {motivationalMessage}
          </motion.div>

          <div className="relative mt-4">
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <motion.div
                className="h-6 bg-gradient-to-r from-purple-500 to-purple-500 rounded-full"
                style={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
            <p className="mt-2 text-gray-600">
              {totalKm.toFixed(2)} / {TOTAL_GOAL.toLocaleString()} km (
              {progress.toFixed(2)}%)
            </p>
          </div>
        </motion.header>
      </section>
      <div>
        {totalKm >= 21000 ? (
          <Map totalKm={totalKm} />
        ) : (
          <div className="text-center font-bold text-purple-500">
              🔒 KARTTA PALJASTUU KUN KASASSA ON 21 000km! 🔒
          </div>
        )}
      </div>
      {/* Toggle Buttons */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-md shadow" role="group">
          <button
            type="button"
            className={`px-5 py-2 text-sm font-medium border border-purple-300 ${
              !showWeeklyProgress
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } rounded-l-lg focus:z-10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`}
            onClick={() => setShowWeeklyProgress(false)}
          >
            Leaderboard
          </button>
          <button
            type="button"
            className={`px-5 py-2 text-sm font-medium border border-purple-300 ${
              showWeeklyProgress
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } rounded-r-lg focus:z-10 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors`}
            onClick={() => setShowWeeklyProgress(true)}
          >
            Weekly Progress
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

      {/* Leaderboard */}
      {!loading && !error && !showWeeklyProgress && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
            <span>🏆</span> Leaderboard
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
                          <div className="absolute -bottom-3 -right-3 text-3xl bg-white rounded-full p-1 shadow-md">
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
      {!loading && !error && showWeeklyProgress && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 flex items-center mb-2">
            <span>📊</span> This Week&apos;s Progress
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
                          km this week
                        </div>

                        {insight.dailyTarget > 0 && (
                          <div className="mt-2 text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-1">
                            {insight.dailyTarget} km/day needed
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
    </div>
  );
}
