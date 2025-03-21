// Updated Header.tsx
import React from "react";
import { format } from "date-fns";
import { TrendingUp, Calendar, Flag, Clock, AlertCircle, Zap } from "lucide-react";
import { useTargetPace } from "../TargetPaceContext";

interface HeaderProps {
  participantCount: number;
}

const Header: React.FC<HeaderProps> = () => {
  // Use the dedicated hook instead of direct context access
  const targetPaces = useTargetPace();

  // Loading state when data isn't ready yet
  if (!targetPaces) {
    return (
      <div className="bg-gradient-to-r from-[#eef2ff] to-[#f8f9ff] p-5 rounded-lg shadow-md text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-blue-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2 mx-auto"></div>
          <div className="h-4 bg-blue-200 rounded w-2/3 mx-auto"></div>
        </div>
        <p className="text-sm text-[#5555cc] font-medium mt-4">Ladataan tietoja...</p>
      </div>
    );
  }


  const formattedProjectedDate = targetPaces.projectedEndDate
    ? format(new Date(targetPaces.projectedEndDate), "d.M.yyyy")
    : "Ei tiedossa";

  const completionPercentage = Math.min(100, Math.round((targetPaces.totalProgress / 100000) * 100));



  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <h2 className="text-lg font-bold flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Eteneminen kohti tavoitetta
        </h2>
        <div className="mt-2 bg-white/20 h-2.5 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${completionPercentage}%` }}></div>
        </div>
        <div className="flex justify-between mt-1 text-xs font-medium text-white/90">
          <span>{completionPercentage}% valmis</span>
          <span>{Math.round(targetPaces.totalProgress).toLocaleString()} / 100 000 km</span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center text-purple-900 text-xs font-semibold mb-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>Nykyinen vauhti</span>
            </div>
            <div className="text-lg font-bold text-purple-700">
              {Math.round(targetPaces.weeklyPace)} km/hlö
            </div>
            <div className="text-xs text-gray-500">Keskiarvo alusta lähtien</div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center text-blue-900 text-xs font-semibold mb-1">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              <span>Arvioitu valmistuminen</span>
            </div>
            <div className="text-lg font-bold text-blue-700">{formattedProjectedDate}</div>
            <div className="text-xs text-gray-500">Tavoite: 22.6.2025</div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center text-green-900 text-xs font-semibold mb-1">
              <Flag className="w-3.5 h-3.5 mr-1" />
              <span>Jäljellä</span>
            </div>
            <div className="text-lg font-bold text-green-700">{Math.round(targetPaces.remainingDistance).toLocaleString()} km</div>
            <div className="text-xs text-gray-500">Kokonaistavoite: 100 000 km</div>
          </div>

          <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center text-orange-900 text-xs font-semibold mb-1">
              <Clock className="w-3.5 h-3.5 mr-1" />
              <span>Päiviä jäljellä</span>
            </div>
            <div className="text-lg font-bold text-orange-700">{Math.round(targetPaces.daysRemaining)}</div>
            <div className="text-xs text-gray-500">Alkanut: 6.1.2025</div>
          </div>
        </div>

        {targetPaces.behindAmount !== undefined && targetPaces.behindAmount > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 p-3 rounded-lg flex items-center shadow-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 mr-3">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-red-800">Jäljessä tavoitteesta</p>
              <p className="text-sm text-red-700">
                Tarvitaan <strong>{Math.round(targetPaces.behindAmount).toLocaleString()} km</strong> lisää pysyäksemme aikataulussa
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;