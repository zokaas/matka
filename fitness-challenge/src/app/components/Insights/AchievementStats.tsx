import { TargetPaces } from "@/app/types/types";
import React from "react";


interface Props {
  targetPaces: TargetPaces;
}

export default function AchievementStats({ targetPaces }: Readonly<Props>) {
  return (
    <div className="grid md:grid-cols-3 gap-6 bg-white p-6 rounded-xl shadow-sm">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-medium text-purple-800">Tähän mennessä</h3>
        <p className="text-2xl font-bold text-purple-600">
          {Math.round(targetPaces.totalProgress).toLocaleString("fi-FI")} km
        </p>
        <p className="text-sm text-purple-600">/ 100 000 km</p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-medium text-orange-800">Viikon tavoite</h3>
        <p className="text-2xl font-bold text-orange-600">
          {targetPaces.weeklyPerUser.toFixed(0)} km / hlö
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-green-800">Aikaa jäljellä</h3>
        <p className="text-2xl font-bold text-green-600">
          {targetPaces.daysRemaining} päivää
        </p>
      </div>
    </div>
  );
}
