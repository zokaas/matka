import React from "react";
import { WeeklyData, User } from "@/app/types/types";
import { InfoIcon } from "lucide-react";

interface Props {
  users: User[];
  getLastFourWeeks: (users: User[]) => {
    weeks: WeeklyData[];
    allSports: string[];
  };
}

const WeeklyActivity: React.FC<Props> = ({ users, getLastFourWeeks }) => {
  const lastFourWeeks = getLastFourWeeks(users); // ✅ Pass users correctly

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Viikkoaktiivisuus
      </h3>
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="text-blue-500 mt-1">
            <InfoIcon className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-sm text-blue-800">
            <p>Viikot laskettu maanantaista sunnuntaihin</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left p-3 border-b">Laji</th>
              {lastFourWeeks.weeks.map((week: WeeklyData, i: number) => (
                <th key={i} className="p-3 text-right border-b min-w-[140px]">
                  <div className="font-semibold">
                    {i === 0
                      ? "Tämä viikko"
                      : i === 1
                      ? "Viime viikko"
                      : `${new Date(week.startDate).toLocaleDateString(
                        "fi-FI"
                      )} – ${new Date(week.endDate).toLocaleDateString("fi-FI")}`}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Yhteenveto */}
            <tr className="font-medium bg-gray-50">
              <td className="p-3 border-b">Yhteensä</td>
              {lastFourWeeks.weeks.map((week: WeeklyData, i: number) => (
                <td key={i} className="p-3 text-right border-b">
                  <div className="text-lg font-bold">
                    {week.kilometers.toLocaleString("fi-FI")} km
                  </div>
                </td>
              ))}
            </tr>

            {/* Lajikohtaiset rivit */}
            {lastFourWeeks.allSports.map((sport: string) => (
              <tr key={sport} className="hover:bg-gray-50">
                <td className="p-3 border-b">{sport}</td>
                {lastFourWeeks.weeks.map((week: WeeklyData, i: number) => {
                  const sportData = week.sports.find((s) => s.name === sport);
                  return (
                    <td key={i} className="p-3 text-right border-b">
                      {sportData ? (
                        <div>
                          <div className="font-medium">
                            {sportData.kilometers.toLocaleString("fi-FI")} km
                          </div>
                          <div className="text-sm text-gray-500">
                            {sportData.count}{" "}
                            {sportData.count === 1 ? "kerta" : "kertaa"}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-300">—</span>
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
