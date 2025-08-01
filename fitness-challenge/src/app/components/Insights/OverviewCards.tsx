// fitness-challenge/src/app/components/Insights/OverviewCards.tsx
import React from "react";
import { User, TargetPaces } from "../../types/types";
import { useTheme } from "@/app/hooks/useTheme";

interface Props {
  targetPaces: TargetPaces | null;
  users: User[];
}

export default function OverviewCards({ targetPaces }: Readonly<Props>) {
  const { t } = useTheme();
  
  if (!targetPaces) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-slate-50 p-4 rounded-lg">
        <h3 className="font-medium text-slate-800">{t.overviewCards.soFar}</h3>
        <p className="text-2xl font-bold text-slate-600">
          {Math.round(targetPaces.totalProgress).toLocaleString("fi-FI")} km
        </p>
        <p className="text-sm text-slate-600">/ 100 000 km</p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="font-medium text-orange-800">{t.overviewCards.weeklyGoal}</h3>
        <p className="text-2xl font-bold text-orange-600">
          {Math.round(targetPaces.weeklyPerUser)} km / {t.overviewCards.person}
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium text-green-800">{t.overviewCards.timeRemaining}</h3>
        <p className="text-2xl font-bold text-green-600">
          {targetPaces.daysRemaining} {t.overviewCards.days}
        </p>
      </div>
    </div>
  );
}