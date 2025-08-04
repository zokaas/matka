import React from "react";
import { User } from "../../types/types";
import { useTheme } from "@/app/hooks/useTheme";

interface Props {
  users: User[];
}

export default function PopularSports({ users }: Readonly<Props>) {
  const { t, colors } = useTheme();
  
  const sportCounts = users
    .flatMap((user) => user.activities)
    .reduce((acc, activity) => {
      acc[activity.activity] = (acc[activity.activity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topSports = Object.entries(sportCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div 
      className="p-6 rounded-xl shadow-sm"
      style={{ backgroundColor: colors.card }}
    >
      <h3 
        className="text-xl font-semibold mb-6"
        style={{ color: colors.text }}
      >
        {t.popularSports.title}
      </h3>
      <ul className="space-y-2">
        {topSports.map(([sport, count], index) => (
          <li 
            key={sport} 
            className="flex items-center p-2 rounded transition-colors hover:opacity-80"
            style={{ backgroundColor: colors.secondary }}
          >
            <span 
              className="w-8 text-center font-bold"
              style={{ color: colors.accent }}
            >
              {index + 1}.
            </span>
            <span 
              className="font-medium"
              style={{ color: colors.text }}
            >
              {sport}
            </span>
            <span 
              className="ml-auto"
              style={{ color: colors.mutedText }}
            >
              {count} {count === 1 ? t.popularSports.time : t.popularSports.times}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}