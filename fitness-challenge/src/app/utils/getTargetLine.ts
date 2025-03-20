import { format } from "date-fns";
import { User } from "@/app/types/types";

export const getTargetLine = (
  users: User[],
  filterDataByTimeframe: <T extends { date: string }>(data: T[]) => T[]
) => {
  const startDate = new Date("2025-01-06");
  const endDate = new Date("2025-06-22");
  const today = new Date();

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalTargetDistance = 100000; // Total challenge distance

  const activityData: Record<string, number> = {};
  let cumulativeDistance = 0;

  // Aggregate activities by date
  users.forEach((user) => {
    user.activities.forEach((activity) => {
      const date = format(new Date(activity.date), "yyyy-MM-dd");
      activityData[date] = (activityData[date] || 0) + activity.kilometers;
    });
  });

  // Generate all dates from start to end
  const allDates: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    allDates.push(format(currentDate, "yyyy-MM-dd"));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Build progress data
  return filterDataByTimeframe(
    allDates.map((date) => {
      const currentDate = new Date(date);
      const daysSinceStart = Math.ceil(
        (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calculate target based on proportional progress
      const proportionalTarget = 
        (daysSinceStart / totalDays) * totalTargetDistance;

      // Add day's activities to cumulative distance
      if (activityData[date]) {
        cumulativeDistance += activityData[date];
      }

      return {
        date,
        // Only show actual distance for dates up to today
        distance: currentDate <= today ? cumulativeDistance : null,
        target: proportionalTarget
      };
    })
  );
};