import React from "react";
import { User, TargetPaces } from "../../types/types";
import { useTheme } from "@/app/hooks/useTheme";
import { challengeParams } from "@/app/constants/challengeParams";
import { differenceInDays, format } from "date-fns";
import { 
  Trophy, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock, 
  Users,
  Zap,
  Flag 
} from "lucide-react";
import { Theme, ThemeColors } from "@/app/themes/themeTypes";

interface Props {
  targetPaces: TargetPaces | null;
  users: User[];
}

export default function EnhancedOverviewCards({ targetPaces, users }: Readonly<Props>) {
  const { t, colors } = useTheme();
  
  if (!targetPaces || !users.length) return null;

  // Calculate enhanced metrics using challengeParams
  const challengeStartDate = new Date(challengeParams.startDate);
  const challengeEndDate = new Date(challengeParams.endDate);
  const today = new Date();
  
  const daysSinceStart = Math.max(0, differenceInDays(today, challengeStartDate));
  const daysRemaining = Math.max(0, differenceInDays(challengeEndDate, today));
  const totalChallengeDays = challengeParams.totalDays;
  
  // Progress calculations
  const expectedProgressByNow = (challengeParams.totalDistance * daysSinceStart) / totalChallengeDays;
  const actualProgress = targetPaces.totalProgress;
  const progressEfficiency = expectedProgressByNow > 0 ? (actualProgress / expectedProgressByNow) * 100 : 0;
  
  // Team performance metrics
  const avgKmPerUser = actualProgress / users.length;
  const totalActivities = users.reduce((sum, user) => sum + user.activities.length, 0);
  const avgActivitiesPerUser = totalActivities / users.length;
  
  // Daily and weekly averages
  const actualDailyAverage = daysSinceStart > 0 ? actualProgress / daysSinceStart : 0;
  const actualWeeklyAverage = actualDailyAverage * 7;
  
  return (
    <div className="space-y-6">
      {/* Main Progress Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <ProgressCard
          icon={<Trophy className="w-6 h-6" />}
          title="Matkan edistyminen"
          value={`${Math.round(targetPaces.totalProgress).toLocaleString("fi-FI")} km`}
          subtitle={`${Math.round((actualProgress / challengeParams.totalDistance) * 100)}% valmis`}
          detail={`Tavoite: ${challengeParams.totalDistance.toLocaleString("fi-FI")} km`}
          colors={colors}
          status="progress"
        />

        <ProgressCard
          icon={<Calendar className="w-6 h-6" />}
          title="Aikataulun edistyminen"
          value={`${daysSinceStart} / ${totalChallengeDays}`}
          subtitle={`${Math.round((daysSinceStart / totalChallengeDays) * 100)}% ajasta kulunut`}
          detail={`${daysRemaining} päivää jäljellä`}
          colors={colors}
          status="time"
        />

        <ProgressCard
          icon={<Target className="w-6 h-6" />}
          title="Tehokkuus"
          value={`${Math.round(progressEfficiency)}%`}
          subtitle={progressEfficiency >= 100 ? "Etuajassa!" : "Tavoitteesta jäljessä"}
          detail={`${Math.round(Math.abs(actualProgress - expectedProgressByNow))} km ${progressEfficiency >= 100 ? 'yli' : 'alle'} tavoitteen`}
          colors={colors}
          status={progressEfficiency >= 100 ? "ahead" : "behind"}
        />
      </div>

      {/* Team Performance Metrics */}
      <div 
        className="p-6 rounded-xl shadow-sm"
        style={{ backgroundColor: colors.card }}
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center" style={{ color: colors.text }}>
          <Users className="w-6 h-6 mr-2" style={{ color: colors.accent }} />
          Tiimin suorituskyky
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={<Users className="w-5 h-5" />}
            value={users.length}
            label="Aktiivista pyöräilijää"
            colors={colors}
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5" />}
            value={`${Math.round(avgKmPerUser)} km`}
            label="Keskiarvo / hlö"
            colors={colors}
          />
          <MetricCard
            icon={<Zap className="w-5 h-5" />}
            value={totalActivities}
            label="Yhteensä suorituksia"
            colors={colors}
          />
          <MetricCard
            icon={<Flag className="w-5 h-5" />}
            value={`${Math.round(avgActivitiesPerUser)}`}
            label="Suorituksia / hlö"
            colors={colors}
          />
        </div>
      </div>

      {/* Pace Analysis */}
      <div 
        className="p-6 rounded-xl shadow-sm"
        style={{ backgroundColor: colors.card }}
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center" style={{ color: colors.text }}>
          <Clock className="w-6 h-6 mr-2" style={{ color: colors.accent }} />
          Vauhtianalyysi
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3" style={{ color: colors.text }}>Nykyinen vauhti</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: colors.mutedText }}>Päivittäin:</span>
                <span className="font-bold" style={{ color: colors.text }}>
                  {Math.round(actualDailyAverage)} km
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.mutedText }}>Viikottain:</span>
                <span className="font-bold" style={{ color: colors.text }}>
                  {Math.round(actualWeeklyAverage)} km
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.mutedText }}>Per hlö/viikko:</span>
                <span className="font-bold" style={{ color: colors.text }}>
                  {Math.round(actualWeeklyAverage / users.length)} km
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3" style={{ color: colors.text }}>Vaadittu vauhti</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: colors.mutedText }}>Päivittäin:</span>
                <span className="font-bold" style={{ color: colors.text }}>
                  {challengeParams.dailyTarget} km
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.mutedText }}>Viikottain:</span>
                <span className="font-bold" style={{ color: colors.text }}>
                  {Math.round(challengeParams.weeklyTarget)} km
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: colors.mutedText }}>Per hlö/viikko:</span>
                <span className="font-bold" style={{ color: colors.text }}>
                  {Math.round(targetPaces.weeklyPerUser)} km
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pace comparison */}
        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ 
            backgroundColor: actualWeeklyAverage >= challengeParams.weeklyTarget ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${actualWeeklyAverage >= challengeParams.weeklyTarget ? '#16a34a' : '#dc2626'}`
          }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: actualWeeklyAverage >= challengeParams.weeklyTarget ? '#16a34a' : '#dc2626' }}>
              {actualWeeklyAverage >= challengeParams.weeklyTarget ? '🚀' : '⚠️'}
            </span>
            <div>
              <p 
                className="font-semibold"
                style={{ color: actualWeeklyAverage >= challengeParams.weeklyTarget ? '#16a34a' : '#dc2626' }}
              >
                {actualWeeklyAverage >= challengeParams.weeklyTarget 
                  ? 'Tiimi on tavoitevauhdissa tai sitä nopeampi!'
                  : 'Tiimi tarvitsee vauhtia lisää'
                }
              </p>
              <p 
                className="text-sm"
                style={{ color: colors.text }}
              >
                Ero tavoitteeseen: {Math.round(Math.abs(actualWeeklyAverage - challengeParams.weeklyTarget))} km/viikko
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Timeline */}
      <div 
        className="p-6 rounded-xl shadow-sm"
        style={{ backgroundColor: colors.card }}
      >
        <h3 className="text-xl font-semibold mb-6 flex items-center" style={{ color: colors.text }}>
          <Calendar className="w-6 h-6 mr-2" style={{ color: colors.accent }} />
          Haasteen aikajana
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: colors.text }}>Haaste alkoi</div>
              <div className="text-sm" style={{ color: colors.mutedText }}>
                {format(challengeStartDate, 'd.M.yyyy')} ({daysSinceStart} päivää sitten)
              </div>
            </div>
            <div className="text-2xl">🏁</div>
          </div>
          
          <div 
            className="h-2 rounded-full overflow-hidden mx-4"
            style={{ backgroundColor: colors.border }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(100, (daysSinceStart / totalChallengeDays) * 100)}%`,
                backgroundColor: colors.accent,
              }}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium" style={{ color: colors.text }}>Haaste päättyy</div>
              <div className="text-sm" style={{ color: colors.mutedText }}>
                {format(challengeEndDate, 'd.M.yyyy')} ({daysRemaining} päivää jäljellä)
              </div>
            </div>
            <div className="text-2xl">🏆</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressCard({
  icon,
  title,
  value,
  subtitle,
  detail,
  colors,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  detail: string;
  colors: ThemeColors;
  status: 'progress' | 'time' | 'ahead' | 'behind';
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'ahead': return '#16a34a';
      case 'behind': return '#dc2626';
      case 'progress': return colors.accent;
      case 'time': return colors.primary;
      default: return colors.accent;
    }
  };

  return (
    <div 
      className="p-6 rounded-xl shadow-sm border transition-transform hover:scale-105"
      style={{ 
        backgroundColor: colors.card,
        borderColor: colors.border 
      }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div style={{ color: getStatusColor() }}>
          {icon}
        </div>
        <h3 className="font-semibold" style={{ color: colors.text }}>
          {title}
        </h3>
      </div>
      
      <div className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
        {value}
      </div>
      
      <div className="text-sm mb-1" style={{ color: getStatusColor() }}>
        {subtitle}
      </div>
      
      <div className="text-xs" style={{ color: colors.mutedText }}>
        {detail}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  value,
  label,
  colors,
}: {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  colors: ThemeColors;
}) {
  return (
    <div
      className="p-4 rounded-lg text-center transition-transform hover:scale-105"
      style={{ backgroundColor: colors.secondary }}
    >
      <div className="mb-2 flex justify-center" style={{ color: colors.accent }}>
        {icon}
      </div>
      <div className="text-xl font-bold" style={{ color: colors.text }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: colors.mutedText }}>
        {label}
      </div>
    </div>
  );
}