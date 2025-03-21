import React from "react";
import { format, differenceInWeeks } from "date-fns";
import { TrendingUp, Calendar, Flag, Clock, AlertCircle, Zap } from "lucide-react";

export interface TargetPaces {
  weeklyPerUser: number;
  totalProgress: number;
  remainingDistance: number;
  projectedEndDate?: Date | null;
  extraKmNeeded?: number;
  nextWeekExtraKm?: number;
  behindAmount?: number;
  daysRemaining: number;
  historicalPace?: number;
  recentPace?: number;
  weeklyPace?: number;
  weightedPace?: number;
  daysFromTarget?: number;
}

interface HeaderProps {
  targetPaces: TargetPaces;
  participantCount?: number;
}

const Header: React.FC<HeaderProps> = ({ targetPaces, participantCount = 10 }) => {
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

  const today = new Date();
  const targetCompletionDate = new Date("2025-06-22");
  const challengeStartDate = new Date("2025-01-06");
  
  // Laske päivien ja viikkojen määrä haasteen alusta nykyhetkeen
  const daysLeftUntilTarget = Math.ceil(
    (targetCompletionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Laske viikkojen määrä haasteen alusta (käytetään kokonaismatkan viikkovauhdin laskemiseen)
  const weeksFromStart = Math.max(1, differenceInWeeks(today, challengeStartDate) + 1); // +1 jotta saadaan mukaan vajaa viikko

  // Laske nykyinen viikkovauhti koko matkan perusteella
  const totalWeeklyPace = targetPaces.totalProgress / weeksFromStart;
  const totalWeeklyPacePerUser = Math.round(totalWeeklyPace / participantCount);
  
  // Required pace to finish on time
  const requiredWeeklyPace = Math.round(targetPaces.remainingDistance / (daysLeftUntilTarget / 7));
  const requiredWeeklyPacePerUser = Math.round(requiredWeeklyPace / participantCount);

  // Käytä targetPaces.projectedEndDate-arvoa
  const formattedProjectedDate = targetPaces.projectedEndDate 
    ? format(new Date(targetPaces.projectedEndDate), "d.M.yyyy") 
    : "Ei tiedossa";

  // Laske päivien erotus hookista tulevan päivämäärän perusteella
  const differenceInDays = targetPaces.projectedEndDate
    ? Math.ceil((new Date(targetPaces.projectedEndDate).getTime() - targetCompletionDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Calculate completion percentage
  const completionPercentage = Math.min(100, Math.round((targetPaces.totalProgress / 100000) * 100));

  // Calculate pace ratio for progress bar
  const paceRatio = totalWeeklyPacePerUser / requiredWeeklyPacePerUser;
  const pacePercentage = Math.min(100, Math.round(paceRatio * 100));

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-purple-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <h2 className="text-lg font-bold flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Eteneminen kohti tavoitetta
        </h2>
        <div className="mt-2 bg-white/20 h-2.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs font-medium text-white/90">
          <span>{completionPercentage}% valmis</span>
          <span>{Math.round(targetPaces.totalProgress).toLocaleString()} / 100 000 km</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="p-4 sm:p-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center text-purple-900 text-xs font-semibold mb-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>Nykyinen vauhti</span>
            </div>
            <div className="text-lg font-bold text-purple-700">{totalWeeklyPacePerUser} km/hlö</div>
            <div className="text-xs text-gray-500">Koko matkan keskiarvo</div>
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
        
        {/* Behind Amount Warning */}
        {targetPaces.behindAmount !== undefined && (
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

        {/* Required vs Current Pace Comparison */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 mr-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-gray-800">Tarvittava vs. nykyinen vauhti</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-8 bg-blue-500 rounded-sm mr-3"></div>
                <div>
                  <div className="text-xs text-gray-500">Tavoitevauhti (22.6.)</div>
                  <div className="font-bold text-blue-700">{requiredWeeklyPacePerUser} km/hlö/vko</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-8 bg-green-500 rounded-sm mr-3"></div>
                <div>
                  <div className="text-xs text-gray-500">Nykyinen vauhti</div>
                  <div className="font-bold text-green-700">{totalWeeklyPacePerUser} km/hlö/vko</div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Maaliin saapumisen aikataulu</span>
                <span>Arvioitu maaliin saapuminen</span>
              </div>
              
              <div className="flex justify-between">
                <div className={`font-bold ${differenceInDays && differenceInDays > 0 ? "text-red-600" : "text-green-600"}`}>
                  {differenceInDays 
                    ? differenceInDays > 0 
                      ? `+${differenceInDays} päivää myöhässä` 
                      : differenceInDays < 0 
                        ? `${Math.abs(differenceInDays)} päivää etuajassa` 
                        : "Täsmälleen aikataulussa!"
                    : "Aikataulussa!"}
                </div>
                <div className="font-bold">{formattedProjectedDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;