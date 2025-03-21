import React from "react";
import { format } from "date-fns";
import { TrendingUp, Calendar, Flag, Clock, AlertCircle, Zap, ArrowUp } from "lucide-react";
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
            Vauhtikeskiarvo
          </div>
          <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-purple-600 text-2xl font-bold">{formattedHistoricalPace}</span>
              <span className="text-purple-500 text-sm ml-1">km/hlö/vko</span>
            </div>
          </div>
        </div>

          {/* Remaining Distance */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col">
            <div className="text-xs font-medium mb-1 flex items-center justify-center text-green-700">
              <Flag className="w-4 h-4 mr-1 text-green-500" />
              Matkaa jäljellä
            </div>
            <div className="text-center">
            <div className="flex items-baseline justify-center">
              <span className="text-purple-600 text-2xl font-bold">{formattedRemainingDistance}</span>
              <span className="text-purple-500 text-sm ml-1">km</span>
            </div>
          </div>
          </div>

          {/* Days Left */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col">
            <div className="text-xs font-medium mb-1 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4 mr-1 text-amber-500" />
              Päiviä juhannukseen
            </div>
            <div className="text-2xl font-bold text-center text-amber-600">
              {Math.round(daysRemaining)}
            </div>
          </div>

{/* Estimated Completion */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col">
            <div className="text-xs font-medium mb-1 flex items-center justify-center text-blue-700">
              <Calendar className="w-4 h-4 mr-1 text-blue-500" />
              Nykyvauhdilla maalissa
            </div>
            <div className="text-2xl font-bold text-center text-blue-600">
              {formattedProjectedDate}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;