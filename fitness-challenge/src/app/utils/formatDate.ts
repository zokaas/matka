// 🔥 Format a date safely
import { format, isValid, parseISO } from "date-fns";

export function formatDate(date: string) {
  const parsedDate = parseISO(date); // ✅ Safely parse the date
  return isValid(parsedDate) ? format(parsedDate, "d.M.yyyy") : "Invalid date"; // ✅ Handle invalid dates
}

export const formatNumberWithSpaces = (num: number) => {
  return num.toLocaleString("fi-FI").replace(/\u00A0/g, " "); // Ensures non-breaking spaces
};

