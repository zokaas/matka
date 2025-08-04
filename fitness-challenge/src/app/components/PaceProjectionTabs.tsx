import React, { useState } from 'react';
import { format, parseISO, differenceInDays } from 'date-fns';
import {
  TrendingUp,
  Calendar,
  Clock,
  History,
  BarChart2,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  CheckCircle,
  Target,
} from 'lucide-react';
import { useTheme } from '@/app/hooks/useTheme';
import { challengeParams } from '@/app/constants/challengeParams';

interface ProjectionEntry {
  estimatedEndDate: string | null;
  daysFromTarget: number | null;
}

interface Projections {
  historical: ProjectionEntry;
  recent: ProjectionEntry;
  weekly: ProjectionEntry;
}

interface PaceProjectionTabsProps {
  historicalPace: number;
  recentPace: number;
  weeklyPace: number;
  targetDate: Date;
  remainingDistance: number;
  participantCount: number;
  projections: Projections;
}

const PaceProjectionTabs: React.FC<PaceProjectionTabsProps> = ({
  historicalPace = 0,
  recentPace = 0,
  weeklyPace = 0,
  targetDate,
  remainingDistance = 0,
  participantCount = 1,
  projections,
}) => {
  const { t, colors } = useTheme();
  const [activeTab, setActiveTab] = useState('historical');

  // Enhanced calculations using challengeParams
  const challengeStartDate = new Date(challengeParams.startDate);
  const challengeEndDate = new Date(challengeParams.endDate);
  const totalChallengeDays = challengeParams.totalDays;
  const dailyTargetDistance = challengeParams.dailyTarget;
  const weeklyTargetDistance = challengeParams.weeklyTarget;
  
  const daysSinceStart = Math.max(0, differenceInDays(new Date(), challengeStartDate));
  const daysRemaining = Math.max(0, differenceInDays(challengeEndDate, new Date()));
  const weeksRemaining = Math.max(1, Math.ceil(daysRemaining / 7));
  
  // Calculate required pace based on challengeParams
  const requiredWeeklyPaceTotal = remainingDistance / weeksRemaining;
  const requiredWeeklyPacePerUser = requiredWeeklyPaceTotal / participantCount;

  const parseDate = (date: string | Date | null): Date | null => {
    if (!date) return null;
    if (date instanceof Date) return date;
    
    try {
      return parseISO(date);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  };

  const getProjectionStatus = (pace: number, required: number) => {
    // Don't evaluate pace as "too slow" if challenge just started (less than 7 days)
    if (daysSinceStart < 7) {
      return { status: 'early', icon: <Clock className="w-4 h-4" />, color: colors.mutedText };
    }
    
    const ratio = pace / required;
    if (ratio >= 1.1) return { status: 'excellent', icon: <CheckCircle className="w-4 h-4" />, color: '#16a34a' };
    if (ratio >= 0.9) return { status: 'good', icon: <Target className="w-4 h-4" />, color: colors.accent };
    return { status: 'behind', icon: <AlertTriangle className="w-4 h-4" />, color: '#dc2626' };
  };
  
  const projectionEntries = {
    historical: {
      label: t.paceProjection.fullHistoryLabel,
      description: daysSinceStart < 7 
        ? `Haaste on juuri alkanut (${daysSinceStart} päivää sitten). Liian aikaista arvioida pitkän aikavälin vauhtia.`
        : `${t.paceProjection.fullHistoryDesc} (${daysSinceStart} päivän ajalta)`,
      pacePerUser: Math.round(historicalPace),
      estimatedEndDate: parseDate(projections.historical.estimatedEndDate),
      daysFromTarget: projections.historical.daysFromTarget ?? 0,
      icon: <History className="w-5 h-5" />,
      status: getProjectionStatus(historicalPace, requiredWeeklyPacePerUser),
    },
    recent: {
      label: t.paceProjection.recentLabel,
      description: daysSinceStart < 28 
        ? `Haaste on alkanut vasta ${daysSinceStart} päivää sitten. Tarvitaan enemmän dataa luotettavaan arvioon.`
        : `${t.paceProjection.recentDesc} (28 päivän ajalta)`,
      pacePerUser: Math.round(recentPace),
      estimatedEndDate: parseDate(projections.recent.estimatedEndDate),
      daysFromTarget: projections.recent.daysFromTarget ?? 0,
      icon: <Clock className="w-5 h-5" />,
      status: getProjectionStatus(recentPace, requiredWeeklyPacePerUser),
    },
    weekly: {
      label: t.paceProjection.weeklyLabel,
      description: daysSinceStart < 7 
        ? `Haaste on alkanut vasta ${daysSinceStart} päivää sitten. Viikon analyysi ei ole vielä luotettava.`
        : `${t.paceProjection.weeklyDesc} (7 päivän ajalta)`,
      pacePerUser: Math.round(weeklyPace),
      estimatedEndDate: parseDate(projections.weekly.estimatedEndDate),
      daysFromTarget: projections.weekly.daysFromTarget ?? 0,
      icon: <BarChart2 className="w-5 h-5" />,
      status: getProjectionStatus(weeklyPace, requiredWeeklyPacePerUser),
    },
    required: {
      label: t.paceProjection.requiredLabel,
      description: `${t.paceProjection.requiredDesc} (${weeksRemaining} viikkoa jäljellä)`,
      pacePerUser: Math.ceil(requiredWeeklyPacePerUser),
      estimatedEndDate: challengeEndDate,
      daysFromTarget: 0,
      icon: <Calendar className="w-5 h-5" />,
      status: { status: 'target', icon: <Target className="w-4 h-4" />, color: colors.primary },
    },
  };

  const projectionsArray = Object.entries(projectionEntries);
  const activeProjection = projectionEntries[activeTab as keyof typeof projectionEntries];
  const activeIndex = projectionsArray.findIndex(([key]) => key === activeTab);

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % projectionsArray.length;
    setActiveTab(projectionsArray[nextIndex][0]);
  };

  const goToPrevious = () => {
    const prevIndex = (activeIndex - 1 + projectionsArray.length) % projectionsArray.length;
    setActiveTab(projectionsArray[prevIndex][0]);
  };

  const daysFromTargetText =
    activeProjection.daysFromTarget === 0
      ? t.paceProjection.exactly
      : activeProjection.daysFromTarget > 0
      ? `+${activeProjection.daysFromTarget} ${t.paceProjection.daysLate}`
      : `${activeProjection.daysFromTarget} ${t.paceProjection.daysEarly}`;

  return (
    <div 
      className="rounded-lg shadow-md p-6 mb-6"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center" style={{ color: colors.text }}>
          <TrendingUp className="w-6 h-6 mr-2" style={{ color: colors.accent }} />
          {t.paceProjection.title}
        </h3>
        <div className="text-sm" style={{ color: colors.mutedText }}>
          Tavoite: {Math.round(requiredWeeklyPacePerUser)} km/hlö/viikko
        </div>
      </div>

      {/* Tabs (desktop) */}
      <div className="hidden md:flex border-b mb-6" style={{ borderColor: colors.border }}>
        {projectionsArray.map(([key, projection]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === key ? '' : 'hover:opacity-80'
            }`}
            style={{
              color: activeTab === key ? colors.primary : colors.mutedText,
              borderColor: activeTab === key ? colors.primary : 'transparent',
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: projection.status.color }}>
                {projection.status.icon}
              </span>
              {projection.icon}
              <span>{projection.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile carousel-style */}
      <div className="md:hidden mb-6 flex items-center justify-between border-b pb-3" style={{ borderColor: colors.border }}>
        <button 
          onClick={goToPrevious} 
          className="rounded-full p-2 transition-colors hover:opacity-80"
          style={{ backgroundColor: colors.secondary, color: colors.text }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-3" style={{ color: colors.text }}>
          <span style={{ color: activeProjection.status.color }}>
            {activeProjection.status.icon}
          </span>
          {activeProjection.icon}
          <span className="font-medium">{activeProjection.label}</span>
        </div>
        <button 
          onClick={goToNext} 
          className="rounded-full p-2 transition-colors hover:opacity-80"
          style={{ backgroundColor: colors.secondary, color: colors.text }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Status indicator */}
      <div 
        className="p-4 rounded-lg mb-6"
        style={{
          backgroundColor: activeProjection.status.status === 'excellent' ? '#f0fdf4' : 
                            activeProjection.status.status === 'behind' ? '#fef2f2' : colors.secondary,
          border: `1px solid ${activeProjection.status.color}`,
        }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: activeProjection.status.color }}>
            {activeProjection.status.icon}
          </span>
          <div>
            <p className="font-medium" style={{ color: activeProjection.status.color }}>
              {activeProjection.status.status === 'excellent' ? 'Erinomainen vauhti!' :
               activeProjection.status.status === 'good' ? 'Hyvä vauhti' :
               activeProjection.status.status === 'behind' ? 'Vauhti liian hidas' : 'Tavoitevauhti'}
            </p>
            <p className="text-sm" style={{ color: colors.text }}>
              {activeProjection.description}
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.secondary, borderColor: colors.border }}
        >
          <div className="text-sm font-medium mb-2" style={{ color: colors.mutedText }}>
            {t.paceProjection.pacePerPerson}
          </div>
          <div className="text-2xl font-bold" style={{ color: colors.text }}>
            {activeProjection.pacePerUser}
          </div>
          <div className="text-sm" style={{ color: colors.mutedText }}>
            {t.paceProjection.kmPerWeek}
          </div>
          {activeTab !== 'required' && (
            <div className="mt-2 text-xs" style={{ color: colors.mutedText }}>
              vs. vaadittu {Math.round(requiredWeeklyPacePerUser)} km/vko
            </div>
          )}
        </div>

        <div 
          className="p-4 rounded-lg border"
          style={{ backgroundColor: colors.secondary, borderColor: colors.border }}
        >
          <div className="text-sm font-medium mb-2" style={{ color: colors.mutedText }}>
            {t.paceProjection.estimatedCompletion}
          </div>
          <div className="text-2xl font-bold" style={{ color: colors.text }}>
            {activeProjection.estimatedEndDate 
              ? format(activeProjection.estimatedEndDate, 'd.M.yyyy')
              : t.paceProjection.noData}
          </div>
          <div className="text-sm" style={{ color: colors.mutedText }}>
            Tavoite: {format(challengeEndDate, 'd.M.yyyy')}
          </div>
        </div>

        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: activeProjection.daysFromTarget > 0 ? '#fef2f2' : 
                            activeProjection.daysFromTarget < 0 ? '#f0fdf4' : colors.secondary,
            borderColor: activeProjection.daysFromTarget > 0 ? '#dc2626' : 
                         activeProjection.daysFromTarget < 0 ? '#16a34a' : colors.border,
          }}
        >
          <div
            className="text-sm font-medium mb-2"
            style={{
              color: activeProjection.daysFromTarget > 0 ? '#dc2626' : 
                     activeProjection.daysFromTarget < 0 ? '#16a34a' : colors.mutedText
            }}
          >
            {t.paceProjection.differenceFromTarget}
          </div>
          <div
            className="text-2xl font-bold"
            style={{
              color: activeProjection.daysFromTarget > 0 ? '#dc2626' : 
                     activeProjection.daysFromTarget < 0 ? '#16a34a' : colors.text
            }}
          >
            {daysFromTargetText}
          </div>
          <div className="text-sm mt-2" style={{ color: colors.mutedText }}>
            {activeProjection.daysFromTarget > 0 ? '🐌 Hidastaminen tarvitaan' :
             activeProjection.daysFromTarget < 0 ? '🚀 Etuajassa!' : '🎯 Täsmälleen aikataulussa'}
          </div>
        </div>
      </div>

      {/* Challenge Context */}
      <div 
        className="mt-6 p-4 rounded-lg border"
        style={{ backgroundColor: colors.secondary, borderColor: colors.border }}
      >
        <h4 className="font-semibold mb-3 flex items-center" style={{ color: colors.text }}>
          <Target className="w-4 h-4 mr-2" style={{ color: colors.accent }} />
          Haasteen konteksti
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div style={{ color: colors.mutedText }}>Kokonaismatka</div>
            <div className="font-bold" style={{ color: colors.text }}>
              {challengeParams.totalDistance.toLocaleString('fi-FI')} km
            </div>
          </div>
          <div>
            <div style={{ color: colors.mutedText }}>Haasteen kesto</div>
            <div className="font-bold" style={{ color: colors.text }}>
              {totalChallengeDays} päivää
            </div>
          </div>
          <div>
            <div style={{ color: colors.mutedText }}>Päivätavoite</div>
            <div className="font-bold" style={{ color: colors.text }}>
              {dailyTargetDistance} km
            </div>
          </div>
          <div>
            <div style={{ color: colors.mutedText }}>Viikkotavoite</div>
            <div className="font-bold" style={{ color: colors.text }}>
              {Math.round(weeklyTargetDistance)} km
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation based on current projection */}
      {activeTab !== 'required' && (
        <div 
          className="mt-4 p-4 rounded-lg"
          style={{
            backgroundColor: activeProjection.status.status === 'behind' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${activeProjection.status.color}`,
          }}
        >
          <h4 
            className="font-semibold mb-2 flex items-center"
            style={{ color: activeProjection.status.color }}
          >
            {activeProjection.status.icon}
            <span className="ml-2">Suositus</span>
          </h4>
          <p className="text-sm" style={{ color: colors.text }}>
            {activeProjection.status.status === 'behind' 
              ? `Vauhti on liian hidas tavoitteen saavuttamiseksi. Tarvitaan ${Math.round(requiredWeeklyPacePerUser - activeProjection.pacePerUser)} km/hlö/viikko lisää.`
              : activeProjection.status.status === 'excellent'
              ? `Loistava vauhti! Jatkakaa samaan malliin niin saavutatte tavoitteen etuajassa.`
              : activeProjection.status.status === 'early'
              ? `Haaste on vasta alkanut. Tarvitaan enemmän dataa luotettavaan vauhtiarvioon. Jatkakaa hyvää työtä!`
              : `Hyvä vauhti! Pysykää tässä tahdissa niin saavutatte tavoitteen ajallaan.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default PaceProjectionTabs;