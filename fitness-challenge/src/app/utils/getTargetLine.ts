import { format } from "date-fns";
import { User } from "@/app/types/types";

export const getTargetLine = (
  users: User[],
  filterDataByTimeframe: <T extends { date: string }>(data: T[]) => T[]
) => {
  const startDate = new Date("2025-01-06");
  const endDate = new Date("2025-05-31");
  const today = new Date();

  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dailyTarget = 100000 / totalDays; // Paljonko pitäisi kertyä per päivä

  const activityData: Record<string, number> = {};
  let cumulativeDistance = 0;

  // Kerätään toteutuneet kilometrit
  users.forEach((user) => {
    user.activities.forEach((activity) => {
      const date = format(new Date(activity.date), "yyyy-MM-dd");
      activityData[date] = (activityData[date] || 0) + activity.kilometers;
    });
  });

  // Kerätään päivät tähän asti
  const progressDates: string[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= today && currentDate <= endDate) {
    progressDates.push(format(currentDate, "yyyy-MM-dd"));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Kerätään kaikki päivät loppuun asti
  const allDates: string[] = [...progressDates];
  while (currentDate <= endDate) {
    allDates.push(format(currentDate, "yyyy-MM-dd"));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Rakennetaan data
  return filterDataByTimeframe(
    allDates.map((date) => {
      const daysSinceStart = Math.ceil(
        (new Date(date).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (activityData[date] && progressDates.includes(date)) {
        cumulativeDistance += activityData[date];
      }

      return {
        date,
        distance: progressDates.includes(date) ? cumulativeDistance : null,
        target: Math.min(100000, dailyTarget * daysSinceStart),
      };
    })
  );
};
