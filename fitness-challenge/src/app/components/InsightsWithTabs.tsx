import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Trophy,
  TrendingUp,
  Target,
  Calendar,
  Activity,
  Clock,
  Award,
  BarChart3,
  Users,
  Zap,
} from "lucide-react";
import { challengeParams } from "../constants/challengeParams";
import { format, differenceInDays } from "date-fns";
// Removed react-calendar-heatmap dependency
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend,
} from 'recharts';
import { fi } from 'date-fns/locale';


interface User {
  username: string;
  totalKm: number;
  profilePicture?: string;
  activities: Array<{
    id: number;
    activity: string;
    duration: number;
    date: string;
    kilometers: number;
    bonus?: string;
  }>;
}

interface TeamAnalytics {
  totalProgress: number;
  totalActivities: number;
  avgKmPerUser: number;
  activeUsers: number;
  completionPercentage: number;
  daysRemaining: number;
  daysSinceStart: number;
  dailyAverage: number;
  weeklyAverage: number;
  progressStatus: 'ahead' | 'onTrack' | 'behind';
  expectedProgress: number;
  progressDifference: number;
  projectedFinishDate: Date | null;
  daysFromTarget: number;
  requiredDailyPace: number;
  paceEfficiency: number;
  momentum: 'accelerating' | 'steady' | 'slowing';
  lastWeekKm: number;
  previousWeekKm: number;
  weekDelta: number;
}

interface AllTimeStats {
  username: string;
  profilePicture?: string;
  totalKm: number;
  completionPercentage: number;
  dailyAverage: number;
  activeDays: number;
  streak: number;
  totalActivities: number;
  lastActivity: string;
  activityDates: string[];
}

interface RecordData {
  bestKmDay: { username: string; kilometers: number; date: string } | null;
  longestWorkout: { username: string; duration: number; activity: string; date: string } | null;
  longestStreaks: { username: string; streakLength: number; startDate: string; endDate: string }[];
  topSports: Array<{ name: string; count: number; totalKm: number }>;
  teamRecords: {
    bestTeamDay: { date: string; totalKm: number };
    mostActiveDay: { date: string; activities: number };
  };
}

interface CumulativeProgressData {
  date: string;
  actual: number;
  expected: number;
}

// Helper function to get km in a specific period
const getKmInPeriod = (activities: any[], startOffset: number, endOffset: number) => {
  const today = new Date();
  return activities.filter(a => {
    const diff = Math.floor((today.getTime() - new Date(a.date).getTime()) / (1000 * 60 * 60 * 24));
    return diff >= startOffset && diff < endOffset;
  }).reduce((sum, a) => sum + a.kilometers, 0);
};

