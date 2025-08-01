// fitness-challenge/src/app/components/Insights/OverviewCards.tsx
import React from "react";
import { User, TargetPaces } from "../../types/types";

interface Props {
  targetPaces: TargetPaces | null;
  users: User[];
}

export default function OverviewCards({ targetPaces }: Readonly<Props>) {
  if (!targetPaces) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="font-medium text-slate-800">Tähän mennessä</h3>
        <p className="text-2xl font-bold text-slate-600">
          {Math.round(targetPaces.totalProgress).toLocaleString("fi-FI")} km
        </p>
        <p className="text-sm text-slate-600">/ 100 000 km</p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-medium text-orange-800">Viikon tavoite</h3>
        <p className="text-2xl font-bold text-orange-600">
          {Math.round(targetPaces.weeklyPerUser)} km / hlö
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium bg-slate-800">Aikaa jäljellä</h3>
        <p className="text-2xl font-bold bg-slate-600">
          {targetPaces.daysRemaining} päivää
        </p>
      </div>
    </div>
  );
}