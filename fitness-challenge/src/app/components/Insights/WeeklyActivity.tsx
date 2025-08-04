import React from "react";
import { WeeklyData, User } from "@/app/types/types";
import { InfoIcon } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";

interface Props {
  users: User[];
  getLastFourWeeks: (users: User[]) => {
    weeks: WeeklyData[];
    allSports: string[];
  };
}

const WeeklyActivity: React.FC<Props> = ({ users, getLastFourWeeks }) => {
  const { colors, t } = useTheme();
  const lastFourWeeks = getLastFourWeeks(users);

  return (
    <div 
      className="p-6 rounded-xl shadow-sm"
      style={{ backgroundColor: colors.card }}
    >
      <h3 className="text-xl font-semibold mb-6" style={{ color: colors.text }}>
        {t.weeklyActivity.title}
      </h3>
      <div 
        className="p-4 rounded-lg border mb-6"
        style={{ backgroundColor: colors.secondary, borderColor: colors.border }}
      >
        <div className="flex items-start gap-3">
          <div style={{ color: colors.mutedText }} className="mt-1">
            <InfoIcon className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-sm" style={{ color: colors.text }}>
            <p>{t.weeklyActivity.mondayToSunday}</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th 
                className="text-left p-3 border-b font-semibold"
                style={{ color: colors.text, borderColor: colors.border }}
              >
                {t.weeklyActivity.sport}
              </th>
              {lastFourWeeks.weeks.map((week: WeeklyData, i: number) => (
                <th 
                  key={i} 
                  className="p-3 text-right border-b min-w-[140px] font-semibold"
                  style={{ color: colors.text, borderColor: colors.border }}
                >
                  <div>
                    {i === 0
                      ? t.weeklyActivity.thisWeek
                      : i === 1
                      ? t.weeklyActivity.lastWeek
                      : `${new Date(week.startDate).toLocaleDateString(
                        "fi-FI"
                      )} – ${new Date(week.endDate).toLocaleDateString("fi-FI")}`}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Summary Row */}
            <tr 
              className="font-medium"
              style={{ backgroundColor: colors.secondary }}
            >
              <td 
                className="p-3 border-b font-semibold"
                style={{ color: colors.text, borderColor: colors.border }}
              >
                {t.weeklyActivity.total}
              </td>
              {lastFourWeeks.weeks.map((week: WeeklyData, i: number) => (
                <td 
                  key={i} 
                  className="p-3 text-right border-b"
                  style={{ borderColor: colors.border }}
                >
                  <div className="text-lg font-bold" style={{ color: colors.text }}>
                    {week.kilometers.toLocaleString("fi-FI")} km
                  </div>
                </td>
              ))}
            </tr>

            {/* Sport-specific rows */}
            {lastFourWeeks.allSports.map((sport: string) => (
              <tr 
                key={sport} 
                className="hover:opacity-80 transition-opacity"
                style={{ backgroundColor: colors.card }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.secondary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.card;
                }}
              >
                <td 
                  className="p-3 border-b"
                  style={{ color: colors.text, borderColor: colors.border }}
                >
                  {sport}
                </td>
                {lastFourWeeks.weeks.map((week: WeeklyData, i: number) => {
                  const sportData = week.sports.find((s) => s.name === sport);
                  return (
                    <td 
                      key={i} 
                      className="p-3 text-right border-b"
                      style={{ borderColor: colors.border }}
                    >
                      {sportData ? (
                        <div>
                          <div className="font-medium" style={{ color: colors.text }}>
                            {sportData.kilometers.toLocaleString("fi-FI")} km
                          </div>
                          <div className="text-sm" style={{ color: colors.mutedText }}>
                            {sportData.count}{" "}
                            {sportData.count === 1 ? t.weeklyActivity.time : t.weeklyActivity.times}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: colors.border }}>—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeeklyActivity;