import { format } from "date-fns";
import { User } from "../types/types";

// 🔥 Format a Date
export const formatDate = (date: Date, formatString = "d.M.yyyy") => {
  return format(date, formatString);
};

// 🔥 Get Last Four Weeks Summary
export const getLastFourWeeks = (users: User[]) => {
  const today = new Date();
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - today.getDay() + 1);
  currentMonday.setHours(0, 0, 0, 0);

  const weekStarts = [0, -1, -2, -3].map((weekOffset) => {
    const monday = new Date(currentMonday);
    monday.setDate(monday.getDate() + weekOffset * 7);
    return monday;
  });

  const recentActivities = users.flatMap((user) =>
    user.activities
      .map((activity) => {
        const activityDate = new Date(activity.date);
        const weekIndex = weekStarts.findIndex(
          (monday) =>
            activityDate >= monday &&
            activityDate < new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000)
        );
        return { ...activity, week: weekIndex };
      })
      .filter((activity) => activity.week !== -1)
  );

  const weeks = weekStarts.map((startDate, weekIndex) => {
    const weekActivities = recentActivities.filter((a) => a.week === weekIndex);
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const sportStats = weekActivities.reduce((acc, activity) => {
      if (!acc[activity.activity]) acc[activity.activity] = { km: 0, count: 0 };
      acc[activity.activity].km += activity.kilometers;
      acc[activity.activity].count += 1;
      return acc;
    }, {} as Record<string, { km: number; count: number }>);

    return {
      week: weekIndex,
      startDate,
      endDate,
      kilometers: Math.round(
        weekActivities.reduce((sum, a) => sum + a.kilometers, 0)
      ),
      activeDays: new Set(weekActivities.map((a) => a.date)).size,
      sports: Object.entries(sportStats)
        .map(([sport, stats]) => ({
          name: sport,
          kilometers: Math.round(stats.km),
          count: stats.count,
        }))
        .sort((a, b) => b.kilometers - a.kilometers),
    };
  });

  const allSports = new Set(weeks.flatMap((w) => w.sports.map((s) => s.name)));

  return {
    weeks,
    allSports: Array.from(allSports),
    comparisons: weeks.slice(1).map((week, i) => ({
      weekChange:
        weeks[i].kilometers === 0
          ? 0
          : Math.round(
              ((week.kilometers - weeks[i].kilometers) / weeks[i].kilometers) *
                100
            ),
      activeDaysChange: week.activeDays - weeks[i].activeDays,
    })),
  };
};
