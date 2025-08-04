import React from "react";
import { WeeklyInsight } from "@/app/types/types";
import { useTheme } from "@/app/hooks/useTheme";

interface Props {
  weeklyInsights: WeeklyInsight[];
}

const WeeklyInsights: React.FC<Props> = ({ weeklyInsights }) => {
  const { t, colors } = useTheme();
  
  return (
    <div 
      className="p-6 rounded-xl shadow-md border mt-6"
      style={{ 
        backgroundColor: colors.card,
        borderColor: colors.border 
      }}
    >
      <h3 
        className="text-xl font-semibold mb-6"
        style={{ color: colors.text }}
      >
        {t.weeklyInsights.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
          <thead 
            className="sticky top-0"
            style={{ backgroundColor: colors.secondary }}
          >
            <tr>
              {[
                t.weeklyInsights.participant,
                t.weeklyInsights.weeklyProgress,
                t.weeklyInsights.remainingWeeklyDailyTarget,
              ].map((heading) => (
                <th
                  key={heading}
                  className="p-3 text-left font-semibold uppercase text-xs tracking-wider"
                  style={{ color: colors.text }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeklyInsights.map((user) => (
              <tr
                key={user.username}
                className="border-b hover:opacity-80 transition-colors duration-200"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.card 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.card;
                }}
              >
                <td 
                  className="p-3 font-medium"
                  style={{ color: colors.text }}
                >
                  {user.username}
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div 
                      className="relative w-3/4 rounded-lg overflow-hidden"
                      style={{ backgroundColor: colors.border }}
                    >
                      <div
                        className="h-2 rounded-lg transition-all duration-500"
                        style={{ 
                          width: `${user.weeklyPercentage}%`,
                          background: `linear-gradient(to right, ${colors.primary}, ${colors.accent})`
                        }}
                      />
                    </div>
                    <span 
                      className="text-sm font-medium ml-2"
                      style={{ color: colors.text }}
                    >
                      {user.weeklyProgress.toLocaleString("fi-FI")} km (
                      {user.weeklyPercentage}%)
                    </span>
                  </div>
                </td>
                <td 
                  className="p-3"
                  style={{ color: colors.text }}
                >
                  {user.dailyTarget.toFixed(1)} km
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyInsights;