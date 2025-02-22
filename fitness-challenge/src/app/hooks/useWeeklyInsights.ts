import { useState, useEffect } from "react";
import { User, WeeklyInsight, TargetPaces } from "@/app/types/types";

export const useWeeklyInsights = (users: User[], targetPaces: TargetPaces) => {
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);

  useEffect(() => {
    if (users.length === 0 || !targetPaces) return;

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Determine the Monday of the current week
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + mondayOffset);
    weekStart.setHours(0, 0, 0, 0); // Start of Monday

    // Determine the Sunday of the current week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999); // End of Sunday

    // Calculate days remaining until Sunday
    const daysRemaining = 7 - (dayOfWeek === 0 ? 7 : dayOfWeek);

    const weeklyGoal = targetPaces.weeklyPerUser;

    const insights: WeeklyInsight[] = users.map((user) => {
      // Filter activities that occurred between this Monday and Sunday
      const weekActivities = user.activities.filter((activity) => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });

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

      // Calculate daily progress (optional, can adjust if needed)
      const dailyProgress =
        daysRemaining > 0 ? weeklyProgress / (7 - daysRemaining) : 0;
      const dailyPercentage =
        weeklyGoal > 0
          ? Math.round((dailyProgress / (weeklyGoal / 7)) * 100)
          : 0;

      return {
        username: user.username,
        weeklyGoal,
        weeklyProgress: Math.round(weeklyProgress),
        weeklyPercentage,
        dailyTarget,
        dailyProgress: Math.round(dailyProgress),
        dailyPercentage,
        rank: 0,
      };
    });

    // Rank users based on weekly progress
    const sortedInsights = insights
      .sort((a, b) => b.weeklyProgress - a.weeklyProgress)
      .map((insight, index) => ({
        ...insight,
        rank: index + 1,
      }));

    setWeeklyInsights(sortedInsights);
  }, [users, targetPaces]);

  return weeklyInsights;
};
