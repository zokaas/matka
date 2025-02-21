import { useState, useEffect } from "react";
import { User, WeeklyInsight, TargetPaces } from "@/app/types/types";

export const useWeeklyInsights = (users: User[], targetPaces: TargetPaces) => {
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);

  useEffect(() => {
    if (users.length === 0 || !targetPaces) return;

    const today = new Date();
    const weeklyGoal = targetPaces.weeklyPerUser;
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

      const dailyTarget =
        weeklyGoal > 0
          ? Math.round((weeklyGoal - weeklyProgress) / daysRemaining)
          : 0;

      return {
        username: user.username,
        weeklyGoal,
        weeklyProgress: Math.round(weeklyProgress),
        weeklyPercentage,
        dailyTarget,
        dailyProgress: 0,
        dailyPercentage: 0,
        rank: 0,
      };
    });

    setWeeklyInsights(
      insights.sort((a, b) => b.weeklyProgress - a.weeklyProgress)
    );
  }, [users, targetPaces]);

  return weeklyInsights;
};
