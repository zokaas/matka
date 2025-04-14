import { format, isValid, Locale, parseISO } from "date-fns";
import { User } from "../types/types";
import { fi } from "date-fns/locale";

/**
 * Format a date to the specified format with robust error handling
 */
export function formatDate(
  date: string | Date,
  formatString: string = "d.M.yyyy",
  options: { locale?: Locale } = { locale: fi }
): string {
  try {
    // Handle both string and Date inputs
    const parsedDate = date instanceof Date ? date : parseISO(date);
    
    // Check if the parsed date is valid
    if (!isValid(parsedDate)) {
      console.warn(`Invalid date received: ${date}`);
      return "Invalid date";
    }
    
    return format(parsedDate, formatString, options);
  } catch (error) {
    console.error(`Error formatting date: ${date}`, error);
    return "Invalid date";
  }
}

/**
 * Format a number with locale-specific separators
 */
export function formatNumber(
  num: number, 
  options: { 
    maximumFractionDigits?: number,
    minimumFractionDigits?: number
  } = {}
): string {
  try {
    return num.toLocaleString("fi-FI", options);
  } catch (error) {
    console.error(`Error formatting number: ${num}`, error);
    return num.toString();
  }
}

/**
 * Parse a date string safely
 */
export function parseDate(dateString: string): Date | null {
  try {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? parsedDate : null;
  } catch (error) {
    console.error(`Error parsing date: ${dateString}`, error);
    return null;
  }
}

// 🔥 Get Last Four Weeks Summary
export const getLastFourWeeks = (users: User[]) => {
  const today = new Date();

  // Get the most recent Monday (start of the current week)
  const currentMonday = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  currentMonday.setDate(today.getDate() + mondayOffset);
  currentMonday.setHours(0, 0, 0, 0);

  // Generate the last four Mondays (each Monday marks a new week)
  const weekStarts = [0, -1, -2, -3].map((weekOffset) => {
    const monday = new Date(currentMonday);
    monday.setDate(monday.getDate() + weekOffset * 7);
    return monday;
  });

  // Flatten all activities and determine the week index
  const recentActivities = users.flatMap(
    (user) =>
      user.activities
        .map((activity) => {
          if (!activity) return null; // ✅ Check if activity is null before proceeding

          const activityDate = new Date(activity.date);

          // Determine which week this activity belongs to
          const weekIndex = weekStarts.findIndex(
            (monday) =>
              activityDate >= monday &&
              activityDate <
                new Date(monday.getTime() + 7 * 24 * 60 * 60 * 1000)
          );

          return weekIndex !== -1 ? { ...activity, week: weekIndex } : null;
        })
        .filter((activity) => activity !== null) // ✅ Filter out null activities
  );

  // Process each week's data
  const weeks = weekStarts.map((startDate, weekIndex) => {
    const weekActivities = recentActivities.filter(
      (a) => a && a.week === weekIndex
    );
    const endDate = new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000);

    const sportStats = weekActivities.reduce((acc, activity) => {
      if (!activity) return acc; // ✅ Safety check

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
        weekActivities.reduce((sum, a) => sum + (a ? a.kilometers : 0), 0) // ✅ Handle possible nulls
      ),
      activeDays: new Set(weekActivities.map((a) => a?.date)).size, // ✅ Ensure `a` is not null
      sports: Object.entries(sportStats)
        .map(([sport, stats]) => ({
          name: sport,
          kilometers: Math.round(stats.km),
          count: stats.count,
        }))
        .sort((a, b) => b.kilometers - a.kilometers),
    };
  });

  // Get all sports across the last four weeks
  const allSports = new Set(weeks.flatMap((w) => w.sports.map((s) => s.name)));

  // Compare each week's progress with the previous one
  const comparisons = weeks.slice(1).map((week, i) => ({
    weekChange:
      weeks[i].kilometers === 0
        ? 0
        : Math.round(
            ((week.kilometers - weeks[i].kilometers) / weeks[i].kilometers) *
              100
          ),
    activeDaysChange: week.activeDays - weeks[i].activeDays,
  }));

  return {
    weeks,
    allSports: Array.from(allSports),
    comparisons,
  };
};
