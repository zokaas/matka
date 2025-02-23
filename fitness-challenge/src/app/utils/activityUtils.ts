import { User } from "@/app/types/types";
import { differenceInDays } from "date-fns";

// 🔥 Get Week's Most Popular Sport
export const getWeekTopSports = (users: User[]) => {
  const today = new Date();
  
  // Calculate the most recent Monday
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const monday = new Date(today);
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If today is Sunday (0), go back 6 days; otherwise, dayOfWeek - 1
  monday.setDate(today.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0); // Set to start of the day

  // Calculate the upcoming Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999); // Set to end of the day

  // Filter activities within the current week (Monday to Sunday)
  const weekActivities = users.flatMap((user) =>
    user.activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate >= monday && activityDate <= sunday;
    })
  );

  // Count occurrences of each sport
  const sportCounts = weekActivities.reduce((acc, activity) => {
    acc[activity.activity] = (acc[activity.activity] || 0) + 1;
    return acc;
  }, {});

  if (Object.keys(sportCounts).length === 0) return null;

  // Determine the sport(s) with the highest count
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
