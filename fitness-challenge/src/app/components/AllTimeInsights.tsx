import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useTheme } from "@/app/hooks/useTheme";

interface Activity {
  id: number;
  activity: string;
  duration: number;
  date: string;
  kilometers: number;
  bonus?: string | null;
}

interface DailyStats {
  date: string;
  kilometers: number;
  duration: number;
  activities: Activity[];
}

interface AllTimeStats {
  bestKmDay: {
    date: string;
    kilometers: number;
    activities: Activity[];
  };
  longestWorkoutDay: {
    date: string;
    duration: number;
    activities: Activity[];
  };
  currentStreak: {
    start: string;
    days: number;
  };
}

const AllTimeInsights = ({ username }: { username: string }) => {
  const { t } = useTheme();
  const [stats, setStats] = useState<AllTimeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `https://matka-zogy.onrender.com/users/${username}?page=1&limit=1000`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        const activities: Activity[] = data.activities;

        // Group activities by date
        const dailyActivities = _.groupBy(
          activities,
          (activity) => new Date(activity.date).toISOString().split("T")[0]
        );

        // Calculate daily stats for both kilometers and duration
        const dailyStats: DailyStats[] = Object.entries(dailyActivities).map(
          ([date, acts]) => ({
            date,
            kilometers: _.sumBy(acts, "kilometers"),
            duration: _.sumBy(acts, "duration"),
            activities: acts,
          })
        );

        // Find best kilometers day
        const bestKmDay = _.maxBy(dailyStats, "kilometers");

        // Find longest workout duration day
        const longestWorkoutDay = _.maxBy(dailyStats, "duration");

        // Calculate current streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        let streakCount = 0;
        let streakStart = "";
        const currentDate = new Date(yesterday);

        while (true) {
          const dateStr = currentDate.toISOString().split("T")[0];
          if (dailyActivities[dateStr]) {
            streakCount++;
            if (!streakStart) streakStart = dateStr;
          } else {
            break;
          }
          currentDate.setDate(currentDate.getDate() - 1);
        }

        const currentStreak = {
          start: streakStart,
          days: streakCount,
        };

        if (bestKmDay && longestWorkoutDay) {
          setStats({
            bestKmDay,
            longestWorkoutDay,
            currentStreak,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  if (loading)
    return <div className="text-center p-4">{t.allTime.loadingStats}</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">{t.allTime.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">{t.allTime.bestKmDay}</h3>
          <div className="text-2xl font-bold text-slate-600">
            {stats.bestKmDay.kilometers.toFixed(1)} {t.allTime.mostKm}
          </div>
          <div className="text-sm text-gray-600">
            {new Date(stats.bestKmDay.date).toLocaleDateString("fi-FI")}
          </div>
          <div className="mt-2 space-y-1">
            {stats.bestKmDay.activities.map((activity, index) => (
              <div key={activity.id} className="text-sm text-gray-500">
                {activity.activity}: {activity.kilometers.toFixed(1)} {t.allTime.mostKm} (
                {activity.duration} {t.insights.mins})
                {activity.bonus && (
                  <span className="text-slate-500 ml-1">
                    ★ {t.allTime.bonusIncluded}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">{t.allTime.longestWorkout}</h3>
          <div className="text-2xl font-bold text-slate-600">
            {stats.longestWorkoutDay.duration} {t.allTime.longestWorkouts}
          </div>
          <div className="text-sm text-gray-600">
            {new Date(stats.longestWorkoutDay.date).toLocaleDateString("fi-FI")}
          </div>
          <div className="mt-2 space-y-1">
            {stats.longestWorkoutDay.activities.map((activity, index) => (
              <div key={activity.id} className="text-sm text-gray-500">
                {activity.activity}: {activity.duration} {t.insights.mins} (
                {activity.kilometers.toFixed(1)} {t.allTime.mostKm})
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2">{t.allTime.currentStreak}</h3>
          <div className="text-2xl font-bold text-slate-600">
            {stats.currentStreak.days} {t.allTime.currentStreakDays}
          </div>
          {stats.currentStreak.start && (
            <div className="text-sm text-gray-600">
              {t.allTime.since}{" "}
              {new Date(stats.currentStreak.start).toLocaleDateString("fi-FI")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllTimeInsights;