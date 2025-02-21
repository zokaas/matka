import { User } from "@/app/types/types";
import { differenceInDays } from "date-fns";

// 🔥 Get Week's Most Popular Sport
export const getWeekTopSports = (users: User[]) => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  monday.setHours(0, 0, 0, 0);

  const weekActivities = users.flatMap((user) =>
    user.activities.filter((a) => {
      const activityDate = new Date(a.date);
      return activityDate >= monday && activityDate <= today;
    })
  );

  const sportCounts = weekActivities.reduce((acc, activity) => {
    acc[activity.activity] = (acc[activity.activity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(sportCounts).length === 0) return null;

  const maxCount = Math.max(...Object.values(sportCounts));
  const topSports = Object.entries(sportCounts)
    .filter(([, count]) => count === maxCount)
    .map(([sport, count]) => ({ name: sport, count }));

  return { count: maxCount, sports: topSports };
};

// 🔥 Get Longest Activities
export const getLongestActivities = (users: User[]) => {
  const recentActivities = users.flatMap((user) =>
    user.activities
      .filter((a) => differenceInDays(new Date(), new Date(a.date)) <= 7)
      .map((a) => ({ ...a, username: user.username }))
  );

  const maxKilometers = Math.max(
    ...recentActivities.map((a) => a.kilometers),
    0
  );

  return recentActivities.filter((a) => a.kilometers === maxKilometers);
};

// 🔥 Get Weekly Top Performers
export const getWeeklyTopPerformers = (users: User[]) => {
  const weeklyStats = users.map((user) => {
    const weeklyKm = user.activities
      .filter((a) => differenceInDays(new Date(), new Date(a.date)) <= 7)
      .reduce((sum, a) => sum + a.kilometers, 0);

    return { username: user.username, kilometers: weeklyKm };
  });

  if (weeklyStats.length === 0) return null;

  const maxKm = Math.max(...weeklyStats.map((stat) => stat.kilometers));
  const topPerformers = weeklyStats
    .filter((stat) => stat.kilometers === maxKm)
    .sort((a, b) => a.username.localeCompare(b.username));

  return { kilometers: maxKm, users: topPerformers };
};
