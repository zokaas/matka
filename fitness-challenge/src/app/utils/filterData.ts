import { differenceInDays } from "date-fns";

export function filterDataByTimeframe<T extends { date: string }>(
  data: T[],
  timeframe: string
): T[] {
  const now = new Date();
  switch (timeframe) {
    case "week":
      return data.filter((d) => differenceInDays(now, new Date(d.date)) <= 7);
    case "month":
      return data.filter((d) => differenceInDays(now, new Date(d.date)) <= 30);
    default:
      return data;
  }
}
