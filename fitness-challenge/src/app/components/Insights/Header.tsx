import React from "react";
import { format } from "date-fns";
import { TrendingUp, Calendar, Flag, AlertCircle } from "lucide-react";

interface TargetPaces {
  weeklyPerUser: number;
  totalProgress: number;
  remainingDistance: number;
  projectedEndDate?: Date | null;
  extraKmNeeded?: number;
  nextWeekExtraKm?: number;
  behindAmount?: number;
  daysRemaining: number;
}

interface HeaderProps {
  targetPaces: TargetPaces;
  participantCount?: number;
}

const Header: React.FC<HeaderProps> = ({ targetPaces, participantCount = 10 }) => {
  if (!targetPaces) {
    return (
      <div className="bg-gradient-to-r from-[#eef2ff] to-[#f8f9ff] p-5 rounded-lg shadow-md text-center">
        <p className="text-sm text-[#5555cc] font-medium">Ladataan tietoja...</p>
      </div>
    );
  }

  const today = new Date();
  const targetCompletionDate = new Date("2025-06-22");
  const daysLeftUntilTarget = Math.ceil(
    (targetCompletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Required pace to finish on time
  const requiredWeeklyPace = Math.round(targetPaces.remainingDistance / (daysLeftUntilTarget / 7));
  const requiredWeeklyPacePerUser = Math.round(requiredWeeklyPace / participantCount);

  // Current weekly pace
  const currentWeeklyPace = Math.round(targetPaces.weeklyPerUser * participantCount);
  const currentWeeklyPacePerUser = Math.round(targetPaces.weeklyPerUser);

  // Estimated completion date if current pace continues
  const estimatedDaysToFinish =
    currentWeeklyPace > 0
      ? Math.ceil(targetPaces.remainingDistance / (currentWeeklyPace / 7))
      : null;

  let projectedCompletionDate: Date | null = null;
  if (estimatedDaysToFinish !== null) {
    projectedCompletionDate = new Date();
    projectedCompletionDate.setDate(projectedCompletionDate.getDate() + estimatedDaysToFinish);
  }

  // Format only if the date is valid
  const formattedProjectedDate =
    projectedCompletionDate && !isNaN(projectedCompletionDate.getTime())
      ? format(projectedCompletionDate, "d.M.yyyy")
      : "Ei tiedossa";

  const differenceInDays = estimatedDaysToFinish ? estimatedDaysToFinish - daysLeftUntilTarget : null;

  return (
    <div className="bg-white border border-[#e0e5ff] p-6 rounded-lg shadow-lg">
      {/* 🔹 Header */}
      <p className="text-sm text-[#5555cc] font-semibold mb-4">
        Seurataan etenemistä kohti tavoitetta ✨
      </p>

      {/* 📊 Summary Stats */}
      <div className="grid grid-cols-2 gap-y-3 mb-6 text-sm">
        <div className="flex items-center">
          <div className="text-[#6666cc] mr-2">📈</div>
          <span className="text-[#6666cc]">Tavoitevauhti:</span>
        </div>
        <div className="ml-auto text-base font-bold">{Math.round(targetPaces.weeklyPerUser)} km/hlö</div>

        <div className="flex items-center">
          <div className="text-[#6666cc] mr-2">📅</div>
          <span className="text-[#6666cc]">Tavoitepäivä:</span>
        </div>
        <div className="ml-auto text-base font-bold">
          {targetPaces.projectedEndDate && !isNaN(new Date(targetPaces.projectedEndDate).getTime())
            ? format(new Date(targetPaces.projectedEndDate), "d.M.yyyy")
            : "Ei tiedossa"}
        </div>

        <div className="flex items-center">
          <div className="text-[#6666cc] mr-2">🚩</div>
          <span className="text-[#6666cc]">Jäljellä:</span>
        </div>
        <div className="ml-auto text-base font-bold">{Math.round(targetPaces.remainingDistance)} km</div>

        {targetPaces.behindAmount !== undefined && (
          <div className="bg-red-50 border border-red-300 p-3 rounded-md flex items-center shadow-sm col-span-2">
            <AlertCircle className="text-red-500 w-5 h-5 mr-2" />
            <span className="text-sm font-medium text-red-700">
              Jäljessä tavoitteesta <strong>{Math.round(targetPaces.behindAmount)} km</strong>
            </span>
          </div>
        )}

        <div className="flex items-center">
          <div className="text-[#6666cc] mr-2">📆</div>
          <span className="text-[#6666cc]">Päiviä jäljellä:</span>
        </div>
        <div className="ml-auto text-base font-bold">{Math.round(targetPaces.daysRemaining)}</div>
      </div>

      {/* 📊 Tavoitevauhdit */}
      <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm mb-4">
        <div className="flex items-center mb-2 text-gray-700">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          <span className="text-sm font-semibold">📊 Tavoitevauhdit</span>
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-900">
          <span className="font-medium text-gray-600">📅 Tavoitevauhti (22.6.):</span>
          <span className="font-semibold text-blue-700">{requiredWeeklyPacePerUser} km/hlö</span>

          <span className="font-medium text-gray-600">📊 Nykyinen vauhti:</span>
          <span className="font-semibold text-green-700">{currentWeeklyPacePerUser} km/hlö</span>

          <span className="font-medium text-gray-600">⏳ Arvioitu maaliin:</span>
          <span className="font-semibold">{formattedProjectedDate}</span>

          <span className="font-medium text-gray-600">🕒 Erotus tavoitteesta:</span>
          <span className={`font-semibold ${differenceInDays && differenceInDays > 0 ? "text-red-600" : "text-green-600"}`}>
            {differenceInDays && differenceInDays > 0 ? `+${differenceInDays} päivää` : "Aikataulussa!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
