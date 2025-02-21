import React from "react";
import { User } from "../../types/types";

interface Props {
  users: User[];
}

export default function PopularSports({ users }: Props) {
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
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Suosituimmat lajit
      </h3>
      <ul className="space-y-2">
        {topSports.map(([sport, count], index) => (
          <li key={sport} className="flex items-center p-2 bg-gray-50 rounded">
            <span className="w-8 text-center font-bold text-purple-600">
              {index + 1}.
            </span>
            <span className="text-gray-800 font-medium">{sport}</span>
            <span className="ml-auto text-gray-500">{count} kertaa</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
