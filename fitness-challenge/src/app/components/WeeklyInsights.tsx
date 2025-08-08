
import { useState, useEffect } from "react";
import { User, WeeklyInsight, TargetPaces } from "@/app/types/types";
import { useWeeklyGoal } from "@/app/hooks/useWeeklyGoal"; // 🆕 NEW IMPORT

export const useWeeklyInsights = (users: User[], targetPaces: TargetPaces) => {
  const [weeklyInsights, setWeeklyInsights] = useState<WeeklyInsight[]>([]);
  
  // 🆕 USE WEEKLY GOAL HOOK FOR CONSISTENCY
  const weeklyGoalData = useWeeklyGoal(users);

  useEffect(() => {
    if (users.length === 0 || !targetPaces) return;

    // 🆕 USE HOOK DATA INSTEAD OF RECALCULATING
    const { weeklyGoalPerUser, weekStart, weekEnd, daysRemaining } = weeklyGoalData;

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

      const weeklyPercentage = weeklyGoalPerUser > 0 ? Math.round((weeklyProgress / weeklyGoalPerUser) * 100) : 0;

      const remainingWeeklyDistance = Math.max(0, weeklyGoalPerUser - weeklyProgress);
      const dailyTarget = remainingWeeklyDistance > 0
        ? daysRemaining > 0
          ? Math.round(remainingWeeklyDistance / daysRemaining)
          : Math.round(remainingWeeklyDistance)
        : 0;

      const dailyProgress = daysRemaining > 0 ? weeklyProgress / (7 - daysRemaining) : 0;
      const dailyPercentage = weeklyGoalPerUser > 0
        ? Math.round((dailyProgress / (weeklyGoalPerUser / 7)) * 100)
        : 0;

      return {
        username: user.username,
        weeklyGoal: weeklyGoalPerUser,
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
  }, [users, targetPaces, weeklyGoalData]);

  return weeklyInsights;
};