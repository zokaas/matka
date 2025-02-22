import { differenceInDays, isValid, parseISO } from "date-fns";

// 🔥 Filter data based on timeframe (week or month)
export function filterDataByTimeframe<T extends { date: string }>(
  data: T[],
  timeframe: "week" | "month" | "all"
): T[] {
  const now = new Date();

  return data.filter((d) => {
    const parsedDate = parseISO(d.date); // Parse safely
    if (!isValid(parsedDate)) return false; // ✅ Ensure the date is valid

    const daysDifference = differenceInDays(now, parsedDate);
    if (daysDifference < 0) return false; // ✅ Avoid future dates

    switch (timeframe) {
      case "week":
        return daysDifference <= 7;
      case "month":
        return daysDifference <= 30;
      default:
        return true; // "all" case returns full data
    }
  });
}