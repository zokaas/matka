import React from "react";
import { format, differenceInDays } from "date-fns";
import {
  TrendingUp,
  Calendar,
  Flag,
  Clock,
  Zap,
  Target,
  Users,
  Trophy,
} from "lucide-react";
import { useTargetPace } from "../TargetPaceContext";
import { formatNumberWithSpaces } from "@/app/utils/formatDate";
import Loader from "../common/Loader";
import { useTheme } from "@/app/hooks/useTheme";
import { challengeParams } from "@/app/constants/challengeParams";
import { ThemeColors } from "@/app/themes/themeTypes";

interface HeaderProps {
  participantCount: number;
}

const Header: React.FC<HeaderProps> = ({ participantCount }) => {
  const targetPaces = useTargetPace();
  const { colors, t } = useTheme();

  if (!targetPaces) return <Loader />;

  const {
    totalProgress,
    projectedEndDate,
    historicalPace,
    remainingDistance,
    daysRemaining,
    behindAmount,
    expectedProgressToday,
  } = targetPaces;

  // Calculate challenge progress using challengeParams
  const challengeStartDate = new Date(challengeParams.startDate);
  const challengeEndDate = new Date(challengeParams.endDate);
  const totalChallengeDays = challengeParams.totalDays;
  const dailyTargetDistance = challengeParams.dailyTarget;
  const weeklyTargetDistance = challengeParams.weeklyTarget;
  
  // Calculate days since start
  const daysSinceStart = Math.max(0, differenceInDays(new Date(), challengeStartDate));
  const challengeProgressPercentage = Math.min(100, (daysSinceStart / totalChallengeDays) * 100);
  
  // Calculate completion percentage
  const completionPercentage = Math.min(100, Math.round((totalProgress / challengeParams.totalDistance) * 100));
  
  // Calculate if we're on track
  const expectedProgressByNow = (challengeParams.totalDistance * daysSinceStart) / totalChallengeDays;
  const progressStatus = totalProgress >= expectedProgressByNow ? 'ahead' : 'behind';
  const progressDifference = Math.abs(totalProgress - expectedProgressByNow);

  const formattedProjectedDate = projectedEndDate
    ? format(new Date(projectedEndDate), "d.M.yyyy")
    : t.paceProjection.noData;

  const formattedTotalProgress = formatNumberWithSpaces(Math.round(totalProgress));
  const formattedHistoricalPace = formatNumberWithSpaces(Math.round(historicalPace));
  const formattedRemainingDistance = formatNumberWithSpaces(Math.round(remainingDistance));
  const formattedTargetDistance = formatNumberWithSpaces(challengeParams.totalDistance);

  return (
    <div className="space-y-6">
      {/* Challenge Overview Card */}
      <div
        className="rounded-xl shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.card, color: colors.text }}
      >
        {/* Challenge Info Header */}
        <div
          className="p-4 text-center"
          style={{ backgroundColor: colors.primary, color: colors.background }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            🚴‍♂️ {t.dashboardTitle} 🚴‍♂️
          </h1>
          <p className="text-sm opacity-90">
            {format(challengeStartDate, 'd.M.yyyy')} - {format(challengeEndDate, 'd.M.yyyy')}
          </p>
        </div>

        {/* Progress Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Overall Challenge Progress */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colors.text }}>
                <Trophy className="w-5 h-5 mr-2" style={{ color: colors.accent }} />
                Haasteen edistyminen
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm" style={{ color: colors.mutedText }}>
                  <span>Matka suoritettu</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div 
                  className="h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: colors.border }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${completionPercentage}%`,
                      backgroundColor: completionPercentage >= 100 ? '#22c55e' : colors.accent,
                    }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold" style={{ color: colors.text }}>
                    {formattedTotalProgress}
                  </span>
                  <span className="text-lg" style={{ color: colors.mutedText }}>
                    {" "} / {formattedTargetDistance} km
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Progress */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: colors.text }}>
                <Calendar className="w-5 h-5 mr-2" style={{ color: colors.accent }} />
                Aikataulu
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm" style={{ color: colors.mutedText }}>
                  <span>Aika kulunut</span>
                  <span>{Math.round(challengeProgressPercentage)}%</span>
                </div>
                <div 
                  className="h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: colors.border }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${challengeProgressPercentage}%`,
                      backgroundColor: colors.secondary,
                    }}
                  />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold" style={{ color: colors.text }}>
                    {daysSinceStart}
                  </span>
                  <span className="text-lg" style={{ color: colors.mutedText }}>
                    {" "} / {totalChallengeDays} päivää
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Status Alert */}
          <div
            className="p-4 rounded-lg mb-6"
            style={{
              backgroundColor: progressStatus === 'ahead' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${progressStatus === 'ahead' ? '#22c55e' : '#ef4444'}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="text-2xl"
              >
                {progressStatus === 'ahead' ? '🚀' : '⚠️'}
              </div>
              <div>
                <p 
                  className="font-semibold"
                  style={{ color: progressStatus === 'ahead' ? '#16a34a' : '#dc2626' }}
                >
                  {progressStatus === 'ahead' 
                    ? `Etuajassa! 🎉` 
                    : `Tavoitteesta jäljessä`
                  }
                </p>
                <p 
                  className="text-sm"
                  style={{ color: progressStatus === 'ahead' ? '#16a34a' : '#dc2626' }}
                >
                  {progressStatus === 'ahead' 
                    ? `${formatNumberWithSpaces(Math.round(progressDifference))} km yli tavoitteen`
                    : `${formatNumberWithSpaces(Math.round(progressDifference))} km tavoitteesta jäljessä`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              value={participantCount.toString()}
              label="Pyöräilijää"
              colors={colors}
            />
            <StatCard
              icon={<Target className="w-5 h-5" />}
              value={`${dailyTargetDistance} km`}
              label="Päivätavoite"
              colors={colors}
            />
            <StatCard
              icon={<Flag className="w-5 h-5" />}
              value={`${Math.round(weeklyTargetDistance)} km`}
              label="Viikkotavoite"
              colors={colors}
            />
            <StatCard
              icon={<Clock className="w-5 h-5" />}
              value={daysRemaining.toString()}
              label="Päivää jäljellä"
              colors={colors}
            />
          </div>
        </div>
      </div>

      {/* Detailed Progress Card */}
      <div
        className="rounded-xl shadow-sm overflow-hidden max-w-2xl mx-auto"
        style={{ backgroundColor: colors.card, color: colors.text }}
      >
        <div
          className="p-3"
          style={{ backgroundColor: colors.secondary }}
        >
          <h2 className="text-base font-medium flex items-center" style={{ color: colors.text }}>
            <Zap className="w-4 h-4 mr-1.5" />
            Yksityiskohtainen analyysi
          </h2>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <DetailedStatCard
              icon={<TrendingUp className="w-4 h-4" />}
              value={`${formattedHistoricalPace}`}
              label="Historiallinen vauhti"
              unit="km/hlö/vko"
              colors={colors}
            />
            <DetailedStatCard
              icon={<Flag className="w-4 h-4" />}
              value={formattedRemainingDistance}
              label="Matkaa jäljellä"
              unit="km"
              colors={colors}
            />
            <DetailedStatCard
              icon={<Calendar className="w-4 h-4" />}
              value={formattedProjectedDate}
              label="Arvioitu valmistuminen"
              colors={colors}
            />
            <DetailedStatCard
              icon={<Target className="w-4 h-4" />}
              value={`${Math.round((totalProgress / participantCount) || 0)} km`}
              label="Keskiarvo / hlö"
              colors={colors}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({
  icon,
  value,
  label,
  colors,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  colors: ThemeColors;
}) {
  return (
    <div
      className="p-3 rounded-lg text-center transition-transform hover:scale-105"
      style={{ backgroundColor: colors.secondary }}
    >
      <div className="mb-2 flex justify-center" style={{ color: colors.accent }}>
        {icon}
      </div>
      <div className="text-lg font-bold" style={{ color: colors.text }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: colors.mutedText }}>
        {label}
      </div>
    </div>
  );
}

function DetailedStatCard({
  icon,
  value,
  label,
  unit,
  colors,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  unit?: string;
  colors: ThemeColors;
}) {
  return (
    <div
      className="rounded-xl p-3 border"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
    >
      <div className="text-xs font-medium mb-2 flex items-center" style={{ color: colors.mutedText }}>
        <span className="mr-1" style={{ color: colors.accent }}>{icon}</span>
        {label}
      </div>
      <div className="flex items-baseline">
        <span className="text-xl font-bold" style={{ color: colors.text }}>
          {value}
        </span>
        {unit && <span className="text-sm ml-1" style={{ color: colors.mutedText }}>{unit}</span>}
      </div>
    </div>
  );
}

export default Header;