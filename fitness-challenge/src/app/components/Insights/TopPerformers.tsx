import React from "react";
import { WeeklyInsight } from "@/app/types/types";

interface Props {
  weeklyInsights: WeeklyInsight[];
}

export default function TopPerformers({ weeklyInsights }: Readonly<Props>) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Viikon Top Suorittajat
      </h3>
      <ul className="space-y-2">
        {weeklyInsights.map((user, index) => (
          <li
            key={user.username}
            className="flex items-center p-2 bg-gray-50 rounded"
          >
            <span className="w-8 text-center font-bold bg-slate-600">
              {index + 1}.
            </span>
            <span className="text-gray-800 font-medium">{user.username}</span>
            <span className="ml-auto text-gray-500">
              {user.weeklyProgress} km
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
