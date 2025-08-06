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
  MapPin,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingDown
} from "lucide-react";
import { challengeParams } from "../constants/challengeParams";
import { format, differenceInDays } from "date-fns";

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
}

interface WeeklyStats {
  username: string;
  profilePicture?: string;
  weeklyKm: number;
  weeklyPercentage: number;
  dailyTarget: number;
  streak: number;
  lastActivity: string;
}

interface RecordData {
  bestKmDay: { username: string; kilometers: number; date: string } | null;
  longestWorkout: { username: string; duration: number; activity: string; date: string } | null;
  mostConsistent: { username: string; consistency: number; activeDays: number } | null;
  topSports: Array<{ name: string; count: number; totalKm: number }>;
  teamRecords: {
    bestTeamDay: { date: string; totalKm: number };
    mostActiveDay: { date: string; activities: number };
  };
}

const EnhancedTeamInsights = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'analytics' | 'performance' | 'records' | 'goals' | 'predictions'>('analytics');
  
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
    momentum: 'steady'
  });
  
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [records, setRecords] = useState<RecordData>({
    bestKmDay: null,
    longestWorkout: null,
    mostConsistent: null,
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
        calculateWeeklyStats(userData);
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
    
    const daysSinceStart = Math.max(1, differenceInDays(today, startDate));
    const daysRemaining = Math.max(0, differenceInDays(endDate, today));
    
    const dailyAverage = totalProgress / daysSinceStart;
    const weeklyAverage = dailyAverage * 7;
    
    const expectedProgress = (challengeParams.totalDistance * daysSinceStart) / challengeParams.totalDays;
    const progressDifference = Math.abs(totalProgress - expectedProgress);
    const progressStatus = totalProgress >= expectedProgress * 1.05 ? 'ahead' : 
                          totalProgress >= expectedProgress * 0.95 ? 'onTrack' : 'behind';
    
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
      momentum
    });
  };

  const calculateWeeklyStats = (userData: User[]) => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const weeklyTarget = Math.round(challengeParams.weeklyTarget / userData.length);
    
    const stats = userData.map(user => {
      const weekActivities = user.activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate >= weekStart && activityDate <= weekEnd;
      });
      
      const weeklyKm = weekActivities.reduce((sum, activity) => sum + activity.kilometers, 0);
      const weeklyPercentage = Math.min(200, (weeklyKm / weeklyTarget) * 100);
      const remainingKm = Math.max(0, weeklyTarget - weeklyKm);
      const daysLeftInWeek = Math.max(1, 7 - today.getDay());
      const dailyTarget = Math.round(remainingKm / daysLeftInWeek);
      
      // Calculate streak
      let streak = 0;
      const sortedDates = [...new Set(user.activities.map(a => a.date.split('T')[0]))].sort().reverse();
      const todayStr = today.toISOString().split('T')[0];
      
      for (let i = 0; i < sortedDates.length; i++) {
        const dateStr = sortedDates[i];
        const date = new Date(dateStr);
        const daysDiff = differenceInDays(today, date);
        
        if (daysDiff === i || (i === 0 && daysDiff <= 1)) {
          streak++;
        } else {
          break;
        }
      }
      
      const lastActivity = user.activities.length > 0 ? 
        user.activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date : '';
      
      return {
        username: user.username,
        profilePicture: user.profilePicture,
        weeklyKm,
        weeklyPercentage,
        dailyTarget,
        streak,
        lastActivity
      };
    }).sort((a, b) => b.weeklyKm - a.weeklyKm);
    
    setWeeklyStats(stats);
  };

  const calculateRecords = (userData: User[]) => {
    const startDate = new Date(challengeParams.startDate);
    const endDate = new Date(challengeParams.endDate);
    
    let bestKmDay: { username: string; kilometers: number; date: string } | null = null;
    let longestWorkout: { username: string; duration: number; activity: string; date: string } | null = null;
    let mostConsistent: { username: string; consistency: number; activeDays: number } | null = null;
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
      
      // Calculate consistency (active days vs total days)
      const activeDays = Object.keys(dailyTotals).length;
      const totalDays = Math.max(1, differenceInDays(new Date(), startDate));
      const consistency = (activeDays / totalDays) * 100;
      
      if (!mostConsistent || consistency > mostConsistent.consistency) {
        mostConsistent = {
          username: user.username,
          consistency,
          activeDays
        };
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
    
    const topSports = Object.entries(sportCounts)
      .sort(([,a], [,b]) => b.count - a.count)
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
      mostConsistent,
      topSports,
      teamRecords: {
        bestTeamDay,
        mostActiveDay
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-yellow-500 rounded-full border-t-transparent" />
      </div>
    );
  }

  const sections = [
    { key: 'analytics', label: 'Tiimin analyysi', icon: BarChart3 },
    { key: 'performance', label: 'Suorituskyky', icon: TrendingUp },
    { key: 'records', label: 'Ennätykset', icon: Trophy },
    { key: 'goals', label: 'Tavoitteet', icon: Target },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-slate-600 bg-clip-text text-transparent mb-4">
Analyysit
          </h1>
          <p className="text-gray-600 mb-6">Syvälliset näkemykset tiimin suorituskyvystä ja tavoitteiden saavuttamisesta</p>
          
          {/* Quick Status */}
          <div className={`p-4 rounded-xl border-2 mb-6 ${
            analytics.progressStatus === 'ahead' ? 'bg-green-50 border-green-300' :
            analytics.progressStatus === 'behind' ? 'bg-red-50 border-red-300' :
            'bg-blue-50 border-blue-300'
          }`}>
            <div className="flex items-center justify-center gap-3">
              <div className="text-2xl">
                {analytics.progressStatus === 'ahead' ? '🚀' : 
                 analytics.progressStatus === 'behind' ? '⚠️' : '🎯'}
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">
                  {analytics.progressStatus === 'ahead' ? 'Etuajassa!' :
                   analytics.progressStatus === 'behind' ? 'Tavoitteesta jäljessä' :
                   'Aikataulussa'}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(analytics.progressDifference)} km {analytics.progressStatus === 'ahead' ? 'yli' : 
                   analytics.progressStatus === 'behind' ? 'alle' : ''} tavoitteen
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center">
          <div className="bg-white rounded-xl p-1 shadow-lg border border-yellow-200 inline-flex flex-wrap">
            {sections.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  activeSection === key
                    ? 'bg-yellow-400 text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
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
            <div className="space-y-6">
              {/* Key Performance Indicators */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                  icon={<Target className="w-6 h-6" />}
                  title="Valmistumisaste"
                  value={`${analytics.completionPercentage.toFixed(1)}%`}
                  subtitle={`${Math.round(analytics.totalProgress).toLocaleString('fi-FI')} / ${challengeParams.totalDistance.toLocaleString('fi-FI')} km`}
                  trend={analytics.progressStatus}
                />
                <KPICard
                  icon={<TrendingUp className="w-6 h-6" />}
                  title="Päivittäinen tahti"
                  value={`${Math.round(analytics.dailyAverage)} km`}
                  subtitle={`Vaaditaan: ${Math.round(analytics.requiredDailyPace)} km/päivä`}
                  trend={analytics.dailyAverage >= analytics.requiredDailyPace ? 'ahead' : 'behind'}
                />
                <KPICard
                  icon={<Zap className="w-6 h-6" />}
                  title="Tahdin tehokkuus"
                  value={`${Math.round(analytics.paceEfficiency)}%`}
                  subtitle={`${analytics.momentum === 'accelerating' ? 'Kiihtyy' : analytics.momentum === 'slowing' ? 'Hidastuu' : 'Tasainen'}`}
                  trend={analytics.paceEfficiency >= 100 ? 'ahead' : 'behind'}
                />
                <KPICard
                  icon={<Calendar className="w-6 h-6" />}
                  title="Arvioitu valmistuminen"
                  value={analytics.projectedFinishDate ? format(analytics.projectedFinishDate, 'd.M.yyyy') : 'Ei dataa'}
                  subtitle={analytics.daysFromTarget > 0 ? `${analytics.daysFromTarget} pv myöhässä` : analytics.daysFromTarget < 0 ? `${Math.abs(analytics.daysFromTarget)} pv etuajassa` : 'Aikataulussa'}
                  trend={analytics.daysFromTarget <= 0 ? 'ahead' : 'behind'}
                />
              </div>

              {/* Detailed Analytics */}
              <div className="grid md:grid-cols-2 gap-6">
                <AnalyticsCard title="Tiimin kehitys">
                  <div className="space-y-4">
                    <MetricRow label="Keskiarvo per henkilö" value={`${Math.round(analytics.avgKmPerUser)} km`} />
                    <MetricRow label="Yhteensä suorituksia" value={analytics.totalActivities.toString()} />
                    <MetricRow label="Aktiiviset jäsenet" value={`${analytics.activeUsers}/${analytics.activeUsers}`} />
                    <MetricRow label="Viikkotahti" value={`${Math.round(analytics.weeklyAverage)} km`} />
                  </div>
                </AnalyticsCard>
                
                <AnalyticsCard title="Kisatilanne">
                  <div className="space-y-4">
                    <MetricRow label="Päiviä kulunut" value={`${analytics.daysSinceStart}/${challengeParams.totalDays}`} />
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
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">🏃‍♂️ Viikon Suorituskyky</h2>
              <div className="grid gap-4">
                {weeklyStats.map((stat, index) => (
                  <PerformanceCard key={stat.username} stat={stat} rank={index + 1} />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'records' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">🏆 Tiimin Ennätykset</h2>
              
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
                  title="Johdonmukaisin"
                  value={records.mostConsistent ? `${Math.round(records.mostConsistent.consistency)}%` : 'Ei dataa'}
                  subtitle={records.mostConsistent ? records.mostConsistent.username : ''}
                  detail={records.mostConsistent ? `${records.mostConsistent.activeDays} aktiivista päivää` : ''}
                />
              </div>

              {/* Team Records */}
              <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-yellow-500" />
                  Tiimin ennätykset
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">🎯 Paras tiimipäivä</h4>
                    <p className="text-2xl font-bold text-yellow-600">{Math.round(records.teamRecords.bestTeamDay.totalKm)} km</p>
                    <p className="text-sm text-gray-500">{records.teamRecords.bestTeamDay.date ? format(new Date(records.teamRecords.bestTeamDay.date), 'd.M.yyyy') : ''}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">⚡ Aktiivisin päivä</h4>
                    <p className="text-2xl font-bold text-blue-600">{records.teamRecords.mostActiveDay.activities} suoritusta</p>
                    <p className="text-sm text-gray-500">{records.teamRecords.mostActiveDay.date ? format(new Date(records.teamRecords.mostActiveDay.date), 'd.M.yyyy') : ''}</p>
                  </div>
                </div>
              </div>

              {/* Popular Sports */}
              <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-yellow-500" />
                  Suosituimmat Lajit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {records.topSports.map((sport, index) => (
                    <div key={sport.name} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-yellow-600">{index + 1}.</span>
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

          {activeSection === 'goals' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-center text-gray-800">🎯 Tavoitteiden Seuranta</h2>
              
              {/* Goal Achievement Overview */}
              <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
                <h3 className="text-xl font-semibold mb-6">🏁 Haasteen Kokonaistilanne</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span>Matka suoritettu</span>
                      <span>{analytics.completionPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                        style={{ width: `${Math.min(analytics.completionPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span>Aika kulunut</span>
                      <span>{Math.round((analytics.daysSinceStart / challengeParams.totalDays) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                        style={{ width: `${Math.min((analytics.daysSinceStart / challengeParams.totalDays) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pace Requirements */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Nykyinen Tahti
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Päivittäin:</span>
                      <span className="font-bold">{Math.round(analytics.dailyAverage)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Viikottain:</span>
                      <span className="font-bold">{Math.round(analytics.weeklyAverage)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per henkilö/viikko:</span>
                      <span className="font-bold">{Math.round(analytics.weeklyAverage / analytics.activeUsers)} km</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-500" />
                    Vaadittu Tahti
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Päivittäin:</span>
                      <span className="font-bold">{Math.round(analytics.requiredDailyPace)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Viikottain:</span>
                      <span className="font-bold">{Math.round(challengeParams.weeklyTarget)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Per henkilö/viikko:</span>
                      <span className="font-bold">{Math.round(challengeParams.weeklyTarget / analytics.activeUsers)} km</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Helper Components
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
    <div className={`${bgColor} p-6 rounded-xl shadow border`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={trendColor}>{icon}</div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <div className={`text-2xl font-bold ${trendColor} mb-1`}>{value}</div>
      <div className="text-sm text-gray-600">{subtitle}</div>
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
  <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
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
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}:</span>
      <span className={`font-bold ${statusColor}`}>{value}</span>
    </div>
  );
};

const PerformanceCard = ({ 
  stat, 
  rank 
}: { 
  stat: WeeklyStats; 
  rank: number; 
}) => {
  const daysSinceLastActivity = stat.lastActivity ? 
    Math.floor((new Date().getTime() - new Date(stat.lastActivity).getTime()) / (1000 * 60 * 60 * 24)) : 3;
  
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-yellow-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={
                stat.profilePicture
                  ? `https://matka-xi.vercel.app/${stat.username}.png`
                  : `https://api.dicebear.com/7.x/adventurer/svg?seed=${stat.username}`
              }
              alt={`${stat.username}'s avatar`}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
          
          <div className="text-2xl">
            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🚴‍♂️'}
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">{stat.username}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Sija {rank}</span>
              {stat.streak > 0 && <span>🔥 {stat.streak} päivän streak</span>}
              {daysSinceLastActivity > 3 && (
                <span className="text-orange-600">⚠️ {daysSinceLastActivity}d hiljaisuutta</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl font-bold text-slate-600">{Math.round(stat.weeklyKm)} km</div>
          <div className="text-sm text-gray-600">{Math.round(stat.weeklyPercentage)}% tavoitteesta</div>
          {stat.dailyTarget > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              Tarvitaan: {stat.dailyTarget} km/päivä
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-slate-500"
            style={{ width: `${Math.min(100, stat.weeklyPercentage)}%` }}
          />
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
  <div className="bg-white p-6 rounded-xl shadow border border-yellow-200">
    <div className="flex items-center gap-3 mb-3">
      <div className="text-yellow-500">{icon}</div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="text-2xl font-bold text-slate-600 mb-1">{value}</div>
    <div className="text-sm font-medium text-gray-700">{subtitle}</div>
    {detail && <div className="text-xs text-gray-500 mt-1">{detail}</div>}
  </div>
);

export default EnhancedTeamInsights;