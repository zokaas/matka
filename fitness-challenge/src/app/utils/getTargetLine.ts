import { format, differenceInDays, isWithinInterval } from "date-fns";
import { User } from "@/app/types/types";

export const getTargetLine = (
  users: User[],
  filterDataByTimeframe: <T extends { date: string }>(data: T[]) => T[]
) => {
  // Challenge start and end dates
  const startDate = new Date("2025-01-06");
  const endDate = new Date("2025-06-22");
  const today = new Date();

  // Total challenge parameters
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const totalTargetDistance = 100000; // Total challenge distance

  // Calculate progress details
  const daysSinceStart = Math.max(0, differenceInDays(today, startDate));
  const proportionalExpectedProgress = 
    (daysSinceStart / totalDays) * totalTargetDistance;

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
  const targetLineData = filterDataByTimeframe(
    allDates.map((date) => {
      const currentDateObj = new Date(date);
      
      // Calculate days since start for this specific date
      const daysForThisDate = Math.max(0, differenceInDays(currentDateObj, startDate));
      
      // Calculate daily proportional target
      const dailyProportionalTarget = 
        (daysForThisDate / totalDays) * totalTargetDistance;

      // Add day's activities to cumulative distance
      if (activityData[date]) {
        cumulativeDistance += activityData[date];
      }

      // Only show actual distance for dates up to today
      const displayDistance = isWithinInterval(currentDateObj, { start: startDate, end: today }) 
        ? cumulativeDistance 
        : null;

      return {
        date,
        distance: displayDistance,
        target: dailyProportionalTarget,
        // Additional metadata for progress assessment
        expectedProgress: dailyProportionalTarget,
        actualProgress: displayDistance ?? 0,
        progressStatus: calculateProgressStatus(
          displayDistance ?? 0, 
          dailyProportionalTarget
        )
      };
    })
  );

  // Calculate overall progress status
  const overallProgressStatus = calculateProgressStatus(
    cumulativeDistance, 
    proportionalExpectedProgress
  );

  return {
    targetLineData,
    overallProgressStatus,
    currentProgress: {
      total: cumulativeDistance,
      expected: proportionalExpectedProgress
    }
  };
};

/**
 * Calculate progress status based on actual vs expected progress
 * @param actualProgress Actual kilometers completed
 * @param expectedProgress Expected kilometers at this point
 * @returns 'behind' | 'on track' | 'ahead'
 */
export const calculateProgressStatus = (
  actualProgress: number, 
  expectedProgress: number
): 'behind' | 'on track' | 'ahead' => {
  // Define threshold for considering progress status
  const BEHIND_THRESHOLD = 0.95; // Less than 95% of expected progress
  const AHEAD_THRESHOLD = 1.05; // More than 105% of expected progress

  const progressRatio = actualProgress / expectedProgress;

  if (progressRatio < BEHIND_THRESHOLD) return 'behind';
  if (progressRatio > AHEAD_THRESHOLD) return 'ahead';
  return 'on track';
};