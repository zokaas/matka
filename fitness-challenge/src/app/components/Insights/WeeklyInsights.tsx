import React from "react";
import { WeeklyInsight } from "@/app/types/types";

interface Props {
  weeklyInsights: WeeklyInsight[];
}

const WeeklyInsights: React.FC<Props> = ({ weeklyInsights }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Kuluvan viikon statsit
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-slate-100 text-slate-800 sticky top-0">
            <tr>
              {[
                "Petollinen",
                "Viikon edistyminen",
                "Loppuviikon päiväkohtainen tavoite",
              ].map((heading) => (
                <th
                  key={heading}
                  className="p-3 text-left font-semibold uppercase text-xs tracking-wider"
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
                className="border-b hover:bg-gray-100 transition-colors duration-200"
              >
                <td className="p-3 font-medium text-gray-800">
                  {user.username}
                </td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="relative w-3/4 bg-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="h-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                        style={{ width: `${user.weeklyPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600 ml-2">
                      {user.weeklyProgress.toLocaleString("fi-FI")} km (
                      {user.weeklyPercentage}%)
                    </span>
                  </div>
                </td>
                <td className="p-3 text-gray-700">
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
