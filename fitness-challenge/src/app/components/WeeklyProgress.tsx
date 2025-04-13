// fitness-challenge/src/app/components/WeeklyProgress.tsx
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { User } from "@/app/types/types";
import { useState, useEffect } from "react";

// Constants for the challenge
const CHALLENGE_START_DATE = new Date("2025-01-06");
const CHALLENGE_END_DATE = new Date("2025-06-22");
const TOTAL_CHALLENGE_DISTANCE = 100000; // 100,000 km

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
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);
  const [weeklyGoalPerUser, setWeeklyGoalPerUser] = useState(0);
  
  useEffect(() => {
    if (!users || users.length === 0) return;

    // Calculate the current week's key
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0); // Start of Monday

    // Determine the end of the week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999); // End of Sunday

    // Create a key for this week (e.g., "2025-W12")
    const weekYear = weekStart.getFullYear();
    const weekNum = Math.ceil((weekStart.getTime() - new Date(weekYear, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const currentWeekKey = `${weekYear}-W${weekNum}`;

    // Calculate days remaining until Sunday
    const daysRemaining = 7 - (dayOfWeek === 0 ? 7 : dayOfWeek);

    // Get the stored weekly goal if it exists
    const storedWeeklyGoal = localStorage.getItem(`weekly-goal-${currentWeekKey}`);
    let weeklyGoal;
    
    if (storedWeeklyGoal) {
      // Use the stored goal
      weeklyGoal = parseInt(storedWeeklyGoal, 10);
    } else {
      // Calculate a new weekly goal based on remaining challenge distance and time
      
      // Get total progress so far
      const totalProgress = users.reduce((sum, user) => sum + user.totalKm, 0);
      
      // Calculate remaining distance to the challenge goal
      const remainingChallengeDistance = Math.max(0, TOTAL_CHALLENGE_DISTANCE - totalProgress);
      
      // Calculate days left until challenge end
      const daysUntilEnd = Math.max(1, Math.ceil((CHALLENGE_END_DATE.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
      
      // Calculate weeks remaining (round up to ensure we have a safety margin)
      const weeksRemaining = Math.ceil(daysUntilEnd / 7);
      
      // Calculate required weekly distance for the team
      weeklyGoal = Math.ceil(remainingChallengeDistance / weeksRemaining);
      
      // Store this week's goal
      localStorage.setItem(`weekly-goal-${currentWeekKey}`, weeklyGoal.toString());
    }
    
    // Calculate individual goal per user
    const individualGoal = Math.round(weeklyGoal / users.length);
    setWeeklyGoalPerUser(individualGoal);
    
    const insights = users.map((user) => {
      // Filter activities for current week
      const weekActivities = user.activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });

      // Calculate weekly progress
      const weeklyProgress = weekActivities.reduce(
        (sum, activity) => sum + activity.kilometers,
        0
      );

      // Calculate percentage of weekly goal
      const weeklyPercentage = Math.min(
        200, // Cap at 200% for display purposes
        individualGoal > 0 ? Math.round((weeklyProgress / individualGoal) * 100) : 0
      );

      // Calculate daily target (remaining km / remaining days)
      const remainingKm = Math.max(0, individualGoal - weeklyProgress);
      const dailyTarget = daysRemaining > 0 ? Math.round(remainingKm / daysRemaining) : 0;

      return {
        username: user.username,
        weeklyGoal: individualGoal,
        weeklyProgress: Math.round(weeklyProgress),
        weeklyPercentage,
        dailyTarget,
        rank: 0
      };
    });

    // Sort by progress and assign ranks
    const sortedInsights = insights
      .sort((a, b) => b.weeklyProgress - a.weeklyProgress)
      .map((insight, index) => ({
        ...insight,
        rank: index + 1,
      }));

    setWeeklyInsights(sortedInsights);
  }, [users]);

  // Function to check user activity status
  const getUserActivityStatus = (username: string) => {
    const user = users.find((u) => u.username === username);
    if (!user?.activities?.length) {
      return {
        emoji: "💩",
        days: 7,
      };
    }

    const today = new Date();
    const latestActivityDate = new Date(
      Math.max(...user.activities.map((a) => new Date(a.date).getTime()))
    );

    const daysDifference = Math.floor(
      (today.getTime() - latestActivityDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference >= 7) {
      return {
        emoji: "💩",
        days: daysDifference,
      };
    }

    if (daysDifference >= 3) {
      return {
        emoji: "😴",
        days: daysDifference,
      };
    }

    return null;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "#22c55e"; // Green for completed goal
    if (percentage >= 50) return "#f97316";  // Orange for halfway
    return "#ef4444";                        // Red for less than halfway
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-2">
        <span>📊 </span> Tämän viikon ranking
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {weeklyInsights.map((insight, index) => {
          const user = users.find((u) => u.username === insight.username);
          const activityStatus = getUserActivityStatus(insight.username);

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
                className="bg-white p-4 rounded-xl shadow-md relative"
              >
                {/* Activity status badge */}
                {activityStatus && (
                  <div className="absolute top-3 right-3 flex flex-col items-center">
                    <div className="text-2xl mb-[-6px]">
                      {activityStatus.emoji}
                    </div>
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      {activityStatus.days} pv
                    </div>
                  </div>
                )}

                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 mr-3 flex-shrink-0">
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
                    <h4 className="text-sm font-semibold text-gray-800">
                      {insight.username}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="font-medium">Sijoitus {index + 1}</span>
                      {index + 1 <= 3 && (() => {
                        let medal;
                        if (index + 1 === 1) {
                          medal = "🥇";
                        } else if (index + 1 === 2) {
                          medal = "🥈";
                        } else {
                          medal = "🥉";
                        }
                        return (
                          <span className="ml-2 text-yellow-500">
                            {medal}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="w-16 h-16">
                    <CircularProgressbar
                      value={insight.weeklyPercentage}
                      text={`${insight.weeklyPercentage}%`}
                      styles={buildStyles({
                        pathColor: getProgressColor(insight.weeklyPercentage),
                        textColor: "#374151",
                        trailColor: "#e5e7eb",
                        textSize: "18px",
                        pathTransition: "stroke-dashoffset 0.5s ease 0s",
                      })}
                    />
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-purple-600">
                      {insight.weeklyProgress.toLocaleString("fi-FI")}{" "}
                      km
                    </div>
                    <div className="text-xs text-gray-500">
                      km tällä viikolla
                    </div>

                    {insight.dailyTarget > 0 && insight.weeklyPercentage < 100 && (
                      <div className="mt-1 text-xs bg-purple-50 text-purple-700 rounded-full px-2 py-0.5">
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
  );
};

export default WeeklyProgress;