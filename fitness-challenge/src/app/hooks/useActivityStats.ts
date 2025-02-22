import _ from "lodash";
import { useState, useEffect } from "react";
import { UserStats, Activity, DailyStats } from "../types/types";

export const useActivityStats = (username?: string, isGlobal = false) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        let apiUrl = "https://matka-zogy.onrender.com/users";

        if (!isGlobal && username) {
          apiUrl = `https://matka-zogy.onrender.com/users/${username}?page=1&limit=1000`;
        }

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const users = isGlobal ? data : [data];
        const allStats: UserStats[] = [];

        for (const user of users) {
          const activities: Activity[] = user.activities;

          // Group activities by date
          const dailyActivities = _.groupBy(
            activities,
            (activity) => new Date(activity.date).toISOString().split("T")[0]
          );

          // Calculate daily stats
          const dailyStats: DailyStats[] = Object.entries(dailyActivities).map(
            ([date, acts]) => ({
              date,
              kilometers: _.sumBy(acts, "kilometers"),
              duration: _.sumBy(acts, "duration"),
              activities: acts,
            })
          );

          // Find the best days
          const bestKmDay = _.maxBy(dailyStats, "kilometers");
          const longestWorkoutDay = _.maxBy(dailyStats, "duration");

          // Calculate streak
          const dates = Object.keys(dailyActivities).sort();
          let streakCount = 0;
          let streakStart = "";
          let tempStreakStart = "";

          for (let i = 0; i < dates.length; i++) {
            const currentDate = new Date(dates[i]);
            const nextDate =
              i < dates.length - 1 ? new Date(dates[i + 1]) : null;

            if (streakCount === 0) {
              tempStreakStart = dates[i];
            }

            streakCount++;

            if (nextDate) {
              const diffDays = Math.floor(
                (nextDate.getTime() - currentDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              if (diffDays > 1) {
                if (streakCount > 0) {
                  streakStart = tempStreakStart;
                }
                streakCount = 0;
              }
            }
          }

          allStats.push({
            bestKmDay,
            longestWorkoutDay,
            currentStreak: { start: streakStart, days: streakCount },
          });
        }

        // Aggregate global stats if needed
        if (isGlobal) {
          const maxKm = Math.max(
            ...allStats.map((s) => s.bestKmDay?.kilometers || 0)
          );
          const maxWorkout = Math.max(
            ...allStats.map((s) => s.longestWorkoutDay?.duration || 0)
          );
          const maxStreak = Math.max(
            ...allStats.map((s) => s.currentStreak.days)
          );

          setStats({
            bestKmDay: allStats.find((s) => s.bestKmDay?.kilometers === maxKm)
              ?.bestKmDay,
            longestWorkoutDay: allStats.find(
              (s) => s.longestWorkoutDay?.duration === maxWorkout
            )?.longestWorkoutDay,
            currentStreak: {
              start:
                allStats.find((s) => s.currentStreak.days === maxStreak)
                  ?.currentStreak.start || "",
              days: maxStreak,
            },
          });
        } else {
          setStats(allStats[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username, isGlobal]);

  return { stats, loading, error };
};
