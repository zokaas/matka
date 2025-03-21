import React from "react";
import { format } from "date-fns";
import { TrendingUp, Calendar, Flag, Clock, AlertCircle, Zap } from "lucide-react";
import { useTargetPace } from "../TargetPaceContext";
import { formatNumberWithSpaces } from "@/app/utils/formatDate";

interface HeaderProps {
  participantCount: number;
}

const Header: React.FC<HeaderProps> = () => {
  const targetPaces = useTargetPace();

  // Loading state
  if (!targetPaces) {
    return (
      <div className="bg-purple-500 p-3 rounded-xl text-center">
        <div className="animate-pulse space-y-2">
          <div className="h-2 bg-purple-300 rounded w-3/4 mx-auto"></div>
          <div className="h-2 bg-purple-300 rounded w-1/2 mx-auto"></div>
        </div>
        <p className="text-xs text-white font-medium mt-2">Ladataan tietoja...</p>
      </div>
    );
  }

  // Calculate values once
  const { 
    totalProgress, 
    projectedEndDate, 
    historicalPace, 
    remainingDistance, 
    daysRemaining, 
    behindAmount,
    expectedProgressToday 
  } = targetPaces;
  
  const formattedProjectedDate = projectedEndDate
    ? format(new Date(projectedEndDate), "d.M.yyyy")
    : "Ei tiedossa";

  const completionPercentage = Math.min(100, Math.round((totalProgress / 100000) * 100));
  
  // Format numbers once
  const formattedTotalProgress = formatNumberWithSpaces(Math.round(totalProgress));
  const formattedHistoricalPace = formatNumberWithSpaces(Math.round(historicalPace));
  const formattedRemainingDistance = formatNumberWithSpaces(Math.round(remainingDistance));
  const formattedBehindAmount = formatNumberWithSpaces(Math.round(behindAmount));
  const formattedExpectedProgress = formatNumberWithSpaces(Math.round(expectedProgressToday));

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-md mx-auto">
      {/* Progress Bar Section */}
      <div className="bg-purple-600 p-3 text-white">
        <h2 className="text-base font-medium flex items-center">
          <Zap className="w-4 h-4 mr-1.5" />
          Eteneminen kohti tavoitetta
        </h2>
        <div className="mt-2 bg-white/20 h-2 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${completionPercentage}%` }}></div>
        </div>
        <div className="flex justify-between mt-1.5 text-xs">
          <span>{completionPercentage}% valmis</span>
          <span>{formattedTotalProgress} / 100 000 km</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="p-2.5">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Current Speed */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col">
            <div className="text-xs font-medium mb-1 flex items-center justify-center text-purple-700">
              <TrendingUp className="w-4 h-4 mr-1 text-purple-500" />
              Nykyinen vauhti
            </div>
            <div className="text-2xl font-bold text-center text-purple-600">
              {formattedHistoricalPace}
            </div>
            <div className="text-center text-purple-500 mb-0.5">km/hlö</div>
            <div className="text-xs text-gray-500 text-center mt-auto">
              Vauhtikeskiarvo haasteen alusta lähtien
            </div>
          </div>

          {/* Remaining Distance */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col">
            <div className="text-xs font-medium mb-1 flex items-center justify-center text-green-700">
              <Flag className="w-4 h-4 mr-1 text-green-500" />
              Matkaa jäljellä
            </div>
            <div className="text-2xl font-bold text-center text-green-600">
              {formattedRemainingDistance}
            </div>
            <div className="text-center text-green-500 mb-0.5">km</div>
            <div className="text-xs text-gray-500 text-center mt-auto">
              Kokonaistavoite
            </div>
            <div className="text-xs text-gray-500 text-center mt-auto">100 000 km
            </div>
          </div>

          {/* Days Left */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col">
            <div className="text-xs font-medium mb-1 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4 mr-1 text-amber-500" />
              Päiviä jäljellä
            </div>
            <div className="text-2xl font-bold text-center text-amber-600">
              {Math.round(daysRemaining)}
            </div>
            <div className="text-xs text-gray-500 text-center mt-auto">
              Haaste alkoi
            </div>
            <div className="text-xs text-gray-500 text-center mt-auto">
6.1.2025
            </div>
          </div>

                              {/* Estimated Completion */}
                              <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col">
            <div className="text-xs font-medium mb-1 flex items-center justify-center text-blue-700">
              <Calendar className="w-4 h-4 mr-1 text-blue-500" />
              Arviolta maalissa
            </div>
            <div className="text-2xl font-bold text-center text-blue-600">
              {formattedProjectedDate}
            </div>
            <div className="text-xs text-gray-500 text-center mt-auto">
Tavoiteaika maaliin
            </div>
            <div className="text-xs text-gray-500 text-center mt-auto">
22.6.2025
            </div>
          </div>
        </div>

        {/* Behind Target */}
        {behindAmount > 0 && (
          <div className="mt-2.5 bg-red-50 border border-red-100 p-3 rounded-xl flex flex-col text-center">
            <div className="flex justify-center items-center text-red-700 text-xs font-medium mb-1">
              <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
              Jäljessä tavoitteesta
            </div>

            <div className="text-2xl font-bold text-red-600 mb-0.5">
              {formattedBehindAmount} km
            </div>

            <div className="text-xs text-red-600 mt-auto">
              Tavoitteen mukaan pitäisi olla{" "}
              <span className="font-medium">
                {formattedExpectedProgress} km
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;