const EnhancedTeamInsights = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'analytics' | 'performance' | 'records' | 'goals' | 'predictions'>('analytics');
  const [cumulativeProgressData, setCumulativeProgressData] = useState<CumulativeProgressData[]>([]);

  const [analytics, setAnalytics] = useState<TeamAnalytics>({
    totalProgress: 0,
    totalActivities: 0,
    avgKmPerUser: 0,
    activeUsers: 0,
    completionPercentage: 0,
    daysRemaining: 0,
    daysSinceStart: 0,
    dailyAverage: 0,
    weeklyAverage: 0,
    progressStatus: 'onTrack',
    expectedProgress: 0,
    progressDifference: 0,
    projectedFinishDate: null,
    daysFromTarget: 0,
    requiredDailyPace: 0,
    paceEfficiency: 0,
    momentum: 'steady',
    lastWeekKm: 0,
    previousWeekKm: 0,
    weekDelta: 0
  });

  const [allTimeStats, setAllTimeStats] = useState<AllTimeStats[]>([]);
  const [records, setRecords] = useState<RecordData>({
    bestKmDay: null,
    longestWorkout: null,
    longestStreaks: [],
    topSports: [],
    teamRecords: {
      bestTeamDay: { date: '', totalKm: 0 },
      mostActiveDay: { date: '', activities: 0 }
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`);
        const userData: User[] = await response.json();

        calculateAnalytics(userData);
        setAllTimeStats(calculateAllTimeStats(userData));
        calculateRecords(userData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

const calculateAnalytics = (userData: User[]) => {
  const today = new Date();
  const startDate = new Date(challengeParams.startDate);
  const endDate = new Date(challengeParams.endDate);

  // Filter activities within challenge period
  const challengeActivities = userData.flatMap(user =>
    user.activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= startDate && activityDate <= endDate;
    })
  );

  const totalProgress = challengeActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
  const totalActivities = challengeActivities.length;
  const avgKmPerUser = userData.length > 0 ? totalProgress / userData.length : 0;
  const completionPercentage = Math.min(100, (totalProgress / challengeParams.totalDistance) * 100);

  // FIXED: Use consistent calculation for daysSinceStart
  const daysSinceStart = Math.max(0, differenceInDays(today, startDate));
  const daysRemaining = Math.max(0, differenceInDays(endDate, today));

  const dailyAverage = totalProgress / Math.max(1, daysSinceStart);
  const weeklyAverage = dailyAverage * 7;

  // FIXED: Use the same calculation method that will be used in chart
  const expectedProgress = (challengeParams.totalDistance * daysSinceStart) / challengeParams.totalDays;

  const progressDifference = Math.abs(totalProgress - expectedProgress);
  const progressStatus = totalProgress >= expectedProgress * 1.05 ? 'ahead' :
    totalProgress >= expectedProgress * 0.95 ? 'onTrack' : 'behind';

  // Calculate weekly comparison
  const lastWeekKm = getKmInPeriod(challengeActivities, 0, 7);
  const previousWeekKm = getKmInPeriod(challengeActivities, 7, 14);
  const weekDelta = lastWeekKm - previousWeekKm;

  // Calculate projected finish date
  let projectedFinishDate = null;
  let daysFromTarget = 0;
  if (dailyAverage > 0) {
    const remainingKm = challengeParams.totalDistance - totalProgress;
    const daysNeeded = remainingKm / dailyAverage;
    projectedFinishDate = new Date(today.getTime() + daysNeeded * 24 * 60 * 60 * 1000);
    daysFromTarget = Math.ceil((projectedFinishDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  const requiredDailyPace = daysRemaining > 0 ? (challengeParams.totalDistance - totalProgress) / daysRemaining : 0;
  const paceEfficiency = requiredDailyPace > 0 ? (dailyAverage / requiredDailyPace) * 100 : 0;

  // Calculate momentum (comparing last 7 days vs previous 7 days)
  const last7Days = challengeActivities.filter(a =>
    differenceInDays(today, new Date(a.date)) <= 7
  ).reduce((sum, a) => sum + a.kilometers, 0);

  const previous7Days = challengeActivities.filter(a => {
    const daysDiff = differenceInDays(today, new Date(a.date));
    return daysDiff > 7 && daysDiff <= 14;
  }).reduce((sum, a) => sum + a.kilometers, 0);

  const momentum = last7Days > previous7Days * 1.1 ? 'accelerating' :
    last7Days < previous7Days * 0.9 ? 'slowing' : 'steady';

  // Create cumulative progress data for chart
  const teamDailyTotals: Record<string, { totalKm: number; activities: number }> = {};
  challengeActivities.forEach(activity => {
    const dateKey = activity.date.split('T')[0];
    if (!teamDailyTotals[dateKey]) {
      teamDailyTotals[dateKey] = { totalKm: 0, activities: 0 };
    }
    teamDailyTotals[dateKey].totalKm += activity.kilometers;
    teamDailyTotals[dateKey].activities += 1;
  });

  // FIXED: Use the same calculation method for chart data
  const cumulativeProgressData = Object.entries(teamDailyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce((acc: CumulativeProgressData[], [date, { totalKm }]) => {
      const previous = acc.length > 0 ? acc[acc.length - 1].actual : 0;
      
      // Use exactly the same calculation as above
      const daysSinceStartForThisDate = Math.max(0, differenceInDays(new Date(date), startDate));
      const expected = (challengeParams.totalDistance * daysSinceStartForThisDate) / challengeParams.totalDays;
      
      acc.push({ 
        date, 
        actual: previous + totalKm, 
        expected 
      });
      return acc;
    }, []);

  console.table(cumulativeProgressData);
  setCumulativeProgressData(cumulativeProgressData);

  setAnalytics({
    totalProgress,
    totalActivities,
    avgKmPerUser,
    activeUsers: userData.length,
    completionPercentage,
    daysRemaining,
    daysSinceStart,
    dailyAverage,
    weeklyAverage,
    progressStatus,
    expectedProgress,
    progressDifference,
    projectedFinishDate,
    daysFromTarget,
    requiredDailyPace,
    paceEfficiency,
    momentum,
    lastWeekKm,
    previousWeekKm,
    weekDelta
  });
};

  const calculateAllTimeStats = (userData: User[]) => {
    const today = new Date();
    const startDate = new Date(challengeParams.startDate);
    const endDate = new Date(challengeParams.endDate);

    // Individual target is total challenge divided by team size
    const individualTarget = challengeParams.totalDistance / userData.length;

    const stats = userData.map(user => {
      // Filter activities within challenge period
      const challengeActivities = user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= endDate;
      });

      // Calculate total km
      const totalKm = challengeActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
      
      // Calculate completion percentage against individual target
      const completionPercentage = Math.min(200, (totalKm / individualTarget) * 100);
      
      // Calculate days since challenge started
      const daysSinceStart = Math.max(1, differenceInDays(today, startDate));
      const dailyAverage = totalKm / daysSinceStart;
      
      // Calculate unique active days
      const uniqueDays = new Set(challengeActivities.map(a => a.date.split('T')[0]));
      const activeDays = uniqueDays.size;
      
      // Calculate current streak
      let streak = 0;
      const sortedDates = [...uniqueDays].sort().reverse();
      
      for (let i = 0; i < sortedDates.length; i++) {
        const date = new Date(sortedDates[i]);
        const daysDiff = differenceInDays(today, date);
        
        if (daysDiff === i || (i === 0 && daysDiff <= 1)) {
          streak++;
        } else {
          break;
        }
      }

      const totalActivities = challengeActivities.length;
      const lastActivity = challengeActivities.length > 0 ?
        challengeActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date : '';

      return {
        username: user.username,
        profilePicture: user.profilePicture,
        totalKm,
        completionPercentage,
        dailyAverage,
        activeDays,
        streak,
        totalActivities,
        lastActivity,
        activityDates: challengeActivities.map(a => a.date.split('T')[0]),
      };
    }).sort((a, b) => b.totalKm - a.totalKm); // Sort by total km descending

    return stats;
  };

  const calculateRecords = (userData: User[]) => {
    const startDate = new Date(challengeParams.startDate);
    const endDate = new Date(challengeParams.endDate);

    let bestKmDay: { username: string; kilometers: number; date: string } | null = null;
    let longestWorkout: { username: string; duration: number; activity: string; date: string } | null = null;

    const longestStreaks: { username: string; streakLength: number; startDate: string; endDate: string }[] = [];

    const sportCounts: Record<string, { count: number; totalKm: number }> = {};
    const teamDailyTotals: Record<string, { totalKm: number; activities: number }> = {};

    userData.forEach(user => {
      const challengeActivities = user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= startDate && activityDate <= endDate;
      });

      // Track team daily totals
      challengeActivities.forEach(activity => {
        const dateKey = activity.date.split('T')[0];
        if (!teamDailyTotals[dateKey]) {
          teamDailyTotals[dateKey] = { totalKm: 0, activities: 0 };
        }
        teamDailyTotals[dateKey].totalKm += activity.kilometers;
        teamDailyTotals[dateKey].activities += 1;
      });

      // Calculate daily totals for user
      const dailyTotals: Record<string, number> = {};
      challengeActivities.forEach(activity => {
        const dateKey = activity.date.split('T')[0];
        dailyTotals[dateKey] = (dailyTotals[dateKey] || 0) + activity.kilometers;
      });

      // Find user's best day
      const userBestDay = Object.entries(dailyTotals).reduce((best, [date, km]) => {
        return km > (best?.kilometers || 0) ? { date, kilometers: km } : best;
      }, null as { date: string; kilometers: number } | null);

      if (userBestDay && (!bestKmDay || userBestDay.kilometers > bestKmDay.kilometers)) {
        bestKmDay = { username: user.username, ...userBestDay };
      }

      // Find longest workout
      const userLongest = challengeActivities.reduce((longest, activity) => {
        return activity.duration > (longest?.duration || 0) ? activity : longest;
      }, null as typeof challengeActivities[0] | null);

      if (userLongest && (!longestWorkout || userLongest.duration > longestWorkout.duration)) {
        longestWorkout = {
          username: user.username,
          duration: userLongest.duration,
          activity: userLongest.activity,
          date: userLongest.date
        };
      }

      // Calculate longest streak for this user
      const activeDates = Object.keys(dailyTotals).sort();
      let currentStreak = 0;
      let maxStreak = 0;
      let streakStart = '';
      let maxStreakStart = '';
      let maxStreakEnd = '';

      for (let i = 0; i < activeDates.length; i++) {
        const currentDate = new Date(activeDates[i]);

        if (i === 0) {
          currentStreak = 1;
          streakStart = activeDates[i];
        } else {
          const prevDate = new Date(activeDates[i - 1]);
          const dayDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

          if (dayDiff === 1) {
            // Consecutive day
            currentStreak++;
          } else {
            // Streak broken, check if it was the longest
            if (currentStreak > maxStreak) {
              maxStreak = currentStreak;
              maxStreakStart = streakStart;
              maxStreakEnd = activeDates[i - 1];
            }
            // Start new streak
            currentStreak = 1;
            streakStart = activeDates[i];
          }
        }

        // Check at the end of loop
        if (i === activeDates.length - 1 && currentStreak > maxStreak) {
          maxStreak = currentStreak;
          maxStreakStart = streakStart;
          maxStreakEnd = activeDates[i];
        }
      }

      if (maxStreak > 0) {
        longestStreaks.push({
          username: user.username,
          streakLength: maxStreak,
          startDate: maxStreakStart,
          endDate: maxStreakEnd
        });
      }

      // Count sports
      challengeActivities.forEach(activity => {
        if (!sportCounts[activity.activity]) {
          sportCounts[activity.activity] = { count: 0, totalKm: 0 };
        }
        sportCounts[activity.activity].count += 1;
        sportCounts[activity.activity].totalKm += activity.kilometers;
      });
    });

    // Find the longest streak(s) across all users
    const maxStreakLength = Math.max(...longestStreaks.map(s => s.streakLength), 0);
    const topStreaks = longestStreaks.filter(s => s.streakLength === maxStreakLength);

    const topSports = Object.entries(sportCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));

    // Find best team days
    const bestTeamDay = Object.entries(teamDailyTotals).reduce((best, [date, data]) => {
      return data.totalKm > best.totalKm ? { date, totalKm: data.totalKm } : best;
    }, { date: '', totalKm: 0 });

    const mostActiveDay = Object.entries(teamDailyTotals).reduce((best, [date, data]) => {
      return data.activities > best.activities ? { date, activities: data.activities } : best;
    }, { date: '', activities: 0 });

    setRecords({
      bestKmDay,
      longestWorkout,
      longestStreaks: topStreaks,
      topSports,
      teamRecords: {
        bestTeamDay,
        mostActiveDay
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-spin h-12 w-12 border-4 border-yellow-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  const sections = [
    { key: 'analytics', label: 'Analyysi', icon: BarChart3 },
    { key: 'performance', label: 'Kisa', icon: TrendingUp },
    { key: 'records', label: 'Ennätykset', icon: Trophy },
  ] as const;

  // Individual target calculation
  const individualTarget = challengeParams.totalDistance / analytics.activeUsers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
      <div className="max-w-6xl mx-auto px-3 py-4 space-y-6">
        {/* Mobile-Optimized Section Navigation */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-yellow-200 inline-flex flex-wrap">
            {sections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${activeSection === key
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeSection === 'analytics' && (
            <div className="space-y-4">
              {/* Mobile-Optimized Quick Status */}
              <div className={`p-4 rounded-xl border-2 ${
                analytics.progressStatus === 'ahead' ? 'bg-green-50 border-green-300' :
                analytics.progressStatus === 'behind' ? 'bg-red-50 border-red-300' :
                'bg-blue-50 border-blue-300'
              }`}>
                <div className="text-center">
                  <div className="text-3xl mb-2">
                    {analytics.progressStatus === 'ahead' ? '🚀' :
                      analytics.progressStatus === 'behind' ? '⚠️' : '🎯'}
                  </div>
                  <div className="font-bold text-lg mb-2">
                    {analytics.progressStatus === 'ahead' ? 'Etuajassa!' :
                      analytics.progressStatus === 'behind' ? 'Jäljessä tavoitteesta' :
                        'Aikataulussa'}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Suoritettu: <span className="font-semibold">{Math.round(analytics.totalProgress).toLocaleString('fi-FI')} km</span></div>
                    <div>Pitäisi olla: <span className="font-semibold">{Math.round(analytics.expectedProgress).toLocaleString('fi-FI')} km</span></div>
                    <div className="font-medium mt-2 text-base">
                      {analytics.progressStatus === 'ahead'
                        ? `→ ${Math.round(analytics.progressDifference)} km etuajassa`
                        : analytics.progressStatus === 'behind'
                          ? `→ ${Math.round(analytics.progressDifference)} km jäljessä`
                          : '→ Täsmälleen aikataulussa'
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Expected vs Actual Progress Chart */}
              <AnalyticsCard title="Edistyminen vs. odotus">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={cumulativeProgressData}>
<XAxis 
  dataKey="date" 
  tickFormatter={(value) => format(new Date(value), 'd.M.', { locale: fi })}
  angle={-30}
  textAnchor="end"
  height={40}
/>

<YAxis
  width={40}
  tickCount={4} // or 5 depending on your range
  tickFormatter={(value) => `${Math.round(value)} km`}
/>

<Tooltip
  labelFormatter={(value) => format(new Date(value), 'd.M.', { locale: fi })}
  formatter={(value: number, name: string) => [`${Math.round(value)} km`, name]}
/>
<Legend 
  verticalAlign="bottom"
  height={36}
/>

<Line
  type="monotone"
  dataKey="actual"
  stroke="#facc15"
  strokeWidth={3}
  dot={{ r: 4 }}
  name="Toteutunut"
/>
<Line
  type="monotone"
  dataKey="expected"
  stroke="#60a5fa"
  strokeWidth={2}
  strokeDasharray="4 2"
  dot={{ r: 2 }}
  name="Tavoite"
/>

                  </LineChart>
                </ResponsiveContainer>
              </AnalyticsCard>

              {/* Mobile-Optimized KPI Cards - 2x2 Grid */}
              <div className="grid grid-cols-1 gap-4">
                <KPICard
                  icon={<Target className="w-5 h-5" />}
                  title="Matkaa pyöräilty"
                  value={`${analytics.completionPercentage.toFixed(1)}%`}
                  subtitle={`${Math.round(analytics.totalProgress).toLocaleString('fi-FI')} / ${challengeParams.totalDistance.toLocaleString('fi-FI')} km`}
                  trend={analytics.progressStatus}
                />
                <KPICard
                  icon={<TrendingUp className="w-5 h-5" />}
                  title="Päivittäinen tahti"
                  value={`${Math.round(analytics.dailyAverage)} km`}
                  subtitle={`Vaaditaan: ${Math.round(analytics.requiredDailyPace)} km/päivä`}
                  trend={analytics.dailyAverage >= analytics.requiredDailyPace ? 'ahead' : 'behind'}
                />
                <KPICard
                  icon={<Zap className="w-5 h-5" />}
                  title="Tahdin tehokkuus"
                  value={`${Math.round(analytics.paceEfficiency)}%`}
                  subtitle={`${analytics.momentum === 'accelerating' ? 'Kiihtyy' : analytics.momentum === 'slowing' ? 'Hidastuu' : 'Tasainen'}`}
                  trend={analytics.paceEfficiency >= 100 ? 'ahead' : 'behind'}
                />
                <KPICard
                  icon={<Calendar className="w-5 h-5" />}
                  title="Arvioitu valmistuminen"
                  value={analytics.projectedFinishDate ? format(analytics.projectedFinishDate, 'd.M.yyyy') : 'Ei dataa'}
                  subtitle={analytics.daysFromTarget > 0 ? `${analytics.daysFromTarget} pv myöhässä` : analytics.daysFromTarget < 0 ? `${Math.abs(analytics.daysFromTarget)} pv etuajassa` : 'Aikataulussa'}
                  trend={analytics.daysFromTarget <= 0 ? 'ahead' : 'behind'}
                />
              </div>

              {/* Mobile-Optimized Analytics Cards - Stack vertically */}
              <div className="space-y-4">
                <AnalyticsCard title="Tiimin kehitys">
                  <div className="space-y-3">
                    <MetricRow label="Keskiarvo per henkilö" value={`${Math.round(analytics.avgKmPerUser)} km`} />
                    <MetricRow label="Yhteensä suorituksia" value={analytics.totalActivities.toString()} />
                    <MetricRow label="Viikkotahti" value={`${Math.round(analytics.weeklyAverage)} km`} />
                    <MetricRow
                      label="Muutos viime viikosta"
                      value={`${analytics.weekDelta >= 0 ? '+' : ''}${Math.round(analytics.weekDelta)} km`}
                      status={analytics.weekDelta >= 0 ? 'ahead' : 'behind'}
                    />
                  </div>
                </AnalyticsCard>

                <AnalyticsCard title="Kisatilanne">
                  <div className="space-y-3">
                    <MetricRow label="Päiviä kulunut" value={`${analytics.daysSinceStart}`} />
                    <MetricRow label="Päiviä jäljellä" value={analytics.daysRemaining.toString()} />
                    <MetricRow label="Odotettu edistyminen" value={`${Math.round(analytics.expectedProgress)} km`} />
                    <MetricRow
                      label="Ero tavoitteeseen"
                      value={`${Math.round(analytics.progressDifference)} km`}
                      status={analytics.progressStatus}
                    />
                  </div>
                </AnalyticsCard>
              </div>
            </div>
          )}

          {activeSection === 'performance' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow border border-yellow-200">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
                  Kokonaissuoritus haasteen alusta
                </h3>
                <div className="text-sm text-gray-600 mb-4">
                  Järjestetty kokonaiskilometrien mukaan. Tavoite per henkilö: {Number(challengeParams.totalDistance / analytics.activeUsers).toFixed(0)} km
                </div>
              </div>
              
              <div className="space-y-3">
                {allTimeStats.map((stat, index) => (
                  <AllTimePerformanceCard key={stat.username} stat={stat} rank={index + 1} individualTarget={individualTarget} />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'records' && (
            <div className="space-y-4">
              {/* Mobile-Optimized Individual Records - Stack vertically */}
              {/* Individual Records */}
              <div className="grid md:grid-cols-3 gap-6">
                <RecordCard
                  icon={<Trophy className="w-6 h-6" />}
                  title="Paras päivä"
                  value={records.bestKmDay ? `${Math.round(records.bestKmDay.kilometers)} km` : 'Ei dataa'}
                  subtitle={records.bestKmDay ? records.bestKmDay.username : ''}
                  detail={records.bestKmDay ? format(new Date(records.bestKmDay.date), 'd.M.yyyy') : ''}
                />
                <RecordCard
                  icon={<Clock className="w-6 h-6" />}
                  title="Pisin treeni"
                  value={records.longestWorkout ? `${records.longestWorkout.duration} min` : 'Ei dataa'}
                  subtitle={records.longestWorkout ? records.longestWorkout.username : ''}
                  detail={records.longestWorkout ? records.longestWorkout.activity : ''}
                />
                <RecordCard
                  icon={<Award className="w-6 h-6" />}
                  title="Pisin putki"
                  value={records.longestStreaks.length > 0 ? `${records.longestStreaks[0].streakLength} päivää` : 'Ei dataa'}
                  subtitle={records.longestStreaks.length === 1
                    ? records.longestStreaks[0].username
                    : records.longestStreaks.length > 1
                      ? records.longestStreaks.map(s => s.username).join(' & ')
                      : ''
                  }
                  detail={records.longestStreaks.length > 0 && records.longestStreaks[0].startDate
                    ? records.longestStreaks.length === 1
                      ? `${format(new Date(records.longestStreaks[0].startDate), 'd.M.yyyy')} - ${format(new Date(records.longestStreaks[0].endDate), 'd.M.yyyy')}`
                      : records.longestStreaks.map(s => `${s.username} (${format(new Date(s.startDate), 'd.M')}-${format(new Date(s.endDate), 'd.M')})`).join(' | ')
                    : ''
                  }
                />
              </div>
              {/* Team Records */}
              <div className="bg-white p-4 rounded-xl shadow border border-yellow-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-yellow-500" />
                  Tiimin ennätykset
                </h3>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-1">🎯 Paras tiimipäivä</h4>
                    <p className="text-xl font-bold text-yellow-600">{Math.round(records.teamRecords.bestTeamDay.totalKm)} km</p>
                    <p className="text-sm text-gray-500">{records.teamRecords.bestTeamDay.date ? format(new Date(records.teamRecords.bestTeamDay.date), 'd.M.yyyy') : ''}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-1">⚡ Aktiivisin päivä</h4>
                    <p className="text-xl font-bold text-blue-600">{records.teamRecords.mostActiveDay.activities} suoritusta</p>
                    <p className="text-sm text-gray-500">{records.teamRecords.mostActiveDay.date ? format(new Date(records.teamRecords.mostActiveDay.date), 'd.M.yyyy') : ''}</p>
                  </div>
                </div>
              </div>

              {/* Popular Sports */}
              <div className="bg-white p-4 rounded-xl shadow border border-yellow-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-yellow-500" />
                  Suosituimmat Lajit
                </h3>
                <div className="space-y-3">
                  {records.topSports.map((sport, index) => (
                    <div key={sport.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-yellow-600 text-lg">{index + 1}.</span>
                        <span className="font-medium">{sport.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{sport.count} kertaa</div>
                        <div className="text-xs text-gray-500">{Math.round(sport.totalKm)} km</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

// Mobile-Optimized Helper Components
const KPICard = ({
  icon,
  title,
  value,
  subtitle,
  trend
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  trend: 'ahead' | 'behind' | 'onTrack';
}) => {
  const trendColor = trend === 'ahead' ? 'text-green-600' : trend === 'behind' ? 'text-red-600' : 'text-blue-600';
  const bgColor = trend === 'ahead' ? 'bg-green-50' : trend === 'behind' ? 'bg-red-50' : 'bg-blue-50';

  return (
    <div className={`${bgColor} p-4 rounded-xl shadow border`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={trendColor}>{icon}</div>
        <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className={`text-xl font-bold ${trendColor} mb-1`}>{value}</div>
      <div className="text-xs text-gray-600 leading-tight">{subtitle}</div>
    </div>
  );
};

const AnalyticsCard = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-4 rounded-xl shadow border border-yellow-200">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
    {children}
  </div>
);

const MetricRow = ({
  label,
  value,
  status
}: {
  label: string;
  value: string;
  status?: 'ahead' | 'behind' | 'onTrack';
}) => {
  const statusColor = status === 'ahead' ? 'text-green-600' :
    status === 'behind' ? 'text-red-600' :
      'text-gray-800';

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-600 text-sm">{label}:</span>
      <span className={`font-bold text-sm ${statusColor}`}>{value}</span>
    </div>
  );
};

const AllTimePerformanceCard = ({
  stat,
  rank,
}: {
  stat: AllTimeStats;
  rank: number;
  individualTarget: number;
}) => {
  const daysSinceLastActivity = stat.lastActivity ?
    Math.floor((new Date().getTime() - new Date(stat.lastActivity).getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="bg-white p-4 rounded-xl shadow border border-yellow-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={
                stat.profilePicture
                  ? `https://matka-xi.vercel.app/${stat.username}.png`
                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${stat.username}`
              }
              alt={`${stat.username}'s avatar`}
              width={40}
              height={40}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>

          <div className="text-xl flex-shrink-0">
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🚴‍♂️'}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base truncate mb-1">{stat.username}</h3>
            <div className="text-xs text-gray-600 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span>📅 {stat.activeDays} aktiivista päivää</span>
                {stat.streak > 1 && <span>🔥 {stat.streak} päivän streak</span>}
              </div>
              {daysSinceLastActivity !== null && daysSinceLastActivity > 3 && (
                <div className="text-orange-600">⚠️ {daysSinceLastActivity} päivää hiljaisuutta</div>
              )}
              {daysSinceLastActivity === null && (
                <div className="text-red-600">❌ Ei aktiviteetteja</div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-slate-600">{Number(stat.totalKm).toFixed(1)} km</div>
          <div className="text-xs text-gray-600">{Number(stat.completionPercentage).toFixed(1)}%</div>
          <div className="text-xs text-gray-500">
            ⌀ {stat.dailyAverage.toFixed(1)} km/pvä
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-slate-500 relative"
              style={{ width: `${Math.min(100, stat.completionPercentage)}%` }}
            >
              {stat.completionPercentage > 1 && (
                <div
                  className="absolute top-0 -right-2 text-sm"
                  style={{
                    transform: "translateY(-4px) scaleX(-1)",
                  }}
                >
                  🚴‍♂️
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecordCard = ({
  icon,
  title,
  value,
  subtitle,
  detail
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  detail: string;
}) => (
  <div className="bg-white p-4 rounded-xl shadow border border-yellow-200">
    <div className="flex items-center gap-2 mb-2">
      <div className="text-yellow-500">{icon}</div>
      <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
    </div>
    <div className="text-xl font-bold text-slate-600 mb-1">{value}</div>
    <div className="text-sm font-medium text-gray-700">{subtitle}</div>
    {detail && <div className="text-xs text-gray-500 mt-1 leading-tight">{detail}</div>}
  </div>
);

export default EnhancedTeamInsights